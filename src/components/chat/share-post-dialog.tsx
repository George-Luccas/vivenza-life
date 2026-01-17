"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { startChat, sendMessage } from "@/app/_actions/chat"
import { getFollowing } from "@/app/_actions/social"
import { Loader2, Send, Check } from "lucide-react"

interface SharePostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
}

export function SharePostDialog({ open, onOpenChange, postId }: SharePostDialogProps) {
  const [friends, setFriends] = useState<{ id: string; name: string | null; image: string | null }[]>([])
  const [loading, setLoading] = useState(false)
  const [sendingState, setSendingState] = useState<Record<string, 'idle' | 'sending' | 'sent'>>({})

  useEffect(() => {
    if (open) {
        setLoading(true)
        getFollowing()
            .then(data => setFriends(data))
            .finally(() => setLoading(false))
    }
  }, [open])

  const handleSend = async (friendId: string) => {
      setSendingState(prev => ({ ...prev, [friendId]: 'sending' }))
      
      try {
          const { conversationId } = await startChat(friendId)
          if (conversationId) {
              await sendMessage(conversationId, "", postId)
              setSendingState(prev => ({ ...prev, [friendId]: 'sent' }))
              // Reset after a while or close? 
              setTimeout(() => {
                  setSendingState(prev => ({ ...prev, [friendId]: 'idle' }))
              }, 2000)
          }
      } catch (error) {
          console.error("Failed to share", error)
          setSendingState(prev => ({ ...prev, [friendId]: 'idle' }))
      }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar para...</DialogTitle>
        </DialogHeader>
        <div className="h-[300px] w-full rounded-md border p-4 overflow-y-auto">
             {loading ? (
                 <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
             ) : friends.length === 0 ? (
                 <p className="text-center text-muted-foreground py-8">Você não segue ninguém ainda.</p>
             ) : (
                 <div className="flex flex-col gap-4">
                     {friends.map(friend => (
                         <div key={friend.id} className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={friend.image || ""} />
                                    <AvatarFallback>{friend.name?.[0] || "?"}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold">{friend.name}</span>
                             </div>
                             <Button 
                                size="sm" 
                                variant={sendingState[friend.id] === 'sent' ? "outline" : "default"}
                                className={sendingState[friend.id] === 'sent' ? "border-green-500 text-green-500" : ""}
                                onClick={() => handleSend(friend.id)}
                                disabled={sendingState[friend.id] === 'sending' || sendingState[friend.id] === 'sent'}
                             >
                                 {sendingState[friend.id] === 'sending' ? (
                                     <Loader2 className="h-4 w-4 animate-spin" />
                                 ) : sendingState[friend.id] === 'sent' ? (
                                     <Check className="h-4 w-4" />
                                 ) : (
                                     <Send className="h-4 w-4" />
                                 )}
                             </Button>
                         </div>
                     ))}
                 </div>
             )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
