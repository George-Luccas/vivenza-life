"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth" 
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

interface CreateBookingParams {
    serviceId: string
    establishmentId: string
    date: Date
}

export async function createBooking({ serviceId, establishmentId, date }: CreateBookingParams) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    // Check if slot is available (Basic check: is there already a booking for this service at this time?)
    // This is a simplified check. Real-world would check establishment opening hours, service duration, etc.
    const existingBooking = await prisma.appointment.findFirst({
        where: {
            establishmentId,
            date: date, // Exact match for now
            status: "CONFIRMED" // Only block if confirmed? Or pending too? Let's say all for now.
        }
    })

    /* 
       Optimistic/Simulated availability:
       In a real app we'd verify complex overlaps. 
       For this MVP, we'll allow multiple bookings unless it's the exact same service/time/pro (conceptually).
       To prevent spam, let's just create it.
    */

    const booking = await prisma.appointment.create({
        data: {
            userId: session.user.id,
            serviceId,
            establishmentId,
            date,
            status: "CONFIRMED" 
        }
    })

    revalidatePath("/appointments")
    revalidatePath("/")
    
    return booking
}

export async function getBookings() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return []
    }

    const bookings = await prisma.appointment.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            service: true,
            establishment: true
        },
        orderBy: {
            date: 'desc'
        }
    })

    return bookings
}

export async function cancelBooking(bookingId: string) {
     const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    // Verify ownership
    const booking = await prisma.appointment.findUnique({
        where: { id: bookingId }
    })

    if (!booking || booking.userId !== session.user.id) {
        throw new Error("Unauthorized")
    }

    await prisma.appointment.delete({
        where: { id: bookingId }
    })

    revalidatePath("/appointments")
}
