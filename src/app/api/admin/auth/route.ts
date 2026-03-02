import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mugz2026';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_PASSWORD) {
            (await cookies()).set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
    } catch {
        return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
    }
}
