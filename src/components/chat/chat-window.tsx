"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendMessage, getMessages, markMessagesAsRead } from "@/app/_actions/chat"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Send, Image as ImageIcon, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Message {
  id: string
  content: string | null
  createdAt: Date
  senderId: string
  sharedPost?: {
      id: string
      imageUrl: string
      caption: string | null
      user: {
          name: string | null
      }
  } | null
  sender: {
      image: string | null
      name: string | null
  }
}
// ... interface ChatWindowProps

interface ChatWindowProps {
  conversationId: string
  currentUser: { id: string }
  otherUser: { name: string | null; image: string | null; id: string }
  initialMessages: Message[]
}

export function ChatWindow({ conversationId, currentUser, otherUser, initialMessages }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Scroll to bottom on mount
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, []) // Run once on mount

  useEffect(() => {
    // Poll for new messages every 3 seconds
    const interval = setInterval(async () => {
        try {
            const fetchedMessages = await getMessages(conversationId)
            // Debugging
            // console.log("Polling messages:", fetchedMessages.length) 
            
            setMessages(prev => {
                // Simple comparison to avoid re-renders if same length
                // Ideally we check IDs, but length is a decent proxy for "new message" in append-only chat
                if (fetchedMessages.length !== prev.length) {
                    return fetchedMessages as any
                }
                return prev
            })
        } catch (error) {
            console.error("Polling error", error)
        }
    }, 2000) // Reduced to 2s for snappier feel

    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
      // Scroll on new messages
      if (scrollRef.current) {
          // Check if near bottom? For now forced auto-scroll is annoying if reading history, 
          // but good for "expecting messages". Let's scroll if users added a message or last message changed.
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
  }, [messages])

  useEffect(() => {
    markMessagesAsRead(conversationId)
  }, [conversationId])

  useEffect(() => {
      if (messages.length > 0) {
          markMessagesAsRead(conversationId)
      }
  }, [messages, conversationId])

  const handleSend = async () => {
      if (!inputValue.trim()) return

      const tempId = Math.random().toString()
      const newMessage: Message = {
          id: tempId,
          content: inputValue,
          createdAt: new Date(),
          senderId: currentUser.id,
          sender: { name: "Você", image: null }, // Avatar handled by UI logic
          sharedPost: null
      }

      setMessages(prev => [...prev, newMessage])
      setInputValue("")
      setSending(true)

      try {
          await sendMessage(conversationId, newMessage.content!)
      } catch (error) {
          console.error("Failed to send", error)
          // Simple rollback or alert
      } finally {
          setSending(false)
      }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] md:h-[calc(100vh-100px)] bg-background">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-card z-10">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-6 w-6" />
            </Button>
            <Avatar className="h-10 w-10">
                <AvatarImage src={otherUser.image || ""} />
                <AvatarFallback>{otherUser.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold">{otherUser.name}</h2>
                <p className="text-xs text-muted-foreground">Online</p>
            </div>
        </div>

        {/* Messages */}
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-zinc-950/50"
        >
            {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id
                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                            
                            {/* Shared Post Card */}
                            {msg.sharedPost && (
                                <div className="mb-2 w-48 rounded-lg overflow-hidden border bg-background shadow-sm">
                                    <div className="relative aspect-square w-full">
                                        <Image 
                                            src={msg.sharedPost.imageUrl} 
                                            alt="Shared post" 
                                            fill 
                                            className="object-cover" 
                                        />
                                    </div>
                                    <div className="p-2 text-xs">
                                        <span className="font-bold">{msg.sharedPost.user.name}</span>
                                        <p className="truncate text-muted-foreground">{msg.sharedPost.caption}</p>
                                    </div>
                                </div>
                            )}

                            {/* Message Bubble */}
                            {msg.content && (
                                <div 
                                    className={`px-4 py-2 rounded-2xl text-sm ${
                                        isMe 
                                        ? 'bg-rose-500 text-white rounded-br-none' 
                                        : 'bg-white dark:bg-card border text-foreground rounded-bl-none'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            )}
                            
                            <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: false, locale: ptBR })}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white dark:bg-card flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
            </Button>
            <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escreva uma mensagem..."
                className="flex-1 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-rose-500"
            />
            <Button 
                onClick={handleSend} 
                className="rounded-full h-10 w-10 p-0 bg-rose-500 hover:bg-rose-600 shadow-sm"
                disabled={!inputValue.trim() && !sending}
            >
                <Send className="h-4 w-4 text-white" />
            </Button>
        </div>
    </div>
  )
}
