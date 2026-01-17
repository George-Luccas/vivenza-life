"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";

export async function createPost(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const caption = formData.get("caption") as string;
  const file = formData.get("imageFile") as File;

  if (!file) {
    throw new Error("Image file is required");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save to public/uploads
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, buffer);

  const imageUrl = `/uploads/${filename}`;

  await prisma.post.create({
    data: {
      caption,
      imageUrl,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function sharePost(originalPostId: string, caption?: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const originalPost = await prisma.post.findUnique({
        where: { id: originalPostId }
    });

    if (!originalPost) {
        return { error: "Original post not found" };
    }

    await prisma.post.create({
        data: {
            caption: caption || "", // Empty caption for simple reposts
            imageUrl: originalPost.imageUrl, // Reuse image URL
            userId: session.user.id,
            originalPostId: originalPost.id,
        },
    });

    revalidatePath("/");
    return { success: true };
}

export async function getFeed() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      originalPost: {
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                }
            }
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          reposts: true,
        },
      },
      likes: {
          select: {
              userId: true
          }
      }
    },
  });

  return posts;
}

export async function toggleLike(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
     return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }

  revalidatePath("/");
  return { success: true };
}

export async function addComment(postId: string, content: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    if (!content.trim()) {
        return { error: "Content is required" };
    }

    await prisma.comment.create({
        data: {
            content,
            postId,
            userId: session.user.id,
        },
    });

    revalidatePath("/");
    return { success: true };
}

export async function getComments(postId: string) {
    const comments = await prisma.comment.findMany({
        where: { postId },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return comments;
}

export async function getUserPosts(userId?: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const targetUserId = userId || session?.user?.id;

  if (!targetUserId) {
    return [];
  }

  return await prisma.post.findMany({
    where: { userId: targetUserId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      originalPost: {
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                }
            }
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
          reposts: true,
        },
      },
      likes: {
          select: {
              userId: true
          }
      }
    },
  });
}

export async function deletePost(postId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true }
    });

    if (!post) {
        return { error: "Post not found" };
    }

    if (post.userId !== session.user.id) {
        return { error: "Forbidden" };
    }

    await prisma.post.delete({
        where: { id: postId }
    });

    revalidatePath("/");
    return { success: true };
}

export async function followUser(targetUserId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { error: "Unauthorized" };

    if (session.user.id === targetUserId) return { error: "Cannot follow yourself" };

    try {
        await prisma.follows.create({
            data: {
                followerId: session.user.id,
                followingId: targetUserId,
            }
        });
        revalidatePath("/");
        revalidatePath("/profile");
        // We can't easily revalidate dynamic routes without knowing the ID, 
        // but typically next.js handles this if we revalidate the path where we are.
        return { success: true };
    } catch (error) {
        return { error: "Already following or error" };
    }
}

export async function unfollowUser(targetUserId: string) {
     const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { error: "Unauthorized" };

    try {
        await prisma.follows.delete({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: targetUserId,
                }
            }
        });
        revalidatePath("/");
        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        return { error: "Not following or error" };
    }
}

export async function getProfileStats(userId: string) {
     const [postsCount, followersCount, followingCount] = await Promise.all([
        prisma.post.count({ where: { userId } }),
        prisma.follows.count({ where: { followingId: userId } }),
        prisma.follows.count({ where: { followerId: userId } })
    ]);
    return { postsCount, followersCount, followingCount };
}

export async function checkIsFollowing(targetUserId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return false;

    const follow = await prisma.follows.findUnique({
        where: {
            followerId_followingId: {
                followerId: session.user.id,
                followingId: targetUserId
            }
        }
    });
    return !!follow;
}

export async function getFollowers(userId: string) {
    const follows = await prisma.follows.findMany({
        where: { followingId: userId },
        include: {
            follower: {
                select: { id: true, name: true, image: true }
            }
        }
    });
    return follows.map(f => f.follower);
}

export async function getFollowing(userId?: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    
    const targetUserId = userId || session?.user?.id;
    if (!targetUserId) return [];

    const follows = await prisma.follows.findMany({
        where: { followerId: targetUserId },
        include: {
            following: {
                select: { id: true, name: true, image: true }
            }
        }
    });
    return follows.map(f => f.following);
}
