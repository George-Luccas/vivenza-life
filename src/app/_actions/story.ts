"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { put } from "@vercel/blob"

export async function createStory(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const file = formData.get("imageFile") as File
    if (!file) {
        throw new Error("Image file is required")
    }

    let imageUrl = ""
    
    try {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const filename = `stories/${session.user.id}-${uniqueSuffix}-${file.name}`
        
        const blob = await put(filename, file, {
            access: 'public',
        })
        
        imageUrl = blob.url
    } catch (error) {
        console.error("Error uploading story:", error)
        throw new Error("Failed to upload story")
    }

    // Story expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.story.create({
        data: {
            imageUrl,
            userId: session.user.id,
            expiresAt
        }
    })

    revalidatePath("/")
    return { success: true }
}

export async function getStories() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // Fetch stories that haven't expired
    // We want to group by user.
    // Prisma doesn't support 'groupBy' with 'include' user details easily in a way that returns the structure we want for UI.
    // Easier to fetch all valid stories and group in JS, or fetch users with their active stories.
    
    // Fetch users who have at least one active story
    const usersWithStories = await prisma.user.findMany({
        where: {
            stories: {
                some: {
                    expiresAt: {
                        gt: new Date()
                    }
                }
            }
        },
        select: {
            id: true,
            name: true,
            image: true,
            stories: {
                where: {
                    expiresAt: {
                        gt: new Date()
                    }
                },
                select: {
                    id: true,
                    imageUrl: true,
                    createdAt: true
                    // We could track 'viewed' status here if we had a StoryView model.
                    // For MVP, if it's in the list, it's available.
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    })
    
    // Move current user to front if they have stories, or handle purely on UI?
    // UI usually puts "My Story" first.
    
    return usersWithStories
}
