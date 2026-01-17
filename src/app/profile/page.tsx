import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserPosts, getProfileStats, getFollowers, getFollowing } from "@/app/_actions/social";
import { ProfileHeader } from "@/components/social/profile-header";
import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flower2, Grid, Repeat, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import { PostCard } from "@/components/social/post-card";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/");
    }

    const [posts, stats, followers, following] = await Promise.all([
        getUserPosts(session.user.id),
        getProfileStats(session.user.id),
        getFollowers(session.user.id),
        getFollowing(session.user.id)
    ]);
    const user = session.user;

    return (
        <MainLayout>
             <div className="flex flex-col min-h-screen pb-20">
                {/* Profile Header */}
                <ProfileHeader 
                    user={user} 
                    stats={stats} 
                    followers={followers} 
                    following={following} 
                />

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
                                                <PostCard post={post} currentUserId={user.id} disableImageModal={true} />
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
