"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import { Loader2, Image as ImageIcon, UploadCloud } from "lucide-react"
import Image from "next/image"
import { createStory } from "@/app/_actions/story"
import { useRouter } from "next/navigation"

interface CreateStoryDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateStoryDialog({ trigger, open: controlledOpen, onOpenChange: setControlledOpen }: CreateStoryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  
  const open = isControlled ? controlledOpen : internalOpen
  
  const setOpen = (value: boolean) => {
     if (isControlled) {
         setControlledOpen?.(value)
     } else {
         setInternalOpen(value)
     }
  }

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    try {
        const formData = new FormData()
        formData.append("imageFile", file)
        
        await createStory(formData)
        setOpen(false)
        setFile(null)
        setPreview(null)
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar ao seu Story</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
             {/* Preview Area */}
             <div 
                className="relative w-full aspect-[9/16] bg-muted rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
             >
                {preview ? (
                    <Image 
                        src={preview} 
                        alt="Preview" 
                        fill 
                        className="object-cover" 
                    />
                ) : (
                    <div className="text-center p-4">
                        <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Clique para escolher uma foto</p>
                    </div>
                )}
             </div>
             
             <Input 
                id="image" 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
             />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || !file} className="w-full bg-rose-500 hover:bg-rose-600">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Compartilhar Story"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
