import { MainLayout } from "@/components/layout/main-layout";
import { getMessages, sendMessage } from "@/app/_actions/chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChatWindow } from "@/components/chat/chat-window";

interface Props {
    params: Promise<{ id: string }>
}

export default async function ConversationPage(props: Props) {
    const params = await props.params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/");

    const conversationId = params.id;
    
    // Fetch conversation details (for header)
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            participants: {
                include: { user: true }
            }
        }
    });

    if (!conversation) redirect("/chat");

    const otherUser = conversation.participants.find(p => p.userId !== session.user.id)?.user;
    const messages = await getMessages(conversationId);

    return (
        <MainLayout>
             <ChatWindow 
                conversationId={conversationId}
                currentUser={session.user}
                otherUser={otherUser!}
                initialMessages={messages}
             />
        </MainLayout>
    )
}
