'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function registerUser(formData: any) {
  try {
    const user = await prisma.user.create({
      data: {
        nombre: formData.nombre,
        rut: formData.rut,
        edad: parseInt(formData.edad),
        telefono: formData.telefono,
        email: formData.email || `user_${Date.now()}@metelegal.com`,
        comuna: formData.comuna,
        club: formData.club,
        esSocioCDI: formData.esSocioCDI,
        status: 'EN_JUEGO',
      },
    });

    // Si tiene club, actualizamos el contador del club
    if (formData.club) {
      await prisma.club.upsert({
        where: { nombre: formData.club },
        update: { miembros: { increment: 1 } },
        create: { nombre: formData.club, miembros: 1, puntos: 0 },
      });
    }

    return { 
      success: true, 
      user: {
        ...user,
        badges: [], // Inicialmente sin medallas
        ratings: []
      } 
    };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'El RUT o Email ya está registrado.' };
    }
    console.error(error);
    return { success: false, error: 'Error al registrar usuario' };
  }
}

export async function loginUser(rut: string, telefono: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        rut: rut,
        telefono: telefono,
      },
      include: {
        badges: true,
        ratings: true,
      },
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado o datos incorrectos.' };
    }

    return { 
      success: true, 
      user: {
        ...user,
        badges: user.badges.map((b: any) => b.id), // Map to string IDs
        ratings: (user as any).ratings?.map((r: any) => ({ songId: r.songId, stars: r.stars })) || []
      } 
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al iniciar sesión' };
  }
}

export async function getOperativos() {
  try {
    const operativos = await prisma.operativo.findMany({
      include: {
        _count: {
          select: { usuarios: true }
        }
      }
    });

    return { 
      success: true, 
      operativos: operativos.map(o => ({
        ...o,
        cuposDisponibles: o.cupos - o._count.usuarios,
        estado: (o.cupos - o._count.usuarios) <= 0 ? 'completo' : 'disponible'
      }))
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al obtener operativos' };
  }
}

export async function joinOperativo(userId: string, operativoId: string) {
  try {
    // 1. Verificar si hay cupos
    const operativo = await prisma.operativo.findUnique({
      where: { id: operativoId },
      include: { _count: { select: { usuarios: true } } }
    });

    if (!operativo || operativo._count.usuarios >= operativo.cupos) {
      return { success: false, error: 'Operativo completo o no encontrado.' };
    }

    // 2. Unir usuario al operativo
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        operativos: {
          connect: { id: operativoId }
        }
      },
      include: {
        badges: true,
        ratings: true,
      }
    });

    revalidatePath('/');
    return { 
      success: true, 
      user: {
        ...updatedUser,
        badges: updatedUser.badges.map((b: any) => b.id),
        ratings: (updatedUser as any).ratings?.map((r: any) => ({ songId: r.songId, stars: r.stars })) || []
      } 
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al unirse al operativo' };
  }
}

export async function getClubLeaderboard() {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { miembros: 'desc' },
      take: 5
    });
    return { success: true, clubs };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al obtener ranking' };
  }
}

export async function getPlaylist() {
  try {
    const songs = await prisma.song.findMany({
      include: {
        ratings: true
      }
    });

    return {
      success: true,
      songs: songs.map(s => {
        const avgRating = s.ratings.length > 0 
          ? s.ratings.reduce((acc, curr) => acc + curr.stars, 0) / s.ratings.length 
          : 0;
        return {
          ...s,
          averageRating: avgRating,
          totalRatings: s.ratings.length
        };
      })
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al obtener la playlist' };
  }
}

export async function rateSong(userId: string, songId: string, stars: number) {
  try {
    await prisma.rating.upsert({
      where: {
        userId_songId: {
          userId,
          songId
        }
      },
      update: {
        stars
      },
      create: {
        userId,
        songId,
        stars
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al calificar la canción' };
  }
}
