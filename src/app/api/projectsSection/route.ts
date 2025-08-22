import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import formidable, { File } from "formidable";

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

    // Map to desired output structure
    const formattedProjects = projects.map((project: { titleEn: any; titleFr: any; featuredImage: any; generalDescriptionEn: any; generalDescriptionFr: any; images: any; }) => ({
      titleEn: project.titleEn,
      titleFr: project.titleFr,
      featuredImage: project.featuredImage,
      generalDescriptionEn: project.generalDescriptionEn ?? undefined,
      generalDescriptionFr: project.generalDescriptionFr ?? undefined,
      images: project.images.map((image: { url: any; descriptionEn: any; descriptionFr: any; }) => ({
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
export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);

    // Validate required fields
    if (!fields.titleEn || !fields.titleFr || !fields.userId) {
      return NextResponse.json({ error: "Missing required fields: titleEn, titleFr, userId" }, { status: 400 });
    }

    // Upload featured image
    let featuredImage = "";
    if (files.featuredImage) {
      const file = Array.isArray(files.featuredImage) ? files.featuredImage[0] : files.featuredImage;
      const result = await cloudinary.uploader.upload(file.filepath, { folder: "projects" });
      featuredImage = result.secure_url;
    } else {
      return NextResponse.json({ error: "Featured image is required" }, { status: 400 });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        titleEn: fields.titleEn,
        titleFr: fields.titleFr,
        generalDescriptionEn: fields.generalDescriptionEn,
        generalDescriptionFr: fields.generalDescriptionFr,
        featuredImage,
        userId: fields.userId,
      },
    });

    // Upload secondary images
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

    // Fetch the created project with images for response
    const createdProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: { images: true },
    });

    const formattedProject = {
      titleEn: createdProject!.titleEn,
      titleFr: createdProject!.titleFr,
      featuredImage: createdProject!.featuredImage,
      generalDescriptionEn: createdProject!.generalDescriptionEn ?? undefined,
      generalDescriptionFr: createdProject!.generalDescriptionFr ?? undefined,
      images: createdProject!.images.map((image: { url: any; descriptionEn: any; descriptionFr: any; }) => ({
        url: image.url,
        descriptionEn: image.descriptionEn,
        descriptionFr: image.descriptionFr,
      })),
    };

    return NextResponse.json(formattedProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
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
      titleEn: updatedProject!.titleEn,
      titleFr: updatedProject!.titleFr,
      featuredImage: updatedProject!.featuredImage,
      generalDescriptionEn: updatedProject!.generalDescriptionEn ?? undefined,
      generalDescriptionFr: updatedProject!.generalDescriptionFr ?? undefined,
      images: updatedProject!.images.map((image: { url: any; descriptionEn: any; descriptionFr: any; }) => ({
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