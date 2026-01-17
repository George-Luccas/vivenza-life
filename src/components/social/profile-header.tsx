"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { UserListDialog } from "./user-list-dialog"

interface ProfileHeaderProps {
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    }
    stats: {
        postsCount: number
        followersCount: number
        followingCount: number
    }
    followers: { id: string; name: string | null; image: string | null }[]
    following: { id: string; name: string | null; image: string | null }[]
}

import { BackButton } from "@/components/ui/back-button"

export function ProfileHeader({ user, stats, followers, following }: ProfileHeaderProps) {
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)

    return (
        <div className="bg-white dark:bg-card pt-8 pb-4 px-6 border-b rounded-b-[2rem] shadow-sm mb-4 relative">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-rose-100 mb-3 shadow-sm">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="text-2xl">{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
                
                <div className="flex gap-8 mb-4">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">{stats.postsCount}</span>
                        <span className="text-xs text-muted-foreground">Posts</span>
                    </div>
                    <button 
                        className="flex flex-col items-center cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => setShowFollowers(true)}
                    >
                        <span className="font-bold text-lg">{stats.followersCount}</span>
                        <span className="text-xs text-muted-foreground">Seguidores</span>
                    </button>
                    <button 
                        className="flex flex-col items-center cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => setShowFollowing(true)}
                    >
                        <span className="font-bold text-lg">{stats.followingCount}</span>
                        <span className="text-xs text-muted-foreground">Seguindo</span>
                    </button>
                </div>

                <div className="flex gap-2 w-full max-w-xs">
                    <Button className="flex-1 bg-rose-500 hover:bg-rose-600 rounded-full h-8 text-sm">Editar Perfil</Button>
                    <Button variant="outline" className="rounded-full h-8 text-sm">Compartilhar</Button>
                </div>
            </div>

            <UserListDialog 
                open={showFollowers} 
                onOpenChange={setShowFollowers} 
                title="Seguidores" 
                users={followers} 
            />

            <UserListDialog 
                open={showFollowing} 
                onOpenChange={setShowFollowing} 
                title="Seguindo" 
                users={following} 
            />
        </div>
    )
}
