import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import AdminDashboardClient from './AdminDashboardClient';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
    // Stats
    const userCount = await prisma.user.count();
    const operativeCount = await prisma.operativo.count();
    const enJuegoCount = await prisma.user.count({ where: { status: 'EN_JUEGO' } });

    // Fetch all users and photos
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const photos = await prisma.photo.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <AdminDashboardClient
            initialUsers={users}
            initialPhotos={photos}
            stats={{ userCount, operativeCount, enJuegoCount }}
        />
    );
}
