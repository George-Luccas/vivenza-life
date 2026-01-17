"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Loader2 } from "lucide-react"
import { startChat } from "@/app/_actions/chat"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MessageButtonProps {
    targetUserId: string
    className?: string
}

export function MessageButton({ targetUserId, className }: MessageButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleMessage = async () => {
        setLoading(true)
        try {
            const { conversationId, error } = await startChat(targetUserId)
            if (conversationId) {
                router.push(`/chat/${conversationId}`)
            } else if (error) {
                console.error("Chat error:", error)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button 
            variant="outline" 
            className={cn("rounded-full h-8 w-8 p-0 border-rose-200 text-rose-500 hover:text-white hover:bg-rose-500", className)}
            onClick={handleMessage}
            disabled={loading}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
        </Button>
    )
}
