"use client"

import { getConversations } from "@/app/_actions/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Loader2, MessageCircle } from "lucide-react"

export function ChatList({ onItemClick }: { onItemClick?: () => void }) {
    const [conversations, setConversations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getConversations().then(data => {
            setConversations(data)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center px-4">
                <MessageCircle className="h-10 w-10 mb-2 opacity-20" />
                <p>Nenhuma conversa ainda.</p>
                <p className="text-sm mt-1">Interaja com seus amigos para começar!</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-1">
            {conversations.map(conv => {
                // Find other participant: not me
                // Since this is client side, we don't have 'session' handy easily unless we pass it or use a hook.
                // But getConversations returns the object tailored. 
                // Wait, getConversations returns ALL participants.
                // I need to know which one is NOT me. 
                // Hack: The user actually needs 'session'. 
                // Let's refactor 'getConversations' to return 'otherUser' directly or 
                // I can fetch session in this component or just filter the one that is NOT 'me'.
                // But I don't know 'me' ID here easily without authClient.useSession().
                
                // Let's use authClient.useSession()
                // Assuming MainLayout wraps this, session should optionally be available, but easier to just use the hook.
                
                // Fallback: If 2 participants, and I don't know who I am, I can't know who is "other".
                // I will add 'authClient' usage.
                return <ConversationItem key={conv.id} conversation={conv} onItemClick={onItemClick} />
            })}
        </div>
    )
}

import { authClient } from "@/lib/auth-client"

function ConversationItem({ conversation, onItemClick }: { conversation: any, onItemClick?: () => void }) {
    const { data: session } = authClient.useSession()
    
    if (!session) return null // Or skeleton

    const otherParticipant = conversation.participants.find((p: any) => p.user.id !== session.user.id)?.user;
    const lastMessage = conversation.messages[0];

    return (
        <Link 
            href={`/chat/${conversation.id}`}
            onClick={onItemClick}
            className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors rounded-lg"
        >
            <Avatar className="h-12 w-12 border">
                <AvatarImage src={otherParticipant?.image || ""} />
                <AvatarFallback>{otherParticipant?.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <span className="font-semibold truncate text-sm">{otherParticipant?.name}</span>
                    {lastMessage && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: false, locale: ptBR })}
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground truncate font-medium">
                    {lastMessage?.content || (lastMessage?.sharedPostId ? "Compartilhou um post" : "Iniciou uma conversa")}
                </p>
            </div>
        </Link>
    )
}
