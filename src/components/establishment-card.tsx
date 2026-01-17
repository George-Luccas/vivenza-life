import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import { Establishment } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

interface EstablishmentCardProps {
  establishment: Establishment
}

export function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  return (
    <Link href={`/establishments/${establishment.id}`}>
        <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50 bg-card hover:-translate-y-1">
        <div className="relative h-48 w-full overflow-hidden">
            <div className="absolute inset-0 bg-neutral-200 animate-pulse dark:bg-neutral-800" /> {/* Placeholder */}
            {establishment.imageUrl && (
                <Image
                    src={establishment.imageUrl}
                    alt={establishment.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
            )}
            <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-white/95 text-black hover:bg-white shadow-sm backdrop-blur-sm">{establishment.category}</Badge>
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        </div>
        <CardContent className="p-4 relative">
            <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{establishment.name}</h3>
                 <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    4.8
                 </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
            {establishment.description}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1 text-primary" />
            <span className="truncate">{establishment.address}</span>
            </div>
        </CardContent>
        </Card>
    </Link>
  )
}
