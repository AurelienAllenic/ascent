import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import formidable, { File } from "formidable";
import { authOptions } from "../../../../lib/auth";

// Prisma client
const prisma = new PrismaClient();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

// Types for form data
interface FormFields {
  titleEn?: string;
  titleFr?: string;
  generalDescriptionEn?: string;
  generalDescriptionFr?: string;
  userId?: string;
  id?: string;
  imageDescriptionsEn?: string[];
  imageDescriptionsFr?: string[];
}

interface FormFiles {
  featuredImage?: File | File[];
  images?: File | File[];
}

const parseForm = (req: NextRequest): Promise<{ fields: FormFields; files: FormFiles }> =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else {
        // Convert array-like fields to arrays for descriptions
        const parsedFields: FormFields = {
          ...fields,
          imageDescriptionsEn: Array.isArray(fields.imageDescriptionsEn)
            ? fields.imageDescriptionsEn
            : fields.imageDescriptionsEn
              ? [fields.imageDescriptionsEn]
              : [],
          imageDescriptionsFr: Array.isArray(fields.imageDescriptionsFr)
            ? fields.imageDescriptionsFr
            : fields.imageDescriptionsFr
              ? [fields.imageDescriptionsFr]
              : [],
        };
        resolve({ fields: parsedFields, files: files as FormFiles });
      }
    });
  });

