'use client'

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import Image from 'next/image'
import {
  Home, Calendar, FileText, User, Menu, ChevronRight,
  Shield, AlertCircle, Award, Users, MapPin, Clock,
  Phone, Check, Trophy, Target, Star, Shirt, Ticket, Crown,
  QrCode, Download, Bell, Settings, HelpCircle,
  Play, Info, Heart, Activity, Camera,
  LogOut, Share2, MessageCircle, ThumbsUp, Music,
  UserPlus, ArrowRight, Mail, ExternalLink,
  CircleUser, BookOpen, Scale
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'

// Interfaz propia de componentes
import HeroSection from '@/components/home/HeroSection'
import StatsCounter from '@/components/home/StatsCounter'
import PrizeVitrine from '@/components/home/PrizeVitrine'
import LeaderboardClubes from '@/components/home/LeaderboardClubes'
import AuspiciadoresGrid from '@/components/home/AuspiciadoresGrid'
import OperativoCard from '@/components/home/OperativoCard'
import InfoSalud from '@/components/home/InfoSalud'
import Galeria from '@/components/home/Galeria'
import PerfilUsuario from '@/components/home/PerfilUsuario'
import PreSeasonGate from '@/components/home/PreSeasonGate'

// Acciones Reales del Servidor
import { 
  registerUser, loginUser, getOperativos, 
  joinOperativo, getClubLeaderboard, getPlaylist, rateSong
} from '@/app/actions/user-actions'

// Types
type TabId = 'home' | 'operativos' | 'resultados' | 'galeria' | 'perfil' | 'mas'

interface UserData {
  id: string
  nombre: string
  rut: string
  edad: number
  telefono: string
  email: string
  comuna: string
  esJugador: boolean
  equipo: string
  club: string
  esSocioCDI: boolean
  inscrito: boolean
  examenRealizado: boolean
  examenFecha: string | null
  examenValidado: boolean // Nuevo: Para validación administrativa
  badges: string[]
  ratings?: { songId: string, stars: number }[]
  fechaRegistro: string
}

interface Operativo {
  id: number
  fecha: string
  hora: string
  lugar: string
  direccion: string
  cupos: number
  cuposDisponibles: number
  estado: 'disponible' | 'completo' | 'finalizado'
  imagen: string
}

interface GaleriaItem {
  id: number
  tipo: 'foto' | 'video'
  titulo: string
  descripcion: string
  fecha: string
  likes: number
  comentarios: number
  imagen: string
}

// Mock data
const operativosMock: Operativo[] = [
  { id: 1, fecha: '15 Abril 2026', hora: '09:00 - 14:00', lugar: 'Estadio Tierra de Campeones', direccion: 'Av. Playa Brava 1234, Iquique', cupos: 100, cuposDisponibles: 45, estado: 'disponible', imagen: '/images/cdi2.png' },
  { id: 2, fecha: '22 Abril 2026', hora: '09:00 - 14:00', lugar: 'Complejo Deportivo Alto Hospicio', direccion: 'Av. Los Aromos 567, Alto Hospicio', cupos: 80, cuposDisponibles: 80, estado: 'disponible', imagen: '/images/amateur.png' },
  { id: 3, fecha: '29 Abril 2026', hora: '10:00 - 15:00', lugar: 'Mall Zofri', direccion: 'Zona Franca, Iquique', cupos: 120, cuposDisponibles: 0, estado: 'completo', imagen: '/images/cdi2.png' },
  { id: 4, fecha: '6 Mayo 2026', hora: '09:00 - 13:00', lugar: 'Hospital Regional de Iquique', direccion: 'Av. Héroes de la Concepción 789', cupos: 60, cuposDisponibles: 60, estado: 'disponible', imagen: '/images/crack_oyarzo.png' },
]

const galeriaMock: GaleriaItem[] = [
  { id: 1, tipo: 'foto', titulo: 'Lanzamiento de Campaña', descripcion: 'Primer operativo en Estadio Tierra de Campeones', fecha: '15 Abr 2026', likes: 234, comentarios: 45, imagen: '/images/cdi2.png' },
  { id: 2, tipo: 'foto', titulo: 'Ligas Amateur Unidas', descripcion: 'Jugadores de ANFA participando', fecha: '18 Abr 2026', likes: 189, comentarios: 32, imagen: '/images/amateur.png' },
  { id: 3, tipo: 'foto', titulo: 'CDI en Acción', descripcion: 'Socios y abonados comprometidos', fecha: '20 Abr 2026', likes: 456, comentarios: 78, imagen: '/images/cdi2.png' },
  { id: 4, tipo: 'foto', titulo: 'Crack Oyarzo Apoya', descripcion: 'Embajador de la campaña', fecha: '22 Abr 2026', likes: 321, comentarios: 56, imagen: '/images/crack_oyarzo.png' },
]

const infoCards = [
  { icon: Shield, title: '¿Qué es el cáncer de próstata?', content: 'Es el crecimiento descontrolado de células en la próstata. Es el cáncer más común en hombres chilenos, pero tiene alta tasa de curación si se detecta a tiempo.' },
  { icon: Activity, title: '¿Qué es el examen PSA?', content: 'El PSA (Antígeno Prostático Específico) es un análisis de sangre simple que detecta niveles de una proteína producida por la próstata. No es invasivo y toma solo minutos.' },
  { icon: AlertCircle, title: 'Factores de riesgo', content: 'Edad mayor a 40 años, antecedentes familiares, obesidad, y factores étnicos aumentan el riesgo. La prevención temprana salva vidas.' },
  { icon: Heart, title: 'Detección temprana', content: 'Con detección temprana, la tasa de supervivencia supera el 90%. El examen PSA puede detectar el cáncer en etapas iniciales cuando es más tratable.' },
]

const badges = [
  { id: 'primer-tiempo', name: 'Primer Tiempo', description: 'Inscripción completada', icon: Play, color: '#00D4FF' },
  { id: 'gol-anotado', name: 'Gol Anotado', description: 'Examen PSA realizado', icon: Target, color: '#10B981' },
  { id: 'jugador-estrella', name: 'Jugador Estrella', description: 'Derivación completada', icon: Star, color: '#F59E0B' },
  { id: 'capitan', name: 'Capitán', description: 'Referiste a 5 amigos', icon: Users, color: '#8B5CF6' },
  { id: 'goleador', name: 'Goleador', description: '10 exámenes referidos', icon: Trophy, color: '#EC4899' },
]

const leaderboard = [
  { rank: 1, team: 'Club Deportivo Iquique', exams: 89, logo: '/images/logo_cdi.png' },
  { rank: 2, team: 'Liga ANFA Iquique', exams: 76, logo: '/images/amateur.png' },
  { rank: 3, team: 'Liga Alto Hospicio', exams: 68, logo: '/images/amateur.png' },
  { rank: 4, team: 'Asociación Pica', exams: 52, logo: '/images/amateur.png' },
  { rank: 5, team: 'Liga Pozo Al Monte', exams: 45, logo: '/images/amateur.png' },
]

// Auspiciadores
const auspiciadores = [
  { nombre: 'Fundación SESP', logo: '/images/logo_sesp_white.png', link: '#' },
  { nombre: 'Impacta', logo: '/images/logo_impacta_white.png', link: '#' },
  { nombre: 'Club Deportes Iquique', logo: '/images/logo_cdi_white.png', link: '#' },
  { nombre: 'Collahuasi', logo: '/images/logo_collahuasi_trans_white.png', link: '#' },
  { nombre: 'GORE Tarapacá', logo: '/images/logo_gorecolor_white.png', link: '#' },
  { nombre: 'AFI', logo: '/images/logo_afi_trans_white.png', link: '#' },
]

const songsFallback = [
  { id: '1', title: 'Himno de la Prevención', artist: 'MUG Z', audioUrl: '/audio/track1.mp3', coverUrl: '/images/cdi2.png', averageRating: 4.8, totalRatings: 156 },
  { id: '2', title: 'El Gol de tu Vida', artist: 'MUG Z', audioUrl: '/audio/track2.mp3', coverUrl: '/images/amateur.png', averageRating: 4.5, totalRatings: 132 },
  { id: '3', title: 'Ponte la Camiseta', artist: 'MUG Z', audioUrl: '/audio/track3.mp3', coverUrl: '/images/crack_oyarzo.png', averageRating: 4.7, totalRatings: 98 },
]

// ========== COMPONENTE PRINCIPAL ==========
export default function MeteleGolApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSuccessRegistration, setShowSuccessRegistration] = useState(false) // Nuevo
  const [showQR, setShowQR] = useState(false)
  const [examCount, setExamCount] = useState(347)
  const [displayCount, setDisplayCount] = useState(0)
  const [user, setUser] = useState<UserData | null>(null)
  const [rankingType, setRankingType] = useState<'jugador' | 'club'>('jugador')
  const [liveOperativos, setLiveOperativos] = useState<any[]>([])
  const [liveLeaderboard, setLiveLeaderboard] = useState<any[]>([])
  const [livePlaylist, setLivePlaylist] = useState<any[]>([])
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<{
    nombre: string, rut: string, edad: string, telefono: string, email: string, comuna: string,
    esJugador: boolean, equipo: string, club: string, otroClub?: string, esSocioCDI: boolean, aceptaTerminos: boolean
  }>({
    nombre: '', rut: '', edad: '', telefono: '', email: '', comuna: '',
    esJugador: false, equipo: '', club: '', otroClub: '', esSocioCDI: false, aceptaTerminos: false
  })
  const [loginData, setLoginData] = useState({ rut: '', telefono: '' })
  const [selectedOperativo, setSelectedOperativo] = useState<any | null>(null)
  const [showOperativoDetail, setShowOperativoDetail] = useState(false)
  const [selectedGaleriaItem, setSelectedGaleriaItem] = useState<any | null>(null)
  const [showGaleriaLightbox, setShowGaleriaLightbox] = useState(false)
  
  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const ops = await getOperativos()
        if (ops.success && ops.operativos.length > 0) {
          setLiveOperativos(ops.operativos)
        } else {
          // Fallback data if DB is empty but we want to show something
          setLiveOperativos(operativosMock)
        }
        
        const rank = await getClubLeaderboard()
        if (rank.success && rank.clubs.length > 0) {
          setLiveLeaderboard(rank.clubs)
        } else {
          setLiveLeaderboard(leaderboard.map((l, i) => ({ id: `l-${i}`, nombre: l.team, miembros: l.exams, logo: l.logo })))
        }

        const songsData = await getPlaylist()
        if (songsData.success && songsData.songs.length > 0) {
          setLivePlaylist(songsData.songs)
        } else {
          setLivePlaylist(songsFallback)
        }
      } catch (error) {
        console.error("Error loading initial data", error)
        setLiveOperativos(operativosMock)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Persistencia: Cargar usuario al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('mugz_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error("Error al cargar usuario de localStorage", e)
      }
    }
  }, [])

  // Persistencia: Guardar usuario al cambiar
  useEffect(() => {
    if (user) {
      localStorage.setItem('mugz_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('mugz_user')
    }
  }, [user])

  // Simular contador
  useEffect(() => {
    const interval = setInterval(() => {
      setExamCount(prev => prev < 800 ? prev + Math.floor(Math.random() * 3) : prev)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  // Count-up animado al cargar
  useEffect(() => {
    const target = examCount
    const duration = 1800
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo para que desacelere al final
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    const raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [examCount])

  // Persistencia: Cargar estado de autorización
  useEffect(() => {
    const authorized = sessionStorage.getItem('mugz_auth') === 'true'
    if (authorized) setIsAuthorized(true)
  }, [])

  const handleAuthorize = () => {
    setIsAuthorized(true)
    sessionStorage.setItem('mugz_auth', 'true')
  }

  // Confetti de celebración
  const fireConfetti = useCallback((origin = { x: 0.5, y: 0.6 }) => {
    confetti({ particleCount: 80, spread: 70, origin, colors: ['#00D4FF', '#10B981', '#F59E0B', '#ffffff'], zIndex: 9999 })
    setTimeout(() => {
      confetti({ particleCount: 50, spread: 100, origin: { x: 0.2, y: 0.7 }, colors: ['#00D4FF', '#F59E0B'], zIndex: 9999 })
      confetti({ particleCount: 50, spread: 100, origin: { x: 0.8, y: 0.7 }, colors: ['#10B981', '#ffffff'], zIndex: 9999 })
    }, 250)
  }, [])

  const handleRegister = async () => {
    // Validación de campos básicos
    if (!formData.nombre || !formData.rut || !formData.edad || !formData.telefono) {
      toast({ title: '⚠️ Campos incompletos', description: 'Por favor completa nombre, RUT, edad y teléfono.', variant: 'destructive' })
      return
    }

    // Si elige "OTRO" club, el campo otroClub debe estar lleno
    if (formData.club === 'otro' && !formData.otroClub) {
      toast({ title: '⚠️ Falta nombre del club', description: 'Por favor escribe el nombre de tu club.', variant: 'destructive' })
      return
    }

    if (!formData.aceptaTerminos) {
      toast({ title: '⚠️ Términos y condiciones', description: 'Debes aceptar los términos y condiciones para continuar.', variant: 'destructive' })
      return
    }
    setIsLoading(true)
    const finalClub = formData.club === 'otro' ? formData.otroClub : formData.club
    
    const result = await registerUser({
      ...formData,
      club: finalClub
    })

    if (result.success) {
      setUser(result.user as any)
      setShowRegistration(false)
      setShowSuccessRegistration(true)
      // Efecto de festejo inmediato
      setTimeout(() => {
        fireConfetti()
        toast({ title: '⚽ ¡FICHAJE COMPLETADO!', description: '¡Bienvenido al equipo, crack!' })
      }, 500)
    } else {
      toast({ title: '❌ Error', description: result.error, variant: 'destructive' })
    }
    setIsLoading(false)
  }

  const handleLogin = async () => {
    if (!loginData.rut || !loginData.telefono) {
      toast({ title: '⚠️ Datos incompletos', description: 'Ingresa tu RUT y teléfono.', variant: 'destructive' })
      return
    }
    setIsLoading(true)

    // Developer / Staff Bypass
    if (loginData.rut === 'MUG2026' || loginData.telefono === 'MUG2026') {
      const staffUser: UserData = {
        id: 'STAFF-2026', nombre: 'Staff Técnico MUG Z', rut: '00.000.000-0', edad: 33,
        telefono: 'MUG2026', email: 'staff@metelegal.com', comuna: 'Iquique',
        esJugador: true, equipo: 'Staff Iquique', club: 'CDI / SESP', esSocioCDI: true,
        inscrito: true, examenRealizado: true, examenFecha: 'En proceso', examenValidado: true,
        badges: ['primer-tiempo', 'capitan', 'gol-anotado'], 
        ratings: [],
        fechaRegistro: new Date().toISOString()
      }
      setUser(staffUser)
      setShowLogin(false)
      setIsLoading(false)
      toast({ title: '🛠️ Acceso Staff Autorizado', description: 'Has ingresado con privilegios de desarrollador.' })
      return
    }

    const result = await loginUser(loginData.rut, loginData.telefono)
    if (result.success) {
      setUser(result.user as any)
      setShowLogin(false)
      toast({ title: '⚽ ¡Bienvenido de vuelta!', description: `Hola ${result.user.nombre}, ya estás en la lista.` })
    } else {
      toast({ title: '❌ Error', description: result.error, variant: 'destructive' })
    }
    setIsLoading(false)
  }

  const handleShare = () => {
    if (!user) {
      toast({ title: "Debes iniciar sesión", description: "Inicia sesión para compartir y participar del gran equipo del norte.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    // Simulate sharing
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "¡Gracias por alentar!",
        description: "Has compartido la campaña con éxito. ⚽",
        className: "bg-success text-success-foreground"
      })

      // Open WhatsApp sharing link
      const text = encodeURIComponent("¡Únete a 'Métele un Gol al Cáncer'! Registra tu examen preventivo y suma tu apoyo al equipo local. ⚽🏆")
      window.open(`https://wa.me/?text=${text}`, '_blank')
    }, 1500)
  }

  const handleLogout = () => {
    setUser(null)
    setFormData({ nombre: '', rut: '', edad: '', telefono: '', email: '', comuna: '', esJugador: false, equipo: '', club: '', esSocioCDI: false, aceptaTerminos: false })
    toast({ title: '👋 Sesión cerrada', description: 'Has cerrado sesión correctamente.' })
  }

  const handleSchedule = (operativo: Operativo) => {
    if (!user) {
      toast({ title: '⚠️ Inicia sesión primero', description: 'Debes estar registrado para agendar un examen.', variant: 'destructive' })
      setShowLogin(true)
      return
    }
    setSelectedOperativo(operativo)
    setShowOperativoDetail(true)
  }

  const confirmSchedule = async () => {
    if (!selectedOperativo || !user) return
    setIsLoading(true)
    
    const result = await joinOperativo(user.id, selectedOperativo.id.toString())
    
    if (result.success) {
      const currentBadges = Array.isArray(user.badges) ? user.badges : []
      const hasNewBadge = !currentBadges.includes('gol-anotado')
      setUser(result.user as any)
      setShowOperativoDetail(false)
      if (hasNewBadge) {
        setTimeout(() => fireConfetti({ x: 0.5, y: 0.4 }), 400)
      }
      toast({ title: '⚽ ¡Examen agendado!', description: `Tu examen está programado para el ${selectedOperativo.fecha}.` })
      
      // Recargar operativos para actualizar cupos
      const ops = await getOperativos()
      if (ops.success) setLiveOperativos(ops.operativos)
    } else {
      toast({ title: '❌ Error', description: result.error, variant: 'destructive' })
    }
    setIsLoading(false)
  }

  const handleRateSong = async (songId: string, stars: number) => {
    if (!user) {
      toast({ title: '⚠️ Regístrate primero', description: 'Debes ser parte del equipo para valorar la música.', variant: 'destructive' })
      return
    }

    const result = await rateSong(user.id, songId, stars)
    if (result.success) {
      toast({ title: '⭐ ¡Valoración guardada!', description: 'Gracias por opinar sobre nuestra banda sonora.' })
      
      // Update local user ratings
      const updatedRatings = [...(user.ratings || [])]
      const index = updatedRatings.findIndex(r => r.songId === songId)
      if (index >= 0) updatedRatings[index].stars = stars
      else updatedRatings.push({ songId, stars })
      
      setUser({ ...user, ratings: updatedRatings })

      // Refresh playlist for global averages
      const songsData = await getPlaylist()
      if (songsData.success) setLivePlaylist(songsData.songs)
    }
  }

  const progressPercent = (examCount / 800) * 100

  if (!isAuthorized && process.env.NODE_ENV !== 'development') {
    return <PreSeasonGate onBypass={handleAuthorize} />
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden">

        {/* Background con imagen de fútbol */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <Image
            src="/images/crack_oyarzo.png"
            alt="Background"
            fill
            className="object-cover opacity-15"
            priority
          />
        </div>

        {/* Header con logos SESP e Impacta - Simétricos sin fondo */}
        <header className="sticky top-0 z-50 glass border-b border-border">
          <div className="flex items-center justify-between px-2 sm:px-4 py-3 w-full gap-2">
            {/* Logos SESP e Impacta en esquina superior izquierda */}
            {/* Logos SESP e Impacta - Más grandes para +40 y sin fondo blanco */}
            {/* Logo único o simplificado en Header si se desea, o dejar vacío si están en el Hero */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Espacio reservado para alineación o logos futuros */}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink">
              {user ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Badge variant="outline" className="hidden sm:flex bg-primary/10 text-primary border-primary/20 whitespace-nowrap mr-2">
                    <Target className="w-3 h-3 mr-1" />
                    Jugador Activo
                  </Badge>
                  <Button 
                    onClick={() => {
                      setUser(null);
                      localStorage.removeItem('mugz_user');
                      toast({ title: 'Cierre Exitoso', description: 'Has vuelto a la banca.' });
                    }}
                    size="sm" 
                    className="bg-destructive/20 hover:bg-destructive text-white font-bold px-4 backdrop-blur-sm border border-destructive/50 transition-all duration-300"
                  >
                    SALIR
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button 
                      onClick={() => setShowLogin(true)}
                      size="sm" 
                      className="bg-primary hover:bg-primary/80 text-black font-black px-4 shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300 transform active:scale-95"
                    >
                      🔐 INGRESO VAR
                    </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-20 overflow-y-auto relative z-10">

          {/* ===== HOME TAB ===== */}
          {activeTab === 'home' && (
            <div className="px-4 py-6 space-y-8">
              {/* Hero Section */}
              <HeroSection 
                user={user} 
                onShowRegistration={() => setShowRegistration(true)} 
                onShowLogin={() => setShowLogin(true)} 
                onSetActiveTab={setActiveTab}
              />

              {/* Progress Counter - Marcador de Estadio */}
              <StatsCounter displayCount={displayCount} progressPercent={progressPercent} />

              {/* Vitrina de Premios y Sorteo */}
              <PrizeVitrine />

              {/* Ranking de Canciones (HIT LIST) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                    <Music className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]" /> Vota por el mejor tema de la campaña
                  </h3>
                  <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-black uppercase italic">Top 5</Badge>
                </div>

                <Card className="bg-card/40 border-border overflow-hidden relative border-none backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {[...livePlaylist]
                        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
                        .slice(0, 5)
                        .map((song, i) => (
                          <div key={song.id} className="p-4 flex items-center gap-4 group hover:bg-white/5 transition-all">
                            <div className="w-6 text-center font-black italic text-primary/40 text-lg">{i + 1}</div>
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-lg">
                              {song.coverUrl ? (
                                <Image src={song.coverUrl} alt={song.title} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                  <Music className="w-4 h-4 text-primary/40" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-xs text-white uppercase italic tracking-tight truncate mb-1">
                                {song.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star 
                                      key={s} 
                                      size={10} 
                                      className={s <= Math.round(song.averageRating) ? 'fill-warning text-warning' : 'text-muted-foreground/20'} 
                                    />
                                  ))}
                                </div>
                                <span className="text-[9px] font-black text-primary/60 uppercase tracking-tighter">
                                  {(song.averageRating || 0).toFixed(1)} Pts
                                </span>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-black uppercase italic text-primary" onClick={() => setActiveTab('perfil')}>
                                VOTAR
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-card/90 border-border text-center overflow-hidden">
                  <CardContent className="py-4 px-1">
                    <div className="text-2xl sm:text-3xl font-black text-primary italic">90%</div>
                    <div className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">Supervivencia</div>
                    <div className="text-[9px] text-success font-black uppercase tracking-tighter">⚽ Detección</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/90 border-border text-center overflow-hidden">
                  <CardContent className="py-4 px-1">
                    <div className="text-2xl sm:text-3xl font-black text-success italic">15K</div>
                    <div className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">Objetivo</div>
                    <div className="text-[9px] text-success font-black uppercase tracking-tighter">👕 Región</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/90 border-border text-center overflow-hidden">
                  <CardContent className="py-4 px-1">
                    <div className="text-2xl sm:text-3xl font-black text-warning italic">5</div>
                    <div className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">Ligas</div>
                    <div className="text-[9px] text-warning font-black uppercase tracking-tighter">🏆 Activas</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Info */}
              <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                      <Image src="/images/crack_oyarzo.png" alt="Info" width={40} height={40} className="object-cover rounded-full" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase italic">¿Sabías que?</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-tight">
                        El examen PSA es un simple análisis de sangre que toma <span className="text-primary font-bold">menos de 5 minutos</span>
                        y puede salvar tu vida. ¡No duele y es <span className="text-success font-bold">totalmente gratis</span>!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Operativo - Usar el nuevo OperativoCard */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black italic text-white uppercase italic">🏟️ Próximo operativo</h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('operativos')} className="text-xs font-bold uppercase text-primary">
                    Ver más <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                {liveOperativos.length > 0 && (
                  <OperativoCard operativo={liveOperativos[0]} onSchedule={handleSchedule} />
                )}
              </div>

              {/* Leaderboard - Solo Clubes */}
              <LeaderboardClubes clubLeaderboard={liveLeaderboard.map((c) => ({ id: c.id, nombre: c.nombre, miembros: c.miembros, logo: c.logo || '/images/amateur.png' }))} />

              {/* Auspiciadores - Componente Refinado */}
              <AuspiciadoresGrid />

            </div>
          )}

          {/* ===== TAB OPERATIVOS (PRIMER TIEMPO) ===== */}
          {activeTab === 'operativos' && (
            <div className="px-4 py-6 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black italic text-white uppercase italic">Primer Tiempo</h1>
                <p className="text-primary text-sm font-bold uppercase tracking-widest">¡Salta a la cancha y agenda tu examen!</p>
              </div>

              {!user && (
                <Alert className="border-primary/30 bg-primary/5 py-6">
                  <UserPlus className="h-6 w-6 text-primary" />
                  <div className="flex flex-col gap-2">
                    <AlertTitle className="text-primary text-xl font-black uppercase italic">¡Ficha por tu equipo!</AlertTitle>
                    <AlertDescription>
                      Para agendar tu examen y participar en los sorteos, primero debes{' '}
                      <Button variant="link" className="p-0 h-auto text-primary font-black uppercase underline" onClick={() => setShowRegistration(true)}>Fichar ahora</Button>
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <div className="space-y-4">
                {liveOperativos.length > 0 ? (
                  liveOperativos.map((operativo) => (
                    <OperativoCard 
                      key={operativo.id} 
                      operativo={operativo} 
                      onSchedule={handleSchedule} 
                    />
                  ))
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-muted-foreground font-bold uppercase italic">No hay operativos programados para hoy</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== TAB INFORMACIÓN (SEGUNDO TIEMPO) ===== */}
          {activeTab === 'resultados' && (
            <InfoSalud />
          )}

          {/* ===== GALERÍA TAB ===== */}
          {activeTab === 'galeria' && (
            <Galeria items={galeriaMock} onOpenItem={(item) => { setSelectedGaleriaItem(item); setShowGaleriaLightbox(true) }} />
          )}

          {/* ===== PERFIL TAB ===== */}
          {activeTab === 'perfil' && (
            <PerfilUsuario 
              user={user} 
              allBadges={badges} 
              onShowRegistration={() => setShowRegistration(true)} 
              onShowLogin={() => setShowLogin(true)} 
              onShowQR={() => setShowQR(true)} 
              onShare={handleShare} 
              onLogout={handleLogout} 
              isLoading={isLoading} 
              songs={livePlaylist}
              onRateSong={handleRateSong}
            />
          )}

          {/* ===== MÁS TAB ===== */}
          {activeTab === 'mas' && (
            <div className="px-4 py-6 space-y-6">
              <h1 className="text-2xl font-bold">Más opciones</h1>

              <div className="space-y-3">
                {[{ icon: HelpCircle, text: 'Centro de ayuda' }, { icon: Phone, text: 'Contacto SEREMI de Salud' }, { icon: Settings, text: 'Configuración' }].map((item, i) => (
                  <Card key={i} className="bg-card/90 border-border cursor-pointer hover:border-primary/50 transition-colors">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-primary" />
                        <span className="flex-1 font-medium">{item.text}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">🏆 Organizadores y Auspiciadores</h3>
                <div className="grid grid-cols-3 gap-3">
                  {auspiciadores.map((a, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className="w-14 h-14 rounded-xl bg-white/5 border border-border p-2 overflow-hidden">
                        <Image src={a.logo} alt={a.nombre} width={48} height={48} className="object-contain w-full h-full" />
                      </div>
                      <span className="text-xs text-muted-foreground text-center">{a.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="text-center space-y-2">
                <p className="font-semibold gradient-text">⚽ Métele un Gol al Cáncer</p>
                <p className="text-xs text-muted-foreground">Versión 2.0.0 • © 2026 • Región de Tarapacá, Chile 🇨🇱</p>
              </div>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border safe-area-bottom z-50">
          <div className="flex justify-around py-3 px-2">
            {[
              { id: 'home', icon: Home, label: 'Cancha' },
              { id: 'operativos', icon: Target, label: '1er Tiempo' },
              { id: 'resultados', icon: Trophy, label: '2do Tiempo' },
              { id: 'galeria', icon: Camera, label: 'Galería' },
              { id: 'perfil', icon: CircleUser, label: 'Mi Ficha' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex flex-col items-center justify-center px-1 transition-all min-w-[64px] ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`}>
                <tab.icon className={`h-6 w-6 mb-1 ${activeTab === tab.id ? 'animate-bounce-subtle' : ''}`} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* ========== DIALOGS ========== */}

        {/* Registration Dialog */}
        <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
          <DialogContent className="max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>⚽ FICHAR POR TU EQUIPO</DialogTitle>
              <DialogDescription>¡Súmate a la formación inicial de "Métele un Gol al Cáncer"!</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre del Crack *</Label>
                <Input placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="bg-input border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>RUT (Tu llave al sorteo) *</Label>
                  <Input placeholder="12.345.678-9" value={formData.rut} onChange={(e) => setFormData({ ...formData, rut: e.target.value })} className="bg-input border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Edad *</Label>
                  <Input type="number" placeholder="45" value={formData.edad} onChange={(e) => setFormData({ ...formData, edad: e.target.value })} className="bg-input border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Teléfono Celular *</Label>
                <Input placeholder="+56 9 1234 5678" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Correo Electrónico *</Label>
                <Input type="email" placeholder="crack@ejemplo.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Comuna de Residencia *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, comuna: value })}>
                  <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Selecciona tu comuna" /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="Iquique">Iquique</SelectItem>
                    <SelectItem value="Alto Hospicio">Alto Hospicio</SelectItem>
                    <SelectItem value="Pozo Almonte">Pozo Almonte</SelectItem>
                    <SelectItem value="Pica">Pica</SelectItem>
                    <SelectItem value="Huara">Huara</SelectItem>
                    <SelectItem value="Camiña">Camiña</SelectItem>
                    <SelectItem value="Colchane">Colchane</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tu Club / Asociación (Ligas AFSI) *</Label>
                <Input 
                   placeholder="Escribe el nombre de tu club" 
                   value={formData.club} 
                   onChange={(e) => setFormData({ ...formData, club: e.target.value })} 
                   className="bg-input border-border" 
                />
              </div>



              <div className="flex items-center space-x-2 bg-primary/5 p-3 rounded-lg border border-primary/20">
                <Checkbox id="terminos" checked={formData.aceptaTerminos} onCheckedChange={(checked) => setFormData({ ...formData, aceptaTerminos: checked as boolean })} />
                <Label htmlFor="terminos" className="text-xs text-white/80 leading-tight">
                  Acepto que mi participación se valide con mi examen para entrar al sorteo.
                </Label>
              </div>

              <Button onClick={handleRegister} disabled={isLoading} className="w-full bg-primary text-primary-foreground py-8 text-xl font-black shadow-lg">
                {isLoading ? 'FICHANDO...' : '⚽ ¡FICHAR POR MI EQUIPO!'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Login Dialog */}
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="max-w-sm bg-card border-border">
            <DialogHeader>
              <DialogTitle>👤 Acceder a mi cuenta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>RUT</Label>
                <Input placeholder="12.345.678-9" value={loginData.rut} onChange={(e) => setLoginData({ ...loginData, rut: e.target.value })} className="bg-input border-border" />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input placeholder="+56 9 1234 5678" value={loginData.telefono} onChange={(e) => setLoginData({ ...loginData, telefono: e.target.value })} className="bg-input border-border" />
              </div>
              <Button onClick={handleLogin} disabled={isLoading} className="w-full bg-primary text-primary-foreground">
                {isLoading ? 'Verificando...' : 'Acceder'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                ¿No tienes cuenta? <Button variant="link" className="p-0 h-auto text-primary" onClick={() => { setShowLogin(false); setShowRegistration(true); }}>Inscríbete aquí</Button>
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Registration / Digital Card Dialog */}
        <Dialog open={showSuccessRegistration || showQR} onOpenChange={(val) => { setShowSuccessRegistration(val); setShowQR(val); }}>
          <DialogContent className="max-w-sm bg-card border-border text-center p-0 overflow-hidden">
            <div className="bg-primary/20 py-8 px-6 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-20 h-20" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black italic text-white uppercase text-center w-full">
                  {showSuccessRegistration ? '¡FICHAJE COMPLETADO!' : 'MI FICHA DIGITAL'}
                </DialogTitle>
                <DialogDescription className="text-primary font-bold uppercase tracking-widest text-center w-full">
                  {showSuccessRegistration ? 'Bienvenido a la formación inicial' : 'Tu llave para el sorteo'}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="py-8 px-6 space-y-6">
              <div className="bg-muted/30 rounded-2xl p-6 border-2 border-dashed border-primary/30 relative overflow-hidden">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">TU RUT IDENTIFICADOR</p>
                <p className="text-3xl font-black text-white font-mono tracking-tighter">
                  {user?.rut}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-white uppercase italic">{user?.nombre}</p>
                  {user?.club && <p className="text-[10px] text-warning font-black uppercase mt-1">🏆 {user.club}</p>}
                </div>
              </div>

              {showSuccessRegistration && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <Alert className="bg-warning/10 border-warning/30 text-left">
                    <ArrowRight className="h-4 w-4 text-warning" />
                    <AlertDescription className="text-white text-xs font-bold uppercase italic">
                      Siguiente Paso: Agenda tu examen para participar del sorteo.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => { setShowSuccessRegistration(false); setActiveTab('operativos'); }} className="w-full bg-primary text-primary-foreground font-black py-6 text-lg uppercase shadow-xl shadow-primary/20">
                    ⚽ AGENDAR EXAMEN AHORA
                  </Button>
                </div>
              )}

              {!showSuccessRegistration && (
                <div className="space-y-4">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">
                    Preséntate con este RUT en los operativos para validar tu examen.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => setShowQR(false)}>Cerrar</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Operativo Detail Dialog */}
        <Dialog open={showOperativoDetail} onOpenChange={setShowOperativoDetail}>
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle>🏟️ Confirmar Agendamiento</DialogTitle>
            </DialogHeader>
            {selectedOperativo && (
              <div className="py-4 space-y-4">
                <Card className="bg-muted/30 border-border overflow-hidden">
                  <div className="h-32 relative">
                    <Image src={selectedOperativo.imagen} alt="Operativo" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <CardContent className="py-3">
                    <p className="font-bold text-lg">{selectedOperativo.fecha}</p>
                    <p className="text-sm text-muted-foreground">{selectedOperativo.hora}</p>
                    <p className="text-sm text-muted-foreground mt-2">{selectedOperativo.lugar}</p>
                    <p className="text-xs text-muted-foreground">{selectedOperativo.direccion}</p>
                  </CardContent>
                </Card>
                <Alert className="border-primary/30 bg-primary/5">
                  <Bell className="h-4 w-4 text-primary" />
                  <AlertDescription>Recibirás un recordatorio por <strong>WhatsApp</strong> 1 día antes.</AlertDescription>
                </Alert>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowOperativoDetail(false)}>Cancelar</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground" disabled={isLoading} onClick={confirmSchedule}>
                    {isLoading ? 'Agendando...' : '⚽ Confirmar'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

        {/* Galería Lightbox Dialog */}
        <Dialog open={showGaleriaLightbox} onOpenChange={(val) => { setShowGaleriaLightbox(val); if (!val) setSelectedGaleriaItem(null) }}>
          <DialogContent className="max-w-sm bg-card border-border p-0 overflow-hidden">
            {selectedGaleriaItem && (
              <>
                {/* Imagen fullscreen */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={selectedGaleriaItem.imagen}
                    alt={selectedGaleriaItem.titulo}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Badge fecha sobre la imagen */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/60 backdrop-blur-sm text-white border-white/20 font-bold text-[10px]">
                      {selectedGaleriaItem.fecha}
                    </Badge>
                  </div>
                </div>
                {/* Info */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-black text-white text-lg uppercase italic leading-tight tracking-tight">{selectedGaleriaItem.titulo}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedGaleriaItem.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-2 text-sm font-black text-primary">
                      <ThumbsUp className="w-4 h-4" /> {selectedGaleriaItem.likes} me gusta
                    </span>
                    <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <MessageCircle className="w-4 h-4" /> {selectedGaleriaItem.comentarios} comentarios
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-primary/30 font-black uppercase text-xs"
                    onClick={() => setShowGaleriaLightbox(false)}
                  >
                    Cerrar
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

      {/* Magic Filter - Elimina fondo blanco de imágenes por software */}
      <svg width="0" height="0" className="absolute invisible pointer-events-none">
        <filter id="remove-white" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            -1.1 -1.1 -1.1 3.3 0"
          />
        </filter>
      </svg>
    </>
  )
}
