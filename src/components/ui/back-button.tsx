"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import Link from "next/link"

interface BackButtonProps {
    className?: string
    href?: string
}

export function BackButton({ className, href }: BackButtonProps) {
    const router = useRouter()

    if (href) {
        return (
            <Button 
                variant="ghost" 
                size="icon" 
                className={cn("hover:bg-transparent", className)}
                asChild
            >
                <Link href={href}>
                    <ArrowLeft className="h-6 w-6" />
                </Link>
            </Button>
        )
    }

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className={cn("hover:bg-transparent", className)}
            onClick={() => router.back()}
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
    )
}
