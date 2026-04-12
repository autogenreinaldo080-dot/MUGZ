const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Crear Clubes iniciales
  const clubs = [
    { nombre: 'Deportivo Cavancha', miembros: 45, puntos: 120 },
    { nombre: 'Unión Morro', miembros: 38, puntos: 95 },
    { nombre: 'Estrella de Chile', miembros: 32, puntos: 80 },
    { nombre: 'Iquique Wanderers', miembros: 28, puntos: 70 },
    { nombre: 'Liga Pozo Al Monte', miembros: 22, puntos: 55 },
  ]

  for (const club of clubs) {
    await prisma.club.upsert({
      where: { nombre: club.nombre },
      update: club,
      create: club,
    })
  }

  // 2. Crear Operativos iniciales
  const operativos = [
    {
      fecha: '15 Abril 2026',
      hora: '09:00 - 14:00',
      lugar: 'Estadio Tierra de Campeones',
      direccion: 'Av. Playa Brava 1234, Iquique',
      cupos: 100,
      imagen: '/images/cdi2.png'
    },
    {
      fecha: '22 Abril 2026',
      hora: '09:00 - 14:00',
      lugar: 'Complejo Deportivo Alto Hospicio',
      direccion: 'Av. Los Aromos 567, Alto Hospicio',
      cupos: 80,
      imagen: '/images/amateur.png'
    },
    {
      fecha: '29 Abril 2026',
      hora: '10:00 - 15:00',
      lugar: 'Mall Zofri',
      direccion: 'Zona Franca, Iquique',
      cupos: 120,
      imagen: '/images/cdi2.png'
    },
    {
      fecha: '6 Mayo 2026',
      hora: '09:00 - 13:00',
      lugar: 'Hospital Regional de Iquique',
      direccion: 'Av. Héroes de la Concepción 789',
      cupos: 60,
      imagen: '/images/crack_oyarzo.png'
    }
  ]

  for (const op of operativos) {
    await prisma.operativo.create({
      data: op
    })
  }

  // 3. Crear Canciones Iniciales de la Campaña (Banda Sonora)
  const songs = [
    { title: 'Himno de la Prevención', artist: 'MUG Z', audioUrl: '/audio/track1.mp3', coverUrl: '/images/cdi2.png' },
    { title: 'El Gol de tu Vida', artist: 'MUG Z', audioUrl: '/audio/track2.mp3', coverUrl: '/images/amateur.png' },
    { title: 'Cancha y Salud', artist: 'MUG Z', audioUrl: '/audio/track3.mp3', coverUrl: '/images/crack_oyarzo.png' },
    { title: 'Ponte la Camiseta', artist: 'MUG Z', audioUrl: '/audio/track4.mp3', coverUrl: '/images/logo_impacta.png' },
    { title: 'Segundo Tiempo Adelante', artist: 'MUG Z', audioUrl: '/audio/track5.mp3', coverUrl: '/images/logo_sesp.png' },
    { title: 'Victoria Norteña', artist: 'MUG Z', audioUrl: '/audio/track6.mp3', coverUrl: '/images/cdi2.png' },
    { title: 'La Hinchada no Falla', artist: 'MUG Z', audioUrl: '/audio/track7.mp3', coverUrl: '/images/amateur.png' },
    { title: 'Cuidarse es de Cracks', artist: 'MUG Z', audioUrl: '/audio/track8.mp3', coverUrl: '/images/crack_oyarzo.png' },
    { title: 'Pitazo Final Digno', artist: 'MUG Z', audioUrl: '/audio/track9.mp3', coverUrl: '/images/logo_impacta.png' },
    { title: 'Iquique Glorioso y Sano', artist: 'MUG Z', audioUrl: '/audio/track10.mp3', coverUrl: '/images/logo_sesp.png' },
  ]

  for (const song of songs) {
    // Evitar duplicados por si se ejecuta de nuevo
    const exists = await prisma.song.findFirst({ where: { title: song.title } });
    if (!exists) {
      await prisma.song.create({
        data: song
      });
    }
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
