import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { nombre, rut, edad, telefono, email, comuna, club } = body

        // In a real implementation with Prisma migrated:
        // const user = await db.user.create({
        //   data: {
        //     nombre,
        //     rut,
        //     edad: parseInt(edad),
        //     telefono,
        //     email,
        //     comuna,
        //     club,
        //     puntos: 100, // Initial points for registering
        //     badges: {
        //       create: {
        //         name: "Primer Tiempo",
        //         description: "Bienvenido a la campaña",
        //         icon: "Trophy",
        //         color: "#00D4FF"
        //       }
        //     }
        //   }
        // })

        // For now, we return a success response simulating the backend interaction
        console.log("Mock database entry:", { nombre, rut, email, club })

        return NextResponse.json({
            success: true,
            message: "Usuario registrado con éxito",
            user: { nombre, points: 100 }
        })

    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ success: false, error: "Error al procesar el registro" }, { status: 500 })
    }
}
