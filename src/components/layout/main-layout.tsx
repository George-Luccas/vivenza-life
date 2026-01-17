"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, Calendar, Store, ShoppingBag, User, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatList } from "@/components/chat/chat-list";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar Fixa */}
      {/* Header Removido conforme solicitação */}

      {/* Conteúdo Principal */}
      <main className="flex-1 w-full pt-4 pb-20 md:pb-4">
        {children}
      </main>

      {/* Navegação Mobile (Tab Bar) */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xs mt-1">Feed</span>
          </Link>
          <Link href="/appointments" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground">
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Appts</span>
          </Link>
           <Link href="/establishments" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground">
            <Store className="h-6 w-6" />
            <span className="text-xs mt-1">Beleza</span>
          </Link>
           <Link href="/marketplace" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs mt-1">Vendas</span>
          </Link>
          <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground hover:bg-transparent p-0 rounded-none">
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-xs mt-1">Chat</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px] p-0 z-[100]">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg">Conversas</h2>
                </div>
                <div className="p-4 overflow-y-auto h-full pb-20">
                    <ChatList onItemClick={() => setIsChatOpen(false)} />
                </div>
            </SheetContent>
          </Sheet>
            {session ? (
                 <Link href="/profile" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground">
                    <User className="h-6 w-6" />
                    <span className="text-xs mt-1">Perfil</span>
                </Link>
            ) : (
                <Link href="/login" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-foreground">
                    <User className="h-6 w-6" />
                    <span className="text-xs mt-1">Entrar</span>
                </Link>
            )}
        </div>
      </div>
    </div>
  );
}
