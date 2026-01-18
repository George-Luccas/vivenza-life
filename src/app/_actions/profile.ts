"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const imageFile = formData.get("imageFile") as File | null;
  
  if (!name || name.trim().length === 0) {
      return { error: "Name is required" };
  }

  let imageUrl = session.user.image;

  // Handle new image upload if provided
  if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
    
        // Save to public/uploads
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
    
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const filepath = join(uploadDir, filename);
    
        await writeFile(filepath, buffer);
    
        imageUrl = `/uploads/${filename}`;
      } catch (error) {
          console.error("Error uploading image:", error);
          return { error: "Failed to upload image" };
      }
  }

  try {
      await prisma.user.update({
          where: { id: session.user.id },
          data: {
              name,
              image: imageUrl
          }
      });
  } catch (error) {
      console.error("Error updating user:", error);
      return { error: "Failed to update profile" };
  }

  revalidatePath("/profile");
  revalidatePath("/");
  
  return { success: true };
}
