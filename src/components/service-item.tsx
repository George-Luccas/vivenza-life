import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Service } from "@prisma/client"
import { Clock } from "lucide-react"
import Image from "next/image"

interface ServiceItemProps {
  service: Service
}

export function ServiceItem({ service }: ServiceItemProps) {
  return (
    <Card className="flex flex-row overflow-hidden items-center p-2 gap-4 hover:bg-muted/50 transition-colors">
        <div className="relative h-20 w-20 rounded-md overflow-hidden shrink-0">
            {service.imageUrl && (
                <Image 
                    src={service.imageUrl} 
                    alt={service.name} 
                    fill 
                    className="object-cover"
                />
            )}
        </div>
        <div className="flex-1 space-y-1">
            <h4 className="font-semibold text-sm">{service.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
            <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(service.price))}
                </span>
                 <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {service.durationMinutes} min
                </div>
            </div>
        </div>
        <div className="pr-2">
            <Button size="sm" variant="secondary">Reservar</Button>
        </div>
    </Card>
  )
}
