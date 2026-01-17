"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MoreHorizontal, Repeat, Link as LinkIcon, Trash2, Send } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { useState } from "react"
import { toggleLike, sharePost, deletePost } from "@/app/_actions/social"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { CommentDialog } from "./comment-dialog"
import { SharePostDialog } from "@/components/chat/share-post-dialog"

interface PostProps {
  post: {
    id: string
    userId: string
    caption: string | null
    imageUrl: string
    createdAt: Date
    user: {
      name: string | null
      image: string | null
    }
    _count: {
      likes: number
      comments: number
    }
    likes: { userId: string }[]
    originalPostId?: string | null
    originalPost?: {
        user: {
            name: string | null
            image: string | null
        }
    } | null
  }
  currentUserId?: string
  disableImageModal?: boolean
}

export function PostCard({ post, currentUserId, disableImageModal = false }: PostProps) {
  const isLikedInitial = post.likes.some(like => like.userId === currentUserId)
  const [isLiked, setIsLiked] = useState(isLikedInitial)
  const [likeCount, setLikeCount] = useState(post._count.likes)
  const [showHeartOverlay, setShowHeartOverlay] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  const handleLike = async () => {
    // Optimistic update
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1)
    
    if (newIsLiked) {
        setShowHeartOverlay(true)
        setTimeout(() => setShowHeartOverlay(false), 1000)
    }

    try {
      await toggleLike(post.id)
    } catch (error) {
      // Revert if error
      setIsLiked(!newIsLiked)
      setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1)
    }
  }

  const handleDoubleTap = () => {
      if (!isLiked) {
          handleLike()
      } else {
          setShowHeartOverlay(true)
          setTimeout(() => setShowHeartOverlay(false), 1000)
      }
  }

  return (
    <Card className="rounded-gold-border shadow-sm rounded-3xl overflow-hidden w-full h-full mb-0 bg-white dark:bg-card flex flex-col">
      <CardHeader className="flex flex-row items-center p-3 pb-2">
        <div className="flex items-center gap-3">
          <Link href={`/u/${post.userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Avatar className="h-10 w-10 border-2 border-rose-100">
                <AvatarImage src={post.user.image || ""} />
                <AvatarFallback>{post.user.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground hover:underline">
                        {post.user.name}
                    </p>
                    {/* Optional verified badge or status could go here */}
                 </div>
                 <p className="text-[10px] text-muted-foreground font-medium">{post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR }) : 'Agora mesmo'}</p>
              </div>
          </Link>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto rounded-full text-muted-foreground">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]" style={{ zIndex: 9999 }}>
                {currentUserId === post.userId ? (
                    <DropdownMenuItem 
                        className="text-red-500 focus:text-red-600 focus:bg-red-50"
                        onClick={async () => {
                            if (confirm("Tem certeza que deseja excluir esta vivência?")) {
                                await deletePost(post.id);
                            }
                        }}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem disabled>
                        Sem opções disponíveis
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      {/* Caption ABOVE Image (Mockup Style) */}
      {post.caption && (
        <div className="px-4 py-2 text-sm text-foreground/90 font-medium leading-relaxed">
            {post.caption} <span className="text-lg">🌿</span>
        </div>
      )}

      {/* Image Container */}
      {disableImageModal ? (
        <div 
            className="relative w-full aspect-[4/5] bg-muted/20 overflow-hidden"
            onDoubleClick={handleDoubleTap}
        >
            <Image
                src={post.imageUrl}
                alt={post.caption || "Post image"}
                fill
                className="object-cover"
            />
             <AnimatePresence>
                {showHeartOverlay && (
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <Heart className="w-24 h-24 fill-white text-white drop-shadow-xl" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      ) : (
          <Dialog>
            <DialogTrigger asChild>
                <div 
                    className="relative w-full aspect-[4/5] bg-muted/20 overflow-hidden cursor-pointer"
                    onDoubleClick={handleDoubleTap}
                >
                    <Image
                    src={post.imageUrl}
                    alt={post.caption || "Post image"}
                    fill
                    className="object-cover"
                    />
                    
                    {/* Heart Overlay Animation */}
                    <AnimatePresence>
                        {showHeartOverlay && (
                            <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            >
                                <Heart className="w-24 h-24 fill-white text-white drop-shadow-xl" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-auto max-h-screen border-none bg-transparent shadow-none p-0 flex items-center justify-center">
                <DialogTitle className="sr-only">Visualização Ampliada</DialogTitle>
                <div className="relative w-full h-[85vh] outline-none">
                    <Image
                        src={post.imageUrl}
                        alt={post.caption || "Fullscreen post image"}
                        fill
                        className="object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
      )}

      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-transparent p-0 h-auto w-auto"
                    onClick={handleLike}
                >
                    <Heart className={cn("h-7 w-7 transition-colors", isLiked ? "fill-rose-500 text-rose-500" : "text-foreground stroke-[1.5px]")} />
                    {likeCount > 0 && <span className="ml-1.5 text-sm font-semibold">{likeCount}</span>}
                </Button>
                
                <CommentDialog 
                    postId={post.id} 
                    commentCount={post._count.comments} 
                />
            </div>

            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-transparent p-0 h-auto w-auto"
                    >
                        <div className="h-6 w-6 border-2 border-foreground rounded-full flex items-center justify-center text-[10px] font-bold transition-transform duration-500 hover:rotate-180">
                            <span className="mb-0.5">↺</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={async () => {
                         try {
                             await sharePost(post.originalPostId || post.id); // Share original if it's already a repost
                             // Basic alerts for now, could be toasted
                         } catch (e) {
                             console.error(e);
                         }
                    }}>
                        <Repeat className="w-4 h-4 mr-2" />
                        Repostar no Feed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                         <Send className="w-4 h-4 mr-2" />
                         Enviar para Amigo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                         navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                    }}>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Copiar Link
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <SharePostDialog 
                open={showShareDialog} 
                onOpenChange={setShowShareDialog} 
                postId={post.id} 
            />
        </div>
        {/* Repost Indicator */}
        {post.originalPost && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                <span>Repostado de <strong>{post.originalPost.user.name}</strong></span>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
