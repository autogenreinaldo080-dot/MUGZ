'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mugz2026'; // Default para pruebas

export async function loginAdmin(password: string) {
    if (password === ADMIN_PASSWORD) {
        // Definimos la cookie de sesión del administrador
        (await cookies()).set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });
        return { success: true };
    }
    return { success: false, error: 'Contraseña incorrecta' };
}

export async function logoutAdmin() {
    (await cookies()).delete('admin_session');
    redirect('/admin/login');
}
