import { MainLayout } from "@/components/layout/main-layout";
import { getFeed } from "@/app/_actions/social";
import { PostCard } from "@/components/social/post-card";
import { CreatePostDialog } from "@/components/social/create-post-dialog";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SideMenu } from "@/components/layout/side-menu";
import { NotificationSheet } from "@/components/interactions/notifications-sheet";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Heart } from "lucide-react";
import Link from "next/link";
import { ChatHeaderButton } from "@/components/chat/chat-header-button";
import { StoriesList } from "@/components/stories/stories-list";

export const dynamic = 'force-dynamic';
import { ModeToggle } from "@/components/ui/mode-toggle";

export default async function Home() {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers()
    });
  } catch (error) {
    console.error("Failed to fetch session:", error);
  }

  const posts = await getFeed();
  const currentUserId = session?.user?.id;

  return (
    <MainLayout>
      <div className="w-full min-h-screen pb-20 bg-[#FFF0F5]/30 dark:bg-transparent"> 
        {/* Mockup Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b-2 border-transparent [border-image:linear-gradient(to_right,#BF953F,#FCF6BA,#B38728,#FBF5B7,#AA771C)_1] border-b-solid flex items-center justify-between px-4 py-3 shadow-[0_4px_12px_-4px_rgba(179,135,40,0.3)]">
            <SideMenu />
            
            <div className="flex items-center gap-1 font-dancing text-3xl text-rose-500">
                <span>Vivenza L</span>
                <span className="relative inline-block">
                    ı
                    <Heart className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                </span>
                <span>fe</span>
            </div>
            
            <div className="flex items-center gap-2">
                <ModeToggle />
                <NotificationSheet />
                
                <ChatHeaderButton />
            </div>
        </header>

        {/* Tabs / Categories Navigation */}
        <div className="flex items-center gap-3 py-4 px-4 bg-background/50 overflow-x-auto scrollbar-hide">
            <Link href="/" className="flex-shrink-0 px-6 py-1.5 rounded-full bg-rose-200 text-rose-700 font-semibold text-sm shadow-sm transition-transform active:scale-95 whitespace-nowrap">
              Feed
            </Link>
            <Link href="/appointments" className="flex-shrink-0 px-4 py-1.5 rounded-full text-muted-foreground font-medium text-sm hover:bg-rose-50 transition-colors whitespace-nowrap">
              Agendamentos
            </Link>
            <Link href="/establishments" className="flex-shrink-0 px-4 py-1.5 rounded-full text-muted-foreground font-medium text-sm hover:bg-rose-50 transition-colors whitespace-nowrap">
              Cuidado e Beleza
            </Link>
            <Link href="/events" className="flex-shrink-0 px-4 py-1.5 rounded-full text-muted-foreground font-medium text-sm hover:bg-rose-50 transition-colors whitespace-nowrap">
              Eventos
            </Link>
            <Link href="/marketplace" className="flex-shrink-0 px-4 py-1.5 rounded-full text-muted-foreground font-medium text-sm hover:bg-rose-50 transition-colors whitespace-nowrap">
              Marketplace
            </Link>
        </div>
        
        {/* Stories Row */}
        <StoriesList currentUser={session?.user} />
        
        {/* Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-0 sm:px-4 auto-rows-max">
            {posts.length === 0 ? (
                <div className="col-span-full text-center py-20 text-muted-foreground border rounded-xl bg-white/50 m-4">
                    <p className="mb-4">Nenhuma publicação ainda.</p>
                    {session?.user ? (
                        <p>Seja o primeiro a publicar usando o botão acima!</p>
                    ) : (
                        <p className="text-sm">Faça login para começar a publicar.</p>
                    )}
                </div>
            ) : (
                posts.map((post) => (
                    <PostCard key={post.id} post={post} currentUserId={currentUserId} />
                ))
            )}
        </div>
      </div>
    </MainLayout>
  );
}
