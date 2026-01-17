import { MainLayout } from "@/components/layout/main-layout";
import { getConversations } from "@/app/_actions/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatListPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) redirect("/");

    const conversations = await getConversations();

    return (
        <MainLayout>
             <div className="flex flex-col min-h-screen pb-20">
                <div className="p-4 border-b bg-white dark:bg-card">
                    <h1 className="text-xl font-bold">Mensagens</h1>
                </div>

                <div className="flex flex-col">
                    {conversations.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                             <p>Nenhuma conversa ainda.</p>
                             <p className="text-sm">Envie um post para um amigo para começar!</p>
                         </div>
                    ) : (
                        conversations.map(conv => {
                            const otherParticipant = conv.participants.find(p => p.user.id !== session.user.id)?.user;
                            const lastMessage = conv.messages[0];

                            return (
                                <Link 
                                    key={conv.id} 
                                    href={`/chat/${conv.id}`}
                                    className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors bg-white dark:bg-card"
                                >
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarImage src={otherParticipant?.image || ""} />
                                        <AvatarFallback>{otherParticipant?.name?.[0] || "?"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-semibold truncate">{otherParticipant?.name}</span>
                                            {lastMessage && (
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: false, locale: ptBR })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {lastMessage?.content || (lastMessage?.sharedPostId ? "Compartilhou um post" : "Iniciou uma conversa")}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })
                    )}
                </div>
             </div>
        </MainLayout>
    )
}
