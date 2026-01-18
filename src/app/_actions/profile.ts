"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { put } from "@vercel/blob";

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
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `profiles/${session.user.id}-${uniqueSuffix}-${imageFile.name}`;
        
        const blob = await put(filename, imageFile, {
          access: 'public',
        });
        
        imageUrl = blob.url;
      } catch (error) {
          console.error("Error uploading to blob:", error);
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
