"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronLeft, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    setLoading(true)
    await authClient.signUp.email({
        email,
        password,
        name,
        fetchOptions: {
            onSuccess: () => {
                router.push("/")
                router.refresh()
            },
            onError: (ctx) => {
                alert(ctx.error.message)
                setLoading(false)
            }
        }
    })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 relative overflow-hidden bg-background">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-rose-500/10 blur-[100px]" />
            <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-400/10 blur-[100px]" />
        </div>

        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 hover:bg-background/20" asChild>
            <Link href="/">
                <ChevronLeft className="h-6 w-6" />
            </Link>
        </Button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10"
      >
        <Card className="border-none shadow-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Sparkles className="h-6 w-6" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Criar Conta</CardTitle>
                <CardDescription>
                    Junte-se a nós para uma experiência única
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                id="name"
                placeholder="Seu nome"
                className="bg-white/50 dark:bg-black/20 border-primary/20 focus-visible:ring-primary/50"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                className="bg-white/50 dark:bg-black/20 border-primary/20 focus-visible:ring-primary/50"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                id="password"
                type="password"
                className="bg-white/50 dark:bg-black/20 border-primary/20 focus-visible:ring-primary/50"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg shadow-rose-500/25 border-none transition-all hover:scale-[1.02]" onClick={handleRegister} disabled={loading}>
                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Criar Conta
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary transition-colors">
                Entrar
                </Link>
            </div>
            </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
