import { getEstablishmentById } from "@/app/_actions/establishments";
import { MainLayout } from "@/components/layout/main-layout";
import { ServiceItem } from "@/components/service-item";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ChevronLeft, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductItem } from "@/components/product-item";
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
                 
                 <Tabs defaultValue="services" className="w-full">
                    <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-xl mb-6">
                        <TabsTrigger value="services" className="flex-1 md:flex-none rounded-lg py-2.5 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            Serviços ({establishment.services.length})
                        </TabsTrigger>
                        <TabsTrigger value="store" className="flex-1 md:flex-none rounded-lg py-2.5 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            Loja ({establishment.products.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="services" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                        <h2 className="text-xl font-bold hidden md:block">Serviços Disponíveis</h2>
                        {establishment.services.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {establishment.services.map(service => (
                                    <ServiceItem key={service.id} service={service} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground border border-dashed rounded-xl">
                                <p>Nenhum serviço disponível no momento.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="store" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                         <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold hidden md:block">Produtos da Loja</h2>
                         </div>
                         
                        {establishment.products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {establishment.products.map(product => (
                                    <ProductItem key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10 text-muted-foreground border border-dashed rounded-xl flex flex-col items-center gap-2">
                                <ShoppingBag className="h-10 w-10 opacity-20" />
                                <p>A loja está vazia no momento.</p>
                            </div>
                        )}
                    </TabsContent>
                 </Tabs>

             </div>

        </div>
      </div>
    </MainLayout>
  );
}
