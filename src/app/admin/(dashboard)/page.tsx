import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboard() {
    let userCount = 0;
    let operativeCount = 0;
    let enJuegoCount = 0;
    let users: any[] = [];
    let photos: any[] = [];

    try {
        // Prisma only works locally with SQLite. In Vercel serverless, it will gracefully fail.
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        userCount = await prisma.user.count();
        operativeCount = await prisma.operativo.count();
        // @ts-ignore
        enJuegoCount = await prisma.user.count({ where: { status: 'EN_JUEGO' } });
        // @ts-ignore
        users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
        // @ts-ignore
        photos = await (prisma as any).photo.findMany({ 
            include: { user: true },
            orderBy: { createdAt: 'desc' } 
        });
        
        // Transformar para que el client reciba lo que espera (userName)
        photos = photos.map((p: any) => ({
            ...p,
            userName: p.user?.nombre || 'Usuario desconocido',
            fecha: p.createdAt.toLocaleDateString('es-CL'),
        }));

        await prisma.$disconnect();
    } catch (e) {
        console.warn('[Admin] Base de datos no disponible en este entorno serverless:', e);
    }

    return (
        <AdminDashboardClient
            initialUsers={users}
            initialPhotos={photos}
            stats={{ userCount, operativeCount, enJuegoCount }}
        />
    );
}
