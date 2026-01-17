"use client"

import { Button } from "@/components/ui/button"
import { Plus, Image as ImageIcon, Camera } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { CreatePostDialog } from "@/components/social/create-post-dialog"
import { CreateStoryDialog } from "@/components/stories/create-story-dialog"

export function CreateContentButton() {
    const [openPost, setOpenPost] = useState(false)
    const [openStory, setOpenStory] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-200 flex items-center justify-center relative hover:bg-rose-200 transition-colors">
                             <div className="w-full h-full flex flex-col items-center justify-center text-rose-500">
                                <Plus className="h-6 w-6" />
                            </div>
                        </div>
                        <span className="text-xs text-center font-medium text-rose-600 truncate w-20">Criar</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onSelect={() => setOpenPost(true)} className="cursor-pointer">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        <span>Publicar no Feed</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setOpenStory(true)} className="cursor-pointer">
                        <Camera className="mr-2 h-4 w-4" />
                        <span>Adicionar Story</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreatePostDialog open={openPost} onOpenChange={setOpenPost} />
            <CreateStoryDialog open={openStory} onOpenChange={setOpenStory} />
        </>
    )
}
