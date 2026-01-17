import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserPosts, getProfileStats, checkIsFollowing } from "@/app/_actions/social";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainLayout } from "@/components/layout/main-layout";
import { PostCard } from "@/components/social/post-card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Repeat, Flower2, X } from "lucide-react";
import { FollowButton } from "@/components/social/follow-button";
import { MessageButton } from "@/components/chat/message-button";
import { BackButton } from "@/components/ui/back-button";
import { prisma } from "@/lib/prisma";

interface Props {
    params: Promise<{ userId: string }>
}

export default async function PublicProfilePage(props: Props) {
    const params = await props.params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // If viewing own profile, redirect to /profile
    if (session?.user?.id === params.userId) {
        redirect("/profile");
    }

    const [targetUser, posts, stats, isFollowing] = await Promise.all([
        prisma.user.findUnique({ where: { id: params.userId } }),
        getUserPosts(params.userId),
        getProfileStats(params.userId),
        checkIsFollowing(params.userId)
    ]); 

    if (!targetUser) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-muted-foreground">Usuário não encontrado.</p>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
             <div className="flex flex-col min-h-screen pb-20">
                {/* Profile Header */}
                <div className="bg-white dark:bg-card pt-8 pb-4 px-6 border-b rounded-b-[2rem] shadow-sm mb-4 relative">
                    <div className="absolute top-4 left-4">
                        <BackButton />
                    </div>
                    <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 border-4 border-rose-100 mb-3 shadow-sm">
                            <AvatarImage src={targetUser.image || ""} />
                            <AvatarFallback className="text-2xl">{targetUser.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-xl font-bold">{targetUser.name}</h1>
                        
                        <div className="flex gap-8 mb-4 mt-2">
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-lg">{stats.postsCount}</span>
                                <span className="text-xs text-muted-foreground">Posts</span>
                            </div>
                             <div className="flex flex-col items-center">
                                <span className="font-bold text-lg">{stats.followersCount}</span>
                                <span className="text-xs text-muted-foreground">Seguidores</span>
                            </div>
                             <div className="flex flex-col items-center">
                                <span className="font-bold text-lg">{stats.followingCount}</span>
                                <span className="text-xs text-muted-foreground">Seguindo</span>
                            </div>
                        </div>

                         <div className="flex gap-2 w-full max-w-xs justify-center items-center">
                             {session?.user && (
                                <>
                                    <FollowButton 
                                        targetUserId={targetUser.id} 
                                        isFollowingInitial={isFollowing} 
                                    />
                                    <MessageButton targetUserId={targetUser.id} />
                                </>
                             )}
                         </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-transparent border-b rounded-none h-12 p-0">
                         <TabsTrigger 
                            value="posts" 
                            className="data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:shadow-none rounded-none bg-transparent h-full"
                        >
                            <Flower2 className="h-5 w-5 mr-2 text-rose-500" />
                            Vivências
                         </TabsTrigger>
                          <TabsTrigger 
                            value="reposts" 
                            className="data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:shadow-none rounded-none bg-transparent h-full"
                        >
                            <Repeat className="h-5 w-5 mr-2" />
                            Reposts
                         </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="mt-2">
                        {posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                                     <Grid className="h-8 w-8 text-rose-300" />
                                </div>
                                <p>Ainda não há publicações</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-0.5">
                                {posts.map((post: any) => (
                                    <Dialog key={post.id}>
                                        <DialogTrigger asChild>
                                            <button className="relative aspect-square bg-muted cursor-pointer overflow-hidden border-none outline-none group">
                                                <Image 
                                                    src={post.imageUrl} 
                                                    alt={post.caption || "Post"} 
                                                    fill 
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-xl p-0 border-none bg-transparent shadow-none">
                                             <DialogTitle className="sr-only">Visualização da Vivência</DialogTitle>
                                             <div className="w-full h-auto max-h-[90vh] overflow-y-auto bg-background rounded-xl shadow-2xl relative">
                                                <DialogClose className="absolute left-4 top-4 z-[60] bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors">
                                                    <X className="h-5 w-5" />
                                                </DialogClose>
                                                <PostCard 
                                                    post={post} 
                                                    currentUserId={session?.user?.id}
                                                    disableImageModal={true}
                                                />
                                             </div>
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="reposts" className="mt-2">
                         <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                             <p>Seus reposts aparecerão aqui</p>
                        </div>
                    </TabsContent>
                </Tabs>
             </div>
        </MainLayout>
    );
}
