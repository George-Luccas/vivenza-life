"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getStories } from "@/app/_actions/story"
import { useEffect, useState } from "react"
import { CreateContentButton } from "../social/create-content-button"
import { StoryViewer } from "./story-viewer"

export function StoriesList({ currentUser }: { currentUser: any }) {
    const [usersWithStories, setUsersWithStories] = useState<any[]>([])
    const [viewerOpen, setViewerOpen] = useState(false)
    const [initialStoryIndex, setInitialStoryIndex] = useState(0)

    useEffect(() => {
        getStories().then(setUsersWithStories)
    }, [])

    const handleStoryClick = (index: number) => {
        setInitialStoryIndex(index)
        setViewerOpen(true)
    }

    return (
        <>
            <div className="flex gap-4 overflow-x-auto py-4 px-4 scrollbar-hide bg-background/30 backdrop-blur-sm mb-2">
                
                {/* Create Button (Always first) */}
                {currentUser && (
                   <CreateContentButton />
                )}

                {/* User Stories */}
                {usersWithStories.map((user, idx) => (
                    <div 
                        key={user.id} 
                        className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
                        onClick={() => handleStoryClick(idx)}
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-orange-500 to-yellow-500 p-[2.5px]">
                            <div className="w-full h-full rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                                <AvatarImage src={user.image || ""} className="object-cover" />
                                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                            </div>
                        </div>
                        <span className="text-xs text-center truncate w-20 text-muted-foreground font-medium">
                            {user.name.split(' ')[0]}
                        </span>
                    </div>
                ))}
            </div>

            {usersWithStories.length > 0 && (
                <StoryViewer 
                    users={usersWithStories} 
                    initialUserIndex={initialStoryIndex} 
                    open={viewerOpen} 
                    onOpenChange={setViewerOpen} 
                />
            )}
        </>
    )
}
