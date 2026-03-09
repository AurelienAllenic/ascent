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
    const projectId = (formData.get("id") as string | null)?.trim();
    const file = formData.get("featuredImage") as File | null;

    if (!projectId || !file || typeof file === "string" || !file.size) {
      return NextResponse.json(
        { error: "id and featuredImage file required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await (file as unknown as Blob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await cloudinary.uploader.upload(
      `data:${(file as unknown as { type?: string }).type ?? "image/jpeg"};base64,${buffer.toString("base64")}`,
      { folder: "projects", resource_type: "auto" }
    );

    await prisma.project.update({
      where: { id: projectId },
      data: { featuredImage: result.secure_url },
    });

    const updated = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true },
    });

    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const formatted = {
      id: updated.id,
      titleEn: updated.titleEn,
      titleFr: updated.titleFr,
      featuredImage: updated.featuredImage,
      generalDescriptionEn: updated.generalDescriptionEn ?? undefined,
      generalDescriptionFr: updated.generalDescriptionFr ?? undefined,
      images: updated.images.map((img) => ({
        id: img.id,
        url: img.url,
        descriptionEn: img.descriptionEn,
        descriptionFr: img.descriptionFr,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error uploading featured image:", error);
    return NextResponse.json(
      { error: "Failed to upload featured image" },
      { status: 500 }
    );
  }
}
