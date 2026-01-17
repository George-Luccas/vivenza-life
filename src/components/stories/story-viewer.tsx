"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Story {
    id: string
    imageUrl: string
    createdAt: Date
}

interface UserWithStories {
    id: string
    name: string | null
    image: string | null
    stories: Story[]
}

interface StoryViewerProps {
    users: UserWithStories[]
    initialUserIndex: number
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function StoryViewer({ users, initialUserIndex, open, onOpenChange }: StoryViewerProps) {
    const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex)
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    const currentUser = users[currentUserIndex]
    const currentStory = currentUser?.stories[currentStoryIndex]

    // Reset when opening a new user
    useEffect(() => {
        if (open) {
            setCurrentUserIndex(initialUserIndex)
            setCurrentStoryIndex(0)
            setProgress(0)
        }
    }, [open, initialUserIndex])

    // Auto-advance
    useEffect(() => {
        if (!open || !currentStory) return

        const duration = 5000 // 5 seconds per story
        const interval = 50 // Update every 50ms
        const step = 100 / (duration / interval)

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    handleNext()
                    return 0
                }
                return prev + step
            })
        }, interval)

        return () => clearInterval(timer)
    }, [open, currentStory, currentUserIndex]) // Add deps carefully

    const handleNext = () => {
        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1)
            setProgress(0)
        } else if (currentUserIndex < users.length - 1) {
            setCurrentUserIndex(prev => prev + 1)
            setCurrentStoryIndex(0)
            setProgress(0)
        } else {
            onOpenChange(false)
        }
    }

    const handlePrev = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1)
            setProgress(0)
        } else if (currentUserIndex > 0) {
            const prevUser = users[currentUserIndex - 1]
            setCurrentUserIndex(prev => prev - 1)
            setCurrentStoryIndex(prevUser.stories.length - 1) // Go to last story of prev user
            setProgress(0)
        }
    }

    if (!currentUser || !currentStory) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md w-full h-[90vh] p-0 border-none bg-black overflow-hidden flex flex-col items-center justify-center">
                <DialogTitle className="sr-only">Story de {currentUser.name}</DialogTitle>
                
                {/* Progress Bar */}
                <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
                    {currentUser.stories.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white transition-all duration-100 ease-linear"
                                style={{ 
                                    width: idx < currentStoryIndex ? '100%' : 
                                           idx === currentStoryIndex ? `${progress}%` : '0%' 
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* header */}
                <div className="absolute top-8 left-4 z-50 flex items-center gap-2">
                     <Avatar className="h-8 w-8 border border-white/50">
                        <AvatarImage src={currentUser.image || ""} />
                        <AvatarFallback>{currentUser.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm font-semibold drop-shadow-md">{currentUser.name}</span>
                </div>

                {/* Close */}
                <button onClick={() => onOpenChange(false)} className="absolute top-8 right-4 z-50 text-white">
                    <X className="w-6 h-6 drop-shadow-md" />
                </button>

                {/* Content */}
                <div className="relative w-full h-full flex items-center justify-center bg-zinc-900">
                    <Image 
                        src={currentStory.imageUrl} 
                        alt="Story" 
                        fill 
                        priority
                        className="object-contain" // Contain to show full image without crop
                    />
                </div>

                {/* Controls */}
                <div className="absolute inset-0 flex">
                    <div className="w-1/3 h-full cursor-pointer z-40" onClick={handlePrev} />
                    <div className="w-2/3 h-full cursor-pointer z-40" onClick={handleNext} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
