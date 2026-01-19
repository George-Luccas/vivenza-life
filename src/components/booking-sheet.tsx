"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Service, Establishment } from "@prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react"
import { toast } from "sonner"
import { createBooking } from "@/app/_actions/bookings"
import { cn } from "@/lib/utils"

interface BookingSheetProps {
    service: Service
    establishmentId: string // We only need the ID, but knowing the name is nice context if possible. 
    // Ideally we pass the whole establishment or just fetch it, but let's stick to props for now.
    children: React.ReactNode
}

export function BookingSheet({ service, establishmentId, children }: BookingSheetProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Mock time slots - in a real app this would come from the server based on the date
    const timeSlots = [
        "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
    ]

    const handleBooking = async () => {
        if (!date || !selectedTime) return

        setIsLoading(true)
        try {
            // Combine date and time
            const [hours, minutes] = selectedTime.split(":").map(Number)
            const bookingDate = new Date(date)
            bookingDate.setHours(hours, minutes, 0, 0)

            await createBooking({
                serviceId: service.id,
                establishmentId,
                date: bookingDate
            })

            toast.success("Agendado com sucesso")
            setIsOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao realizar agendamento. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full sm:max-w-md">
                <SheetHeader className="text-left">
                    <SheetTitle>Agendar Serviço</SheetTitle>
                    <SheetDescription>
                        {service.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(service.price))}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-6 py-6">
                    {/* Calendar */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-medium flex items-center gap-2 text-rose-700">
                             <CalendarIcon className="w-4 h-4" />
                             Selecione a Data
                        </h3>
                        <div className="flex justify-center w-full">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-xl border-none shadow-sm bg-white dark:bg-card p-4 w-fit"
                                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                locale={ptBR}
                            />
                        </div>
                    </div>

                    {/* Time Slots */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-medium flex items-center gap-2 text-rose-700">
                             <Clock className="w-4 h-4" />
                             Selecione o Horário
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {timeSlots.map((time) => (
                                <Button
                                    key={time}
                                    variant="outline"
                                    className={cn(
                                        "w-full rounded-full border-rose-200 text-rose-900 hover:bg-rose-50 hover:text-rose-700 transition-all",
                                        selectedTime === time && "bg-rose-500 text-white border-rose-500 hover:bg-rose-600 hover:text-white shadow-md shadow-rose-200"
                                    )}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    {time}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <SheetFooter className="flex-col gap-2 sm:flex-col">
                    <Button 
                        onClick={handleBooking} 
                        disabled={!date || !selectedTime || isLoading}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Confirmando...
                            </>
                        ) : (
                            "Confirmar Agendamento"
                        )}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
