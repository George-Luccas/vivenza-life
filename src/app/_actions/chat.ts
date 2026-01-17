"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getConversations() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return [];
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return conversations;
}

export async function startChat(targetUserId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Check if conversation already exists
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      participants: {
        every: {
          userId: { in: [session.user.id, targetUserId] },
        },
      },
    },
    include: {
        participants: true
    }
  });

  // Verify it has exactly 2 participants to avoid group chat confusions later, 
  // though for now we only do 1-1. The 'every' filter combined with logic 
  // can generally find it. Better: Find conversations where I am a participant,
  // then check if the other participant matches target.
  // Simplification for MVP:
  
  // Real query: Find conversation where both users are participants
  const conversations = await prisma.conversation.findMany({
    where: {
        participants: {
            some: { userId: session.user.id }
        }
    },
    include: {
        participants: true
    }
  });
  
  const found = conversations.find(c => c.participants.some(p => p.userId === targetUserId));

  if (found) {
    return { conversationId: found.id };
  }

  // Create new
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: session.user.id },
          { userId: targetUserId },
        ],
      },
    },
  });

  return { conversationId: conversation.id };
}

export async function sendMessage(conversationId: string, content: string, sharedPostId?: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  // Validate participation
  const isParticipant = await prisma.conversationParticipant.findFirst({
    where: {
      conversationId,
      userId: session.user.id,
    },
  });

  if (!isParticipant) {
    return { error: "Forbidden" };
  }

  if (!content && !sharedPostId) {
      return { error: "Empty message" };
  }

  await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content,
      sharedPostId,
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/chat");
  revalidatePath(`/chat/${conversationId}`);
  return { success: true };
}

export async function getMessages(conversationId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) return [];

    // Check participation
    const participation = await prisma.conversationParticipant.count({
        where: { conversationId, userId: session.user.id }
    });

    if (participation === 0) return [];

    return await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        include: {
            sender: {
                select: { id: true, name: true, image: true }
            },
            sharedPost: {
                select: { id: true, imageUrl: true, caption: true, user: { select: { name: true } } }
            }
        }
    });
}

export async function getUnreadCount() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) return 0;

    const count = await prisma.message.count({
        where: {
            conversation: {
                participants: {
                    some: { userId: session.user.id }
                }
            },
            senderId: { not: session.user.id },
            isRead: false
        }
    });

    return count;
}

export async function markMessagesAsRead(conversationId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) return { success: false };

    // Check participation
    const isParticipant = await prisma.conversationParticipant.findFirst({
        where: { conversationId, userId: session.user.id }
    });

    if (!isParticipant) return { success: false };

    await prisma.message.updateMany({
        where: {
            conversationId,
            senderId: { not: session.user.id },
            isRead: false
        },
        data: {
            isRead: true
        }
    });

    revalidatePath("/chat"); 
    return { success: true };
}