// ---------------- GET ----------------
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { images: true },
    });

    // Map to desired output structure (include id for edit/delete)
    const formattedProjects = projects.map((project: { id: string; titleEn: string; titleFr: string; featuredImage: string; generalDescriptionEn: string | null; generalDescriptionFr: string | null; images: { id: string; url: string; descriptionEn: string; descriptionFr: string }[] }) => ({
      id: project.id,
      titleEn: project.titleEn,
      titleFr: project.titleFr,
      featuredImage: project.featuredImage,
      generalDescriptionEn: project.generalDescriptionEn ?? undefined,
      generalDescriptionFr: project.generalDescriptionFr ?? undefined,
      images: project.images.map((image: { id: string; url: string; descriptionEn: string; descriptionFr: string }) => ({
        id: image.id,
        url: image.url,
        descriptionEn: image.descriptionEn,
        descriptionFr: image.descriptionFr,
      })),
    }));

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// ---------------- POST ----------------
// Utilise request.formData() (compatible App Router) au lieu de formidable
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const titleEn = (formData.get("titleEn") as string | null)?.trim();
    const titleFr = (formData.get("titleFr") as string | null)?.trim();
    const generalDescriptionEn = (formData.get("generalDescriptionEn") as string | null) || undefined;
    const generalDescriptionFr = (formData.get("generalDescriptionFr") as string | null) || undefined;
    const featuredImageFile = formData.get("featuredImage") as File | null;

    let userId: string | null = (formData.get("userId") as string | null)?.trim() || null;
    if (!userId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Utiliser l'ObjectId MongoDB du User (session.user.id / token.sub = ID fournisseur OAuth, pas l'_id Prisma)
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }
      userId = user.id;
    }

    if (!titleEn || !titleFr) {
      return NextResponse.json({ error: "Missing required fields: titleEn, titleFr" }, { status: 400 });
    }

    if (!featuredImageFile || typeof featuredImageFile === "string" || !(featuredImageFile as File).size) {
      return NextResponse.json({ error: "Featured image is required" }, { status: 400 });
    }

    const file = featuredImageFile as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString("base64")}`, {
      folder: "projects",
      resource_type: "auto",
    });
    const featuredImage = result.secure_url;

    const project = await prisma.project.create({
      data: {
        titleEn,
        titleFr,
        generalDescriptionEn: generalDescriptionEn || null,
        generalDescriptionFr: generalDescriptionFr || null,
        featuredImage,
        userId,
      },
    });

    const createdProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: { images: true },
    });

    const formattedProject = {
      id: createdProject!.id,
      titleEn: createdProject!.titleEn,
      titleFr: createdProject!.titleFr,
      featuredImage: createdProject!.featuredImage,
      generalDescriptionEn: createdProject!.generalDescriptionEn ?? undefined,
      generalDescriptionFr: createdProject!.generalDescriptionFr ?? undefined,
      images: createdProject!.images.map((image: { id: string; url: string; descriptionEn: string; descriptionFr: string }) => ({
        id: image.id,
        url: image.url,
        descriptionEn: image.descriptionEn,
        descriptionFr: image.descriptionFr,
      })),
    };

    return NextResponse.json(formattedProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// ---------------- PUT ----------------
export async function PUT(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);
    const projectId = fields.id;
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Validate required fields
    if (!fields.titleEn || !fields.titleFr) {
      return NextResponse.json({ error: "Missing required fields: titleEn, titleFr" }, { status: 400 });
    }

    // Upload new featured image if provided
    let featuredImage: string | undefined;
    if (files.featuredImage) {
      const file = Array.isArray(files.featuredImage) ? files.featuredImage[0] : files.featuredImage;
      const result = await cloudinary.uploader.upload(file.filepath, { folder: "projects" });
      featuredImage = result.secure_url;

      // Delete old featured image from Cloudinary if it exists
      const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
      if (existingProject?.featuredImage) {
        const publicId = existingProject.featuredImage.split("/").pop()?.split(".")[0];
        if (publicId) await cloudinary.uploader.destroy(`projects/${publicId}`);
      }
    }

    // Update project
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        titleEn: fields.titleEn,
        titleFr: fields.titleFr,
        generalDescriptionEn: fields.generalDescriptionEn,
        generalDescriptionFr: fields.generalDescriptionFr,
        ...(featuredImage ? { featuredImage } : {}),
      },
    });

    // Handle new secondary images
    if (files.images && fields.imageDescriptionsEn && fields.imageDescriptionsFr) {
      const imagesArray = Array.isArray(files.images) ? files.images : [files.images];
      const descriptionsEn = fields.imageDescriptionsEn;
      const descriptionsFr = fields.imageDescriptionsFr;

      if (imagesArray.length !== descriptionsEn.length || imagesArray.length !== descriptionsFr.length) {
        return NextResponse.json(
          { error: "Number of images must match number of descriptions" },
          { status: 400 }
        );
      }

      // Delete existing images (skip Cloudinary deletion for now)
      await prisma.projectImage.deleteMany({ where: { projectId } });

      // Upload new images
      for (let i = 0; i < imagesArray.length; i++) {
        const img = imagesArray[i];
        const res = await cloudinary.uploader.upload(img.filepath, { folder: "projects" });

        await prisma.projectImage.create({
          data: {
            projectId: project.id,
            url: res.secure_url,
            descriptionEn: descriptionsEn[i],
            descriptionFr: descriptionsFr[i],
            publicId: res.public_id, // Commented out to avoid type error
          },
        });
      }
    }

    // Fetch updated project with images
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true },
    });

    const formattedProject = {
      id: updatedProject!.id,
      titleEn: updatedProject!.titleEn,
      titleFr: updatedProject!.titleFr,
      featuredImage: updatedProject!.featuredImage,
      generalDescriptionEn: updatedProject!.generalDescriptionEn ?? undefined,
      generalDescriptionFr: updatedProject!.generalDescriptionFr ?? undefined,
      images: updatedProject!.images.map((image: { id: string; url: string; descriptionEn: string; descriptionFr: string }) => ({
        id: image.id,
        url: image.url,
        descriptionEn: image.descriptionEn,
        descriptionFr: image.descriptionFr,
      })),
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// ---------------- PATCH (text & image descriptions only, no file upload) ----------------
interface PatchBody {
  id: string;
  titleEn?: string;
  titleFr?: string;
  generalDescriptionEn?: string;
  generalDescriptionFr?: string;
  images?: { id: string; descriptionEn: string; descriptionFr: string }[];
}

export async function PATCH(req: NextRequest) {
  try {
    const body: PatchBody = await req.json();
    const { id: projectId, titleEn, titleFr, generalDescriptionEn, generalDescriptionFr, images } = body;
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const data: {
      titleEn?: string;
      titleFr?: string;
      generalDescriptionEn?: string;
      generalDescriptionFr?: string;
    } = {};
    if (titleEn !== undefined) data.titleEn = titleEn;
    if (titleFr !== undefined) data.titleFr = titleFr;
    if (generalDescriptionEn !== undefined) data.generalDescriptionEn = generalDescriptionEn;
    if (generalDescriptionFr !== undefined) data.generalDescriptionFr = generalDescriptionFr;

    if (Object.keys(data).length > 0) {
      await prisma.project.update({
        where: { id: projectId },
        data,
      });
    }

    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.id && (img.descriptionEn !== undefined || img.descriptionFr !== undefined)) {
          await prisma.projectImage.update({
            where: { id: img.id },
            data: {
              ...(img.descriptionEn !== undefined && { descriptionEn: img.descriptionEn }),
              ...(img.descriptionFr !== undefined && { descriptionFr: img.descriptionFr }),
            },
          });
        }
      }
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true },
    });

    const formattedProject = updatedProject
      ? {
          id: updatedProject.id,
          titleEn: updatedProject.titleEn,
          titleFr: updatedProject.titleFr,
          featuredImage: updatedProject.featuredImage,
          generalDescriptionEn: updatedProject.generalDescriptionEn ?? undefined,
          generalDescriptionFr: updatedProject.generalDescriptionFr ?? undefined,
          images: updatedProject.images.map((image: { id: string; url: string; descriptionEn: string; descriptionFr: string }) => ({
            id: image.id,
            url: image.url,
            descriptionEn: image.descriptionEn,
            descriptionFr: image.descriptionFr,
          })),
        }
      : null;

    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error("Error patching project:", error);
    return NextResponse.json({ error: "Failed to patch project" }, { status: 500 });
  }
}

// ---------------- DELETE ----------------
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Delete associated images from database (skip Cloudinary deletion for now)
    await prisma.projectImage.deleteMany({ where: { projectId } });

    // Delete project
    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}