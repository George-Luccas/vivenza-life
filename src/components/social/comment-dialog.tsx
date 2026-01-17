"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { addComment, getComments } from "@/app/_actions/social";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input"; // Assuming we have Input or similar

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface CommentDialogProps {
    postId: string;
    commentCount: number;
    trigger?: React.ReactNode;
}

export function CommentDialog({ postId, commentCount, trigger }: CommentDialogProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadComments();
        }
    }, [isOpen]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const fetchedComments = await getComments(postId);
            setComments(fetchedComments);
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!newComment.trim()) return;

        // Optimistic update
        const tempId = Math.random().toString();
        const optimisticComment: Comment = {
            id: tempId,
            content: newComment,
            createdAt: new Date(),
            user: { name: "Você", image: null } // Placeholder logic for optimistic
        };

        setComments([optimisticComment, ...comments]);
        const commentToSend = newComment;
        setNewComment("");

        try {
            await addComment(postId, commentToSend);
            await loadComments(); // Reload to get real data/user info
        } catch (error) {
            console.error("Failed to send comment", error);
            // Revert optimistic update ideally, but simpler to just reload
            loadComments();
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="hover:bg-transparent p-0 h-auto w-auto">
                        <MessageCircle className="h-7 w-7 text-foreground stroke-[1.5px]" />
                        {commentCount > 0 && <span className="ml-1.5 text-sm font-semibold">{commentCount}</span>}
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] sm:h-[80vh] rounded-t-3xl p-0">
                 <div className="flex flex-col h-full bg-background rounded-t-3xl overflow-hidden">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle className="text-center">Comentários</SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {isLoading && comments.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">Carregando...</p>
                        ) : comments.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">Seja o primeiro a comentar!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src={comment.user.image || ""} />
                                        <AvatarFallback>{comment.user.name?.[0] || "?"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col bg-muted/30 p-2 rounded-xl rounded-tl-none">
                                        <span className="text-xs font-bold">{comment.user.name}</span>
                                        <p className="text-sm">{comment.content}</p>
                                        <span className="text-[10px] text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t flex items-center gap-2 bg-background mb-4">
                        <Input
                            placeholder="Adicione um comentário..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 rounded-full bg-muted border-none"
                        />
                         <Button size="icon" className="rounded-full bg-rose-500 hover:bg-rose-600 h-10 w-10 shrink-0" onClick={handleSend} disabled={!newComment.trim()}>
                            <Send className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
