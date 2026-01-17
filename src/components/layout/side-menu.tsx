"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, Calendar, MapPin, ShoppingBag, LogOut, Settings, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SideMenu() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

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
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-rose-950">
                    <Menu className="h-6 w-6" />
                    {/* Notification dot example */}
                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center border-2 border-background">1</div>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="font-dancing text-3xl text-rose-500">Vivenza Life</SheetTitle>
                </SheetHeader>
                
                {session ? (
                    <div className="flex flex-col gap-6">
                        {/* User Profile Summary */}
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl">
                            <Avatar className="h-12 w-12 border-2 border-rose-200">
                                <AvatarImage src={session.user.image || ""} />
                                <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg">{session.user.name}</span>
                                <span className="text-sm text-muted-foreground">{session.user.email}</span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-col gap-2">
                             <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-50 text-foreground/80 hover:text-rose-600 transition-colors">
                                <Home className="h-5 w-5" />
                                <span className="font-medium">Feed Principal</span>
                            </Link>
                             <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-50 text-foreground/80 hover:text-rose-600 transition-colors">
                                <User className="h-5 w-5" />
                                <span className="font-medium">Meu Perfil</span>
                            </Link>
                            <Link href="/appointments" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-50 text-foreground/80 hover:text-rose-600 transition-colors">
                                <Calendar className="h-5 w-5" />
                                <span className="font-medium">Meus Agendamentos</span>
                            </Link>
                             <Link href="/establishments" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-50 text-foreground/80 hover:text-rose-600 transition-colors">
                                <MapPin className="h-5 w-5" />
                                <span className="font-medium">Cuidado e Beleza</span>
                            </Link>
                             <Link href="/marketplace" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-50 text-foreground/80 hover:text-rose-600 transition-colors">
                                <ShoppingBag className="h-5 w-5" />
                                <span className="font-medium">Marketplace</span>
                            </Link>
                             <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-rose-50 text-foreground/80 hover:text-rose-600 transition-colors">
                                <Settings className="h-5 w-5" />
                                <span className="font-medium">Configurações</span>
                            </Link>
                        </div>

                        <div className="h-px bg-border my-2" />

                        <Button variant="ghost" className="justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleSignOut}>
                            <LogOut className="h-5 w-5" />
                            Sair da conta
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-muted-foreground mb-4">Faça login para aproveitar o melhor do Vivenza Life.</p>
                        <Button asChild className="w-full bg-rose-500 hover:bg-rose-600">
                            <Link href="/login">Entrar na conta</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full border-rose-200 text-rose-700 hover:bg-rose-50">
                            <Link href="/register">Criar cadastro</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
