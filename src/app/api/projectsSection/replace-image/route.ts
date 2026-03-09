import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { authOptions } from "../../../../../lib/auth";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const projectId = (formData.get("projectId") as string | null)?.trim();
    const imageId = (formData.get("imageId") as string | null)?.trim();
    const file = formData.get("file") as File | null;

    if (!projectId || !imageId || !file || typeof file === "string" || !file.size) {
      return NextResponse.json(
        { error: "projectId, imageId and file required" },
        { status: 400 }
      );
    }

    const image = await prisma.projectImage.findFirst({
      where: { id: imageId, projectId },
    });
    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const arrayBuffer = await (file as unknown as Blob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await cloudinary.uploader.upload(
      `data:${(file as unknown as { type?: string }).type ?? "image/jpeg"};base64,${buffer.toString("base64")}`,
      { folder: "projects", resource_type: "auto" }
    );

    await prisma.projectImage.update({
      where: { id: imageId },
      data: { url: result.secure_url },
    });

    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true },
    });

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const formatted = {
      id: updatedProject.id,
      titleEn: updatedProject.titleEn,
      titleFr: updatedProject.titleFr,
      featuredImage: updatedProject.featuredImage,
      generalDescriptionEn: updatedProject.generalDescriptionEn ?? undefined,
      generalDescriptionFr: updatedProject.generalDescriptionFr ?? undefined,
      images: updatedProject.images.map((img) => ({
        id: img.id,
        url: img.url,
        descriptionEn: img.descriptionEn,
        descriptionFr: img.descriptionFr,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error replacing project image:", error);
    return NextResponse.json(
      { error: "Failed to replace image" },
      { status: 500 }
    );
  }
}
