"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UserListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  users: {
    id: string
    name: string | null
    image: string | null
  }[]
}

export function UserListDialog({ open, onOpenChange, title, users }: UserListDialogProps) {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="h-[300px] w-full rounded-md border p-4 overflow-y-auto">
          {users.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Ninguém aqui ainda.
            </div>
          ) : (
             <div className="flex flex-col gap-4">
                {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                        <div 
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                                onOpenChange(false) // Close modal
                                router.push(`/u/${user.id}`) // Navigate to their profile (we will build this page next)
                            }}
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback>{user.name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{user.name}</span>
                        </div>
                    </div>
                ))}
             </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
