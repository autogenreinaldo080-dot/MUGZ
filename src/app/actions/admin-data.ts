'use server';

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Verifier to ensure only admins can run these actions
async function requireAdmin() {
    const session = (await cookies()).get('admin_session');
    if (!session || session.value !== 'authenticated') {
        throw new Error('No autorizado');
    }
}

export async function updateUserStatus(userId: string, newStatus: string) {
    await requireAdmin();
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status: newStatus }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to update user status' };
    }
}

export async function updatePhotoStatus(photoId: string, newStatus: string) {
    await requireAdmin();
    try {
        await prisma.photo.update({
            where: { id: photoId },
            data: { status: newStatus }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to update photo status' };
    }
}
