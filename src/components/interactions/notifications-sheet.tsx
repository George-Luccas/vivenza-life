"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NotificationSheet() {
    // Mock notifications
    const notifications = [
        { id: 1, type: "like", user: "Amanda Silva", action: "curtiu sua foto", time: "2 min atrás", image: "https://picsum.photos/seed/1/200" },
        { id: 2, type: "comment", user: "Carlos Eduardo", action: "comentou: 'Que lugar lindo!'", time: "15 min atrás", image: "https://picsum.photos/seed/2/200" },
        { id: 3, type: "like", user: "Beatriz Costa", action: "curtiu sua foto", time: "1 h atrás", image: "https://picsum.photos/seed/3/200" },
        { id: 4, type: "system", user: "Vivenza", action: "Bem-vindo ao novo feed!", time: "2 h atrás", image: "" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-rose-950 relative">
                    <Bell className="h-6 w-6" />
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-rose-500 border-2 border-background"></div>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px]">
                <SheetHeader className="mb-6">
                    <SheetTitle>Notificações</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-4">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                            <div className="relative">
                                <Avatar className="h-10 w-10 border border-border">
                                    <AvatarImage src={notif.image} />
                                    <AvatarFallback>{notif.user[0]}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 rounded-full p-0.5 border-2 border-background ${
                                    notif.type === 'like' ? 'bg-rose-500' : 
                                    notif.type === 'comment' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}>
                                    {notif.type === 'like' && <Heart className="h-3 w-3 text-white fill-white" />}
                                    {notif.type === 'comment' && <MessageCircle className="h-3 w-3 text-white fill-white" />}
                                    {notif.type === 'system' && <Bell className="h-3 w-3 text-white fill-white" />}
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm leading-snug">
                                    <span className="font-semibold">{notif.user}</span> {notif.action}
                                </p>
                                <p className="text-xs text-muted-foreground">{notif.time}</p>
                            </div>
                            {notif.type !== 'system' && (
                                <div className="h-10 w-10 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                     <img src={`https://picsum.photos/seed/${notif.id + 50}/200`} className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
