"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { followUser, unfollowUser } from "@/app/_actions/social"
import { Loader2, UserPlus, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"

interface FollowButtonProps {
    targetUserId: string
    isFollowingInitial: boolean
}

export function FollowButton({ targetUserId, isFollowingInitial }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(isFollowingInitial)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async () => {
        setIsLoading(true)
        try {
            if (isFollowing) {
                await unfollowUser(targetUserId)
                setIsFollowing(false)
            } else {
                await followUser(targetUserId)
                setIsFollowing(true)
            }
            router.refresh()
        } catch (error) {
            console.error("Failed to toggle follow", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button 
            onClick={handleToggle} 
            disabled={isLoading}
            variant={isFollowing ? "outline" : "default"}
            className={isFollowing ? "bg-transparent border-rose-200 text-rose-500 hover:bg-rose-50" : "bg-rose-500 hover:bg-rose-600 text-white"}
            size="sm"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Seguindo
                </>
            ) : (
                <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Seguir
                </>
            )}
        </Button>
    )
}
