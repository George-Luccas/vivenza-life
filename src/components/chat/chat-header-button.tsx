"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChatList } from "./chat-list"
import { useState } from "react"

import { getUnreadCount } from "@/app/_actions/chat"
import { useEffect } from "react"

export function ChatHeaderButton() {
    const [open, setOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        // Initial fetch
        getUnreadCount().then(setUnreadCount)

        // Poll every 5 seconds
        const interval = setInterval(() => {
            getUnreadCount().then(setUnreadCount)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-rose-950 relative">
                    <MessageCircle className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center border-2 border-background animate-in zoom-in">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </div>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px] p-0 z-[100]">
                 <div className="p-4 border-b">
                    <h2 className="font-bold text-lg">Conversas</h2>
                </div>
                <div className="p-4 overflow-y-auto h-full pb-20">
                    <ChatList onItemClick={() => setOpen(false)} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
