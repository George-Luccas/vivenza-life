import { getEstablishmentById } from "@/app/_actions/establishments";
import { MainLayout } from "@/components/layout/main-layout";
import { ServiceItem } from "@/components/service-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EstablishmentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EstablishmentDetailsPage({ params }: EstablishmentDetailsPageProps) {
  const { id } = await params;
  const establishment = await getEstablishmentById(id);

  if (!establishment) {
    return notFound();
  }

  return (
    <MainLayout>
      <div className="relative">
        {/* Header Image */}
        <div className="relative h-[250px] w-full md:h-[350px] lg:h-[400px]">
             {establishment.imageUrl && (
                <Image
                    src={establishment.imageUrl}
                    alt={establishment.name}
                    fill
                    className="object-cover brightness-75"
                    priority
                />
            )}
            <div className="absolute top-4 left-4 z-10">
                <Button variant="secondary" size="icon" asChild className="rounded-full bg-white/80 hover:bg-white">
                    <Link href="/establishments"><ChevronLeft className="h-5 w-5"/></Link>
                </Button>
            </div>
        </div>

        {/* Content */}
        <div className="container relative z-20 -mt-10 md:-mt-20 pb-10">
             <div className="rounded-xl border bg-card text-card-foreground shadow-lg p-6 mb-8">
                 <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                    <div className="space-y-1">
                         <Badge className="mb-2 bg-rose-500 hover:bg-rose-600 border-none">{establishment.category}</Badge>
                         <h1 className="text-2xl md:text-3xl font-bold">{establishment.name}</h1>
                         <div className="flex items-center text-muted-foreground text-sm">
                             <MapPin className="h-4 w-4 mr-1"/>
                             {establishment.address}
                         </div>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full w-fit">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-bold text-yellow-600">4.8</span>
                        <span className="text-xs text-muted-foreground">(120 avaliações)</span>
                    </div>
                 </div>
                 <p className="mt-4 text-muted-foreground">{establishment.description}</p>
             </div>

             <div className="space-y-6">
                 <h2 className="text-xl font-bold">Serviços Disponíveis</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {establishment.services.map(service => (
                         <ServiceItem key={service.id} service={service} />
                     ))}
                 </div>
             </div>
        </div>
      </div>
    </MainLayout>
  );
}
