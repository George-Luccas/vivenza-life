"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusSquare, Image as ImageIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { createPost } from "@/app/_actions/social"
import { useRouter } from "next/navigation"

interface CreatePostDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreatePostDialog({ trigger, open: controlledOpen, onOpenChange: setControlledOpen }: CreatePostDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
        await createPost(formData)
        setOpen(false)
        setPreviewUrl("") 
        router.refresh()
    } catch (err) {
        alert("Erro ao criar post: " + err)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Publicação</DialogTitle>
          <DialogDescription>
            Escolha uma foto da sua galeria
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="imageFile" className="cursor-pointer border-2 border-dashed border-muted-foreground/25 hover:border-rose-500 rounded-xl p-8 flex flex-col items-center justify-center transition-colors bg-muted/10">
                {previewUrl ? (
                    <div className="relative aspect-square w-full h-64">
                         <img src={previewUrl} alt="Preview" className="object-contain w-full h-full rounded-md" />
                         <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Trocar foto</span>
                    </div>
                ) : (
                    <>
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium text-muted-foreground">Clique para selecionar uma foto</span>
                    </>
                )}
            </Label>
            <Input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="hidden" // Hiding the default input
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="caption">Legenda</Label>
            <Textarea
              id="caption"
              name="caption"
              placeholder="Escreva uma legenda..."
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Compartilhar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
