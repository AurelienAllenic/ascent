import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';
import path from "path";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  const userId = process.env.USER_ID;

  const projectsData = [
    {
      titleEn: "Project 1",
      titleFr: "Projet 1",
      featuredImagePath: "./public/assets/projects/project-1.jpg",
      generalDescriptionEn: "This project emphasizes bold entrance design combined with modern architectural elegance.",
      generalDescriptionFr: "Ce projet met en valeur un design d'entrée audacieux combiné à une élégance architecturale moderne.",
      imagesPaths: [
        { path: "./public/assets/projects/project-1.jpg", descriptionEn: "The main entrance was our main concern during this wonderful design creation.", descriptionFr: "L'entrée principale était notre préoccupation majeure lors de la création de ce merveilleux design." },
        { path: "./public/assets/projects/project-2.jpg", descriptionEn: "This design showcases our innovative approach to modern architecture.", descriptionFr: "Ce design met en valeur notre approche innovante de l'architecture moderne." },
        { path: "./public/assets/projects/project-3.jpg", descriptionEn: "A detailed view of the structural framework used in this project.", descriptionFr: "Une vue détaillée du cadre structurel utilisé dans ce projet." },
      ]
    },
    {
      titleEn: "Project 2",
      titleFr: "Projet 2",
      featuredImagePath: "./public/assets/projects/project-2.jpg",
      generalDescriptionEn: "A contemporary masterpiece focusing on spiraling structures and immersive interior design.",
      generalDescriptionFr: "Un chef-d'œuvre contemporain mettant en valeur les structures spirales et l'intérieur immersif.",
      imagesPaths: [
        { path: "./public/assets/projects/project-1.jpg", descriptionEn: "Exploring the unique spiral structure of this building.", descriptionFr: "Exploration de la structure spirale unique de ce bâtiment." },
        { path: "./public/assets/projects/project-2.jpg", descriptionEn: "A closer look at the interior design elements.", descriptionFr: "Un regard plus près sur les éléments de design intérieur." },
        { path: "./public/assets/projects/project-3.jpg", descriptionEn: "The structural integrity is highlighted in this image.", descriptionFr: "L'intégrité structurelle est mise en valeur dans cette image." },
      ]
    },
    {
      titleEn: "Project 3",
      titleFr: "Projet 3",
      featuredImagePath: "./public/assets/projects/project-3.jpg",
      generalDescriptionEn: "Combining visual impact and robust engineering, this project exemplifies form meeting function.",
      generalDescriptionFr: "Combinant l'impact visuel et l'ingénierie robuste, ce projet illustre la mise en fonction de la forme.",
      imagesPaths: [
        { path: "./public/assets/projects/project-1.jpg", descriptionEn: "Exploring the unique spiral structure of this building.", descriptionFr: "Exploration de la structure spirale unique de ce bâtiment." },
        { path: "./public/assets/projects/project-2.jpg", descriptionEn: "A closer look at the interior design elements.", descriptionFr: "Un regard plus près sur les éléments de design intérieur." },
        { path: "./public/assets/projects/project-3.jpg", descriptionEn: "The structural integrity is highlighted in this image.", descriptionFr: "L'intégrité structurelle est mise en valeur dans cette image." },
      ]
    }
  ];

  for (const proj of projectsData) {
    // Upload featured image
    const featuredRes = await cloudinary.uploader.upload(path.resolve(proj.featuredImagePath), {
      folder: "projects",
    });

    // Upload secondary images
    const imagesRes = [];
    for (const img of proj.imagesPaths) {
      const res = await cloudinary.uploader.upload(path.resolve(img.path), {
        folder: "projects",
      });
      imagesRes.push({
        url: res.secure_url,
        publicId: res.public_id,
        descriptionEn: img.descriptionEn,
        descriptionFr: img.descriptionFr
      });
    }

    // Create project in DB
    const project = await prisma.project.create({
      data: {
        titleEn: proj.titleEn,
        titleFr: proj.titleFr,
        featuredImage: featuredRes.secure_url,
        generalDescriptionEn: proj.generalDescriptionEn,
        generalDescriptionFr: proj.generalDescriptionFr,
        userId,
        images: {
          create: imagesRes
        }
      },
      include: { images: true }
    });

    console.log(`Project créé : ${project.titleEn}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());
