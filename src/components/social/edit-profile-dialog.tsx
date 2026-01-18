"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useTransition } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "@/app/_actions/profile"
import { Loader2, Upload } from "lucide-react"

interface EditProfileDialogProps {
    user: {
        id: string
        name: string | null
        image: string | null
    }
    trigger?: React.ReactNode
}

export function EditProfileDialog({ user, trigger }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState(user.name || "")
    const [imagePreview, setImagePreview] = useState<string | null>(user.image)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const formData = new FormData()
        formData.append("name", name)
        if (imageFile) {
            formData.append("imageFile", imageFile)
        }

        startTransition(async () => {
            const result = await updateProfile(formData)
            if (result.success) {
                setOpen(false)
            } else {
                // You might want to add toast error handling here
                console.error(result.error)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline">Editar Perfil</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24 cursor-pointer relative group">
                            <AvatarImage src={imagePreview || ""} />
                            <AvatarFallback>{name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                            <label 
                                htmlFor="avatar-upload" 
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                            >
                                <Upload className="h-6 w-6 text-white" />
                            </label>
                        </Avatar>
                        <Input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange}
                        />
                        <Label htmlFor="avatar-upload" className="cursor-pointer text-sm text-primary hover:underline">
                            Alterar foto
                        </Label>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            disabled={isPending}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-rose-500 hover:bg-rose-600">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
