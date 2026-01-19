import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Product } from "@prisma/client"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"

interface ProductItemProps {
  product: Product
}

export function ProductItem({ product }: ProductItemProps) {
  return (
    <Card className="flex flex-col overflow-hidden hover:bg-muted/50 transition-colors h-full">
        <div className="relative h-40 w-full shrink-0 bg-muted">
            {product.imageUrl ? (
                <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                />
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <ShoppingBag className="h-10 w-10 opacity-20" />
                </div>
            )}
        </div>
        <div className="flex flex-col flex-1 p-4 space-y-2">
            <div className="flex-1">
                <h4 className="font-semibold text-sm line-clamp-1" title={product.name}>{product.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
            </div>
            
            <div className="flex items-center justify-between pt-2 mt-auto">
                <span className="text-base font-bold text-emerald-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                </span>
                <Button size="sm" className="h-8 text-xs rounded-full">
                    Comprar
                </Button>
            </div>
        </div>
    </Card>
  )
}
