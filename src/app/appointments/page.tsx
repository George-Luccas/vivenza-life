import { MainLayout } from "@/components/layout/main-layout";
import { getBookings, cancelBooking } from "@/app/_actions/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function AppointmentsPage() {
  const bookings = await getBookings();

  return (
    <MainLayout>
       <div className="space-y-6">
        <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
        
        {bookings.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border rounded-lg bg-card">
                <Calendar className="w-12 h-12 text-muted-foreground/50" />
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg">Nenhum agendamento</h3>
                    <p className="text-muted-foreground">Você ainda não tem serviços agendados.</p>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0 flex flex-col sm:flex-row">
                            {/* Image Section */}
                            <div className="relative h-32 w-full sm:w-32 bg-muted shrink-0">
                                {booking.service?.imageUrl && (
                                    <Image 
                                        src={booking.service.imageUrl} 
                                        alt={booking.service.name} 
                                        fill 
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            
                            {/* Content Section */}
                            <div className="flex-1 p-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="space-y-2">
                                    <div className="space-y-1">
                                         <Badge className={
                                            booking.status === 'CONFIRMED' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500'
                                         }>
                                            {booking.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                                         </Badge>
                                         <h3 className="font-bold text-lg">{booking.service?.name}</h3>
                                         <p className="text-muted-foreground text-sm">{booking.establishment?.name}</p>
                                    </div>

                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {format(new Date(booking.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {format(new Date(booking.date), "HH:mm")}
                                        </div>
                                         <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {booking.establishment?.address}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="self-end sm:self-center">
                                     <form action={async () => {
                                         "use server"
                                         await cancelBooking(booking.id)
                                     }}>
                                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <X className="w-4 h-4 mr-2" />
                                            Cancelar
                                         </Button>
                                     </form>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
       </div>
    </MainLayout>
  );
}
