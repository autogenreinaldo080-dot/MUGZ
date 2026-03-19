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
  LogOut, Share2, MessageCircle, ThumbsUp,
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
  { nombre: 'Fundación SESP', logo: '/images/logo_fondo.png', link: '#' },
  { nombre: 'Impacta', logo: '/images/logo_impacta.png', link: '#' },
  { nombre: 'Club Deportes Iquique', logo: '/images/logo_cdi.png', link: '#' },
  { nombre: 'Collahuasi', logo: '/images/logo_collahuasi.png', link: '#' },
  { nombre: 'GORE Tarapacá', logo: '/images/logo_gore.png', link: '#' },
  { nombre: 'AFI', logo: '/images/logo_afi.png', link: '#' },
]

// Helper: Ref-based badge item component to avoid inline style warnings
function BadgeItem({ badge, earned }: { badge: any; earned: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = earned ? `${badge.color}20` : 'rgba(255,255,255,0.05)';
      containerRef.current.style.border = `2px solid ${earned ? badge.color : 'transparent'}`;
    }
    if (iconRef.current) {
      // @ts-ignore - style property exists on SVGElement but TS might be picky
      iconRef.current.style.color = earned ? badge.color : 'currentColor';
    }
  }, [earned, badge.color]);

  return (
    <Card className={`bg-card/90 border-2 transition-all duration-500 overflow-hidden relative group ${earned ? 'border-success/30 shadow-success/5' : 'border-white/5 opacity-40 grayscale'}`}>
      {earned && <div className="absolute inset-0 bg-gradient-to-b from-success/5 to-transparent pointer-events-none" />}
      <CardContent className="py-4 relative z-10">
        <div className="flex flex-col items-center text-center gap-2">
          <div ref={containerRef} className="w-14 h-14 rounded-full flex items-center justify-center relative">
            <badge.icon ref={iconRef} className={`h-7 w-7 ${earned ? 'animate-pulse-slow' : ''}`} />
            {earned && <div className="absolute -top-1 -right-1 bg-success rounded-full p-1"><Check className="w-2 h-2 text-white" /></div>}
          </div>
          <div>
            <p className="font-black text-[11px] text-white uppercase leading-tight">{badge.name}</p>
            <p className="text-[9px] text-muted-foreground mt-1 leading-tight font-medium">{badge.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ========== COMPONENTE PRINCIPAL ==========
export default function MeteleGolApp() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSuccessRegistration, setShowSuccessRegistration] = useState(false) // Nuevo
  const [showQR, setShowQR] = useState(false)
  const [examCount, setExamCount] = useState(347)
  const [displayCount, setDisplayCount] = useState(0)
  const [user, setUser] = useState<UserData | null>(null)
  const [rankingType, setRankingType] = useState<'jugador' | 'club'>('jugador')
  const leaderboard = [
    { rank: 1, team: 'Deportivo Cavancha', exams: 12, logo: '/images/logo_cdi.png' },
    { rank: 2, team: 'Unión Morro', exams: 10, logo: '/images/logo_cdi.png' },
    { rank: 3, team: 'Estrella de Chile', exams: 8, logo: '/images/logo_cdi.png' },
    { rank: 4, team: 'Iquique Wanderers', exams: 6, logo: '/images/logo_cdi.png' },
    { rank: 5, team: 'Liga Pozo Al Monte', exams: 4, logo: '/images/logo_cdi.png' },
  ]
  const clubLeaderboard = [
    { id: 2, name: 'Deportivo Cavancha', exams: 12 },
    { id: 3, name: 'Unión Morro', exams: 8 },
    { id: 4, name: 'Estrella de Chile', exams: 6 },
  ]
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<{
    nombre: string, rut: string, edad: string, telefono: string, email: string, comuna: string,
    esJugador: boolean, equipo: string, club: string, otroClub?: string, esSocioCDI: boolean, aceptaTerminos: boolean
  }>({
    nombre: '', rut: '', edad: '', telefono: '', email: '', comuna: '',
    esJugador: false, equipo: '', club: '', otroClub: '', esSocioCDI: false, aceptaTerminos: false
  })
  const [loginData, setLoginData] = useState({ rut: '', telefono: '' })
  const [selectedOperativo, setSelectedOperativo] = useState<Operativo | null>(null)
  const [showOperativoDetail, setShowOperativoDetail] = useState(false)
  const [selectedGaleriaItem, setSelectedGaleriaItem] = useState<GaleriaItem | null>(null)
  const [showGaleriaLightbox, setShowGaleriaLightbox] = useState(false)

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
    await new Promise(resolve => setTimeout(resolve, 1500))
    const finalClub = formData.club === 'otro' ? formData.otroClub : formData.club
    const newUser: UserData = {
      id: `MG-${Date.now()}`,
      nombre: formData.nombre,
      rut: formData.rut,
      edad: parseInt(formData.edad),
      telefono: formData.telefono,
      email: formData.email,
      comuna: formData.comuna,
      esJugador: formData.esJugador,
      equipo: formData.equipo,
      club: finalClub || 'Sin club',
      esSocioCDI: formData.esSocioCDI,
      inscrito: true,
      examenRealizado: false,
      examenFecha: null,
      examenValidado: false,
      badges: ['primer-tiempo'],
      fechaRegistro: new Date().toISOString()
    }
    setUser(newUser)
    setShowRegistration(false)
    setShowSuccessRegistration(true)
    setIsLoading(false)
    // 🎉 Confetti de bienvenida al fichaje
    setTimeout(() => fireConfetti(), 300)
    toast({ title: '⚽ ¡Fichaje exitoso!', description: '¡Bienvenido al equipo! Ahora solo falta agendar tu examen.' })
  }

  const handleLogin = async () => {
    if (!loginData.rut || !loginData.telefono) {
      toast({ title: '⚠️ Datos incompletos', description: 'Ingresa tu RUT y teléfono.', variant: 'destructive' })
      return
    }
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    const mockUser: UserData = {
      id: 'MG-12345', nombre: 'Usuario Demo', rut: loginData.rut, edad: 45,
      telefono: loginData.telefono, email: 'demo@metelegal.com', comuna: 'Iquique',
      esJugador: true, equipo: 'Liga ANFA Iquique', club: 'Deportivo Cavancha', esSocioCDI: false,
      inscrito: true, examenRealizado: false, examenFecha: null, examenValidado: false,
      badges: ['primer-tiempo', 'capitan'], fechaRegistro: '2026-01-15'
    }
    setUser(mockUser)
    setShowLogin(false)
    setIsLoading(false)
    toast({ title: '⚽ ¡Bienvenido de vuelta!', description: `Hola ${mockUser.nombre}, ya estás en la lista.` })
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    const hasNewBadge = !user.badges.includes('gol-anotado')
    setUser(prev => prev ? { ...prev, examenRealizado: true, examenFecha: selectedOperativo.fecha, badges: prev.badges.includes('gol-anotado') ? prev.badges : [...prev.badges, 'gol-anotado'] } : null)
    setShowOperativoDetail(false)
    setIsLoading(false)
    if (hasNewBadge) {
      // 🎉 Confetti al ganar el badge "Gol Anotado"
      setTimeout(() => fireConfetti({ x: 0.5, y: 0.4 }), 400)
    }
    toast({ title: '⚽ ¡Examen agendado!', description: `Tu examen está programado para el ${selectedOperativo.fecha}.` })
  }

  const progressPercent = (examCount / 800) * 100

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
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="hidden xs:flex bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
                    <Target className="w-3 h-3 mr-1" />
                    Listo para participar
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <a href="/admin/login">
                    <Button size="sm" className="bg-primary/20 hover:bg-primary/30 border border-primary/50 text-white font-bold px-4 backdrop-blur-sm shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-all duration-300">
                      🔐 INGRESO VAR
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-20 overflow-y-auto relative z-10">

          {/* ===== HOME TAB ===== */}
          {activeTab === 'home' && (
            <div className="px-4 py-6 space-y-6">

              {/* Hero Section - Mensaje Directo y Potente */}
              <div className="text-center space-y-6 pt-8">
                {/* Logos Hero - A color completo, visibles en mobile */}
                <div className="flex justify-center items-center gap-12 sm:gap-16 mb-8 p-4 rounded-2xl bg-black/10 md:bg-transparent border border-white/5 md:border-none backdrop-blur-sm md:backdrop-blur-none">
                  <div className="relative w-[120px] h-[80px] sm:w-[150px] sm:h-[100px] transition-all duration-300 hover:scale-125 active:scale-125 group cursor-pointer">
                    <Image
                      src="/images/logo_sesp_clean_hd.png"
                      alt="Fundación SESP"
                      fill
                      className="object-contain opacity-85 hover:opacity-100 active:opacity-100 transition-all duration-300 drop-shadow-[0_0_24px_rgba(0,212,255,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(0,212,255,0.85)] group-active:drop-shadow-[0_0_40px_rgba(0,212,255,0.85)]"
                    />
                    {/* Ring glow al hover/touch */}
                    <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/60 group-active:ring-primary/60 transition-all duration-300 blur-[1px]" />
                  </div>
                  <div className="relative w-[120px] h-[80px] sm:w-[150px] sm:h-[100px] transition-all duration-300 hover:scale-125 active:scale-125 group cursor-pointer">
                    <Image
                      src="/images/logo_impacta_clean_hd.png"
                      alt="Consultora Impacta"
                      fill
                      className="object-contain opacity-85 hover:opacity-100 active:opacity-100 transition-all duration-300 drop-shadow-[0_0_24px_rgba(0,212,255,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(0,212,255,0.85)] group-active:drop-shadow-[0_0_40px_rgba(0,212,255,0.85)]"
                    />
                    <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/60 group-active:ring-primary/60 transition-all duration-300 blur-[1px]" />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <p className="text-[17px] sm:text-lg font-black text-primary uppercase tracking-[0.5em] mb-1 opacity-90">Campaña 2026</p>
                  <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
                </div>

                <h1 className="text-4xl sm:text-6xl font-black mt-2 tracking-tighter leading-tight drop-shadow-2xl">
                  <span className="gradient-text">MÉTELE UN GOL</span>
                  <br />
                  <span className="text-white">AL CÁNCER</span>
                </h1>

                <p className="text-white/95 text-xl sm:text-2xl max-w-lg mx-auto font-black uppercase italic leading-tight">
                  "Hazte el test de antígeno PSA y queda listo para el 2do tiempo"
                </p>

                {!user ? (
                  <div className="flex flex-col gap-3 justify-center mt-6 px-4">
                    <Button onClick={() => setShowRegistration(true)} className="bg-primary text-primary-foreground text-xl px-8 py-8 rounded-2xl animate-pulse-glow font-black shadow-xl shadow-primary/20 uppercase">
                      ⚽ ¡SALTAR A LA CANCHA!
                    </Button>
                    <Button variant="ghost" onClick={() => setShowLogin(true)} className="text-white text-lg font-bold">
                      Ya soy del equipo
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 justify-center mt-6 px-4">
                    <Button onClick={() => setActiveTab('operativos')} className="bg-primary text-primary-foreground text-lg py-6 rounded-xl font-black uppercase">
                      <Target className="mr-2 h-5 w-5" /> Saltar a jugar el 1er tiempo
                    </Button>
                    <p className="text-xs text-white/70 italic uppercase font-bold">Agenda tu examen preventivo ahora</p>
                  </div>
                )}
              </div>

              {/* Progress Counter - Marcador de Estadio */}
              <Card className="bg-card/90 backdrop-blur border-border overflow-hidden shadow-2xl">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-end mb-4">
                    <div className="space-y-1">
                      <p className="text-xs uppercase font-black text-primary tracking-widest">MARCADOR CAMPAMENTO</p>
                      <h3 className="text-3xl font-black text-white italic">HINCHAS FICHADOS</h3>
                    </div>
                    <div className="text-right">
                       <p className="text-4xl font-black text-primary leading-none">{displayCount}</p>
                      <p className="text-xs font-bold text-muted-foreground">DE 800 META</p>
                    </div>
                  </div>
                  <Progress value={progressPercent} className="h-6 bg-muted/50 rounded-full border-2 border-border" />
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                      <Target className="w-3 h-3" /> TODO IQUIQUE EN LA CANCHA
                    </p>
                    <p className="text-sm text-success font-black italic">{Math.round(progressPercent)}% DEL PARTIDO</p>
                  </div>
                </CardContent>
              </Card>

              {/* Vitrina de Premios y Sorteo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black italic text-white uppercase italic">🎁 Vitrina de Premios</h2>
                  <Badge className="bg-warning text-warning-foreground font-black animate-pulse">23 PREMIOS TOTAL</Badge>
                </div>

                {/* Info Sorteo */}
                <Card className="bg-gradient-to-br from-warning/20 to-primary/10 border-2 border-warning/50 shadow-lg shadow-warning/10 overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-warning/20 p-2 rounded-lg">
                        <Trophy className="h-8 w-8 text-warning" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-warning tracking-widest leading-none mb-1">FECHA DEL SORTEO</p>
                        <p className="text-xl font-black text-white leading-none">04/07/2026</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-warning tracking-widest leading-none mb-1">HORA</p>
                      <p className="text-xl font-black text-white leading-none">12:00 HRS</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Grid Premios Actualizada */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { image: "/images/camiseta_cdi.png", title: 'Camiseta CDI Oficial', desc: 'Autografiada por el plantel', qty: '5x', gradient: null },
                    { image: "/images/balon_molten.png", title: 'Balón firmado CDI', desc: 'Balón Molten Vantaggio', qty: '5x', gradient: null, objectPosition: 'center 30%', objectScale: true },
                    { image: "/images/indumentaria_personal.png", title: 'Indumentaria Deportiva Personal', desc: 'Camiseta, pantalón corto, medias, zapatos', qty: '5x', gradient: null },
                    { image: "/images/indumentaria_equipo.png", title: 'Indumentaria Equipos', desc: 'Para 15 personas: Camiseta, pantalón corto, medias. Incluye guantes y camiseta mangas largas.', qty: '5x', gradient: null },
                    { image: null, icon: <Ticket className="w-10 h-10 text-warning drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]" />, title: 'Andes Numerada', desc: 'Acceso total al estadio · 1 temporada completa', qty: '1x', gradient: 'from-yellow-900/80 via-warning/20 to-orange-900/60', emoji: '🎟️' },
                    { image: null, icon: <Star className="w-10 h-10 text-warning drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]" />, title: 'Andes Accionista', desc: 'Beneficios exclusivos de socio · 1 año completo', qty: '1x', gradient: 'from-amber-900/80 via-yellow-700/30 to-warning/20', emoji: '⭐' },
                    { image: null, icon: <Crown className="w-10 h-10 text-warning drop-shadow-[0_0_16px_rgba(234,179,8,0.7)]" />, title: 'Pacífico VIP', desc: 'Sector premium frente al mar · 1 temporada', qty: '1x', gradient: 'from-blue-900/80 via-primary/30 to-cyan-900/60', emoji: '🌊' },
                  ].map((item, i) => (
                    <Card key={i} className="bg-gradient-to-b from-card to-card/50 border-border overflow-hidden relative group hover:border-warning/30 transition-all shadow-md">
                      <div className="aspect-square relative flex flex-col items-center justify-center bg-white/5 p-4 gap-3">
                        {item.image ? (
                          <div className="absolute inset-0 z-0">
                            <Image src={item.image} alt={item.title} fill className={`object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 blur-[0.3px] group-hover:blur-0 ${'objectScale' in item && item.objectScale ? 'group-hover:scale-110 scale-105' : 'group-hover:scale-110'}`} style={'objectPosition' in item && item.objectPosition ? { objectPosition: item.objectPosition } : {}} />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                          </div>
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-all duration-700 group-hover:opacity-90`} />
                        )}
                        {!item.image && (
                          <>
                            {/* Partículas decorativas de fondo */}
                            <div className="absolute top-3 left-3 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">{item.emoji}</div>
                            <div className="absolute bottom-3 right-3 text-3xl opacity-10 group-hover:opacity-20 transition-opacity rotate-12">{item.emoji}</div>
                            {/* Ícono y texto centrados */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-warning/30 shadow-[0_0_20px_rgba(234,179,8,0.2)] group-hover:scale-110 transition-transform duration-500">
                                {item.icon}
                              </div>
                            </div>
                          </>
                        )}
                        <div className="absolute top-2 right-2 z-20">
                          <Badge className="bg-warning text-warning-foreground font-black shadow-lg border-2 border-warning/20 italic">{item.qty}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-3 text-center border-t border-white/5 relative z-10">
                        <p className="text-[11px] font-black text-white leading-tight uppercase tracking-tighter drop-shadow-md">{item.title}</p>
                        <p className="text-[9px] text-warning/90 mt-1 leading-tight font-bold italic drop-shadow-sm">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-card/90 border-border text-center overflow-hidden">
                  <CardContent className="py-4">
                    <div className="text-3xl font-bold text-primary">90%</div>
                    <div className="text-xs text-muted-foreground mt-1">Supervivencia</div>
                    <div className="text-xs text-success">⚽ detección temprana</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/90 border-border text-center overflow-hidden">
                  <CardContent className="py-4">
                    <div className="text-3xl font-bold text-success">15K</div>
                    <div className="text-xs text-muted-foreground mt-1">Hombres objetivo</div>
                    <div className="text-xs text-success">👕 en la región</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/90 border-border text-center overflow-hidden">
                  <CardContent className="py-4">
                    <div className="text-3xl font-bold text-warning">5</div>
                    <div className="text-xs text-muted-foreground mt-1">Ligas activas</div>
                    <div className="text-xs text-warning">🏆 participando</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Info */}
              <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
                      <Image src="/images/crack_oyarzo.png" alt="Info" width={40} height={40} className="object-cover rounded-full" />
                    </div>
                    <div>
                      <p className="font-medium">¿Sabías que?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        El examen PSA es un simple análisis de sangre que toma <span className="text-primary font-medium">menos de 5 minutos</span>
                        y puede salvar tu vida. ¡No duele y es <span className="text-success font-medium">totalmente gratis</span>!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Operativo */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    🏟️ Próximo operativo
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('operativos')}>
                    Ver calendario <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <Card className="bg-card/90 border-primary/30 cursor-pointer hover:border-primary transition-all overflow-hidden"
                  onClick={() => handleSchedule(operativosMock[0])}>
                  <div className="flex">
                    <div className="w-24 h-24 relative">
                      <Image src={operativosMock[0].imagen} alt="Operativo" fill className="object-cover" />
                    </div>
                    <CardContent className="py-3 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{operativosMock[0].lugar}</p>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {operativosMock[0].fecha} • {operativosMock[0].hora}
                      </p>
                      <Badge className="bg-success/20 text-success border-success/30 mt-2">
                        {operativosMock[0].cuposDisponibles} cupos disponibles
                      </Badge>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* Leaderboard - Solo Clubes */}
              <div className="space-y-4">
                <Card className="bg-card/90 border-border overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-warning/5 pointer-events-none" />
                  <div className="flex flex-col items-center justify-center p-6 text-center border-b border-white/5 bg-gradient-to-b from-primary/5 to-transparent relative z-10">
                    <Trophy className="h-10 w-10 text-warning mb-2 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)] transition-transform group-hover:scale-110 duration-500" />
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Ranking de Clubes</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">¡El club con más hinchas gana indumentaria completa!</p>
                  </div>
                  <CardContent className="py-4 relative z-10">
                    <div className="space-y-2">
                      {clubLeaderboard.map((item, i) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group/item">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs italic ${i === 0 ? 'bg-warning text-warning-foreground shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-muted/30 text-muted-foreground'}`}>
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-white text-sm uppercase italic tracking-tight">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.exams} EXÁMENES REALIZADOS</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-primary/20 px-3 py-1 rounded-lg border border-primary/20 shadow-inner group-hover/item:bg-primary/30 transition-colors">
                              <p className="font-black text-primary text-sm leading-none">{item.exams}</p>
                              <p className="text-[8px] font-black text-warning mt-0.5 whitespace-nowrap uppercase">Hinchas</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Auspiciadores - Integración Fina y Profesional */}
              <div className="space-y-6 text-center pt-8">
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-xl font-black italic text-white uppercase tracking-tight opacity-70">Auspiciadores</h2>
                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 px-6 bg-white/[0.01] py-8 rounded-3xl border border-white/5">
                  {[
                    // GORE: Tiene fondo claro y letras oscuras. invert + mix-blend-screen borra el fondo y vuelve blanco el logo.
                    { src: "/images/logo_gorecolor.png", alt: "GORE Tarapacá", scale: "scale-125", filter: "invert grayscale contrast-[1.2] mix-blend-screen" },
                    { src: "/images/logo_cdi_white.png", alt: "Club Deportes Iquique", scale: "scale-125", filter: "" },
                    { src: "/images/logo_collahuasi_trans_white.png", alt: "Collahuasi", scale: "scale-110", filter: "" },
                    // AFSI: Tiene escudo blanco y fondo blanco/claro. invert + mix-blend-screen dejará el interior negro y el borde blanco. Para evitar que quede feo, 
                    // simplemente usemos la versión real a color si mix blend no funciona bien. Para probar, usamos la versión original con estas clases probadas.
                    { src: "/images/logo_afsi_color.png", alt: "AFSI", scale: "scale-110", filter: "invert grayscale contrast-[1.2] mix-blend-screen" }
                  ].map((sponsor, i) => (
                    <div key={i} className={`relative w-24 h-12 md:w-32 md:h-16 group ${sponsor.scale} transition-all duration-500`}>
                      <Image
                        src={sponsor.src}
                        alt={sponsor.alt}
                        fill
                        className={`object-contain opacity-60 group-hover:opacity-100 transition-all duration-500 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] ${sponsor.filter || ''}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

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
                {operativosMock.map((operativo) => (
                  <Card key={operativo.id} className={`bg-card/90 border-2 border-dashed border-border/50 relative overflow-hidden transition-all group ${operativo.estado === 'completo' ? 'opacity-50 grayscale' : 'hover:border-primary/50 hover:shadow-lg shadow-primary/5'}`}
                    onClick={() => operativo.estado !== 'completo' && handleSchedule(operativo)}>
                    {/* Tick de Estadio - Perforación Visual */}
                    <div className="absolute top-0 bottom-0 left-[25%] border-l-2 border-dashed border-border/30 z-20" />

                    <div className="flex h-32">
                      {/* Lado Fecha (Stub) */}
                      <div className="w-[25%] bg-primary/10 flex flex-col items-center justify-center border-r border-border/20 p-2 text-center">
                        <span className="text-[10px] font-black text-primary uppercase tracking-tighter">FECHA</span>
                        <span className="text-xl font-black text-white leading-none">{operativo.fecha.split(' ')[0]}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{operativo.fecha.split(' ')[1]}</span>
                      </div>

                      {/* Cuerpo de la Entrada */}
                      <div className="flex-1 flex overflow-hidden">
                        <div className="w-24 h-full relative shrink-0">
                          <Image src={operativo.imagen} alt={operativo.lugar} fill className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-r from-card/80 to-transparent" />
                        </div>

                        <CardContent className="py-3 px-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">PARTIDO PREVENTIVO</p>
                            <p className="font-black text-white text-lg leading-tight uppercase italic">{operativo.lugar}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 font-bold">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> {operativo.hora}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> {operativo.direccion}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {operativo.estado === 'completo' ? (
                              <Badge variant="destructive" className="text-[10px] font-black uppercase italic">AGOTADO</Badge>
                            ) : (
                              <Badge className="bg-success text-success-foreground text-[10px] font-black uppercase animate-pulse">
                                {operativo.cuposDisponibles} CUPOS LIBRES
                              </Badge>
                            )}
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ADMIT ONE ⚽</span>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ===== TAB INFORMACIÓN (SEGUNDO TIEMPO) ===== */}
          {activeTab === 'resultados' && (
            <div className="px-4 py-6 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black italic text-white uppercase italic">Segundo Tiempo</h1>
                <p className="text-primary text-sm font-bold uppercase tracking-widest">El equipo te necesita para ganar</p>
              </div>

              {!user && (
                <Alert className="border-primary/30 bg-primary/5 py-6">
                  <Info className="h-6 w-6 text-primary" />
                  <div className="flex flex-col gap-4">
                    <AlertTitle className="text-primary text-xl font-black uppercase italic">Únete a la Previa</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1 bg-primary text-primary-foreground font-black py-6 text-lg uppercase shadow-lg shadow-primary/20" onClick={() => setShowRegistration(true)}>
                        ⚽ ¡Fichar ahora mismo!
                      </Button>
                      <Button variant="outline" className="flex-1 border-primary/50 text-white font-bold py-6 text-lg uppercase" onClick={() => setShowLogin(true)}>
                        Soy del equipo
                      </Button>
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-card/80 h-auto gap-1 p-1">
                  <TabsTrigger value="info" className="text-[10px] uppercase font-bold">Info</TabsTrigger>
                  <TabsTrigger value="psa" className="text-[10px] uppercase font-bold">PSA</TabsTrigger>
                  <TabsTrigger value="riesgo" className="text-[10px] uppercase font-bold">Riesgo</TabsTrigger>
                  <TabsTrigger value="faq" className="text-[10px] uppercase font-bold">FAQ</TabsTrigger>
                  <TabsTrigger value="manual" className="text-[10px] uppercase font-bold">Manual</TabsTrigger>
                  <TabsTrigger value="legal" className="text-[10px] uppercase font-bold">Legal</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  {infoCards.map((card, index) => (
                    <Card key={index} className="bg-card/90 border-2 border-white/5 hover:border-primary/30 transition-all group overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                      <CardContent className="py-5 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                            <card.icon className="h-7 w-7 text-primary drop-shadow-[0_0_5px_rgba(0,186,242,0.3)]" />
                          </div>
                          <div>
                            <p className="font-black text-white uppercase italic tracking-tight mb-1">{card.title}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">{card.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="psa" className="mt-4">
                  <Card className="bg-card/90 border-border overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" /> Marcador de Salud PSA
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        El Antígeno Prostático Específico (PSA) es el "marcador del partido".
                        Detectarlo a tiempo es la clave para ganar el encuentro antes de que avance.
                      </p>

                      {/* Marcador Electrónico PSA */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border-2 border-success/30 relative">
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-success uppercase tracking-widest mb-1">RESULTADO ÓPTIMO</p>
                            <p className="text-sm font-bold text-white">Riesgo Bajo / Detección Normal</p>
                          </div>
                          <div className="bg-black border border-success/50 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                            <span className="text-4xl font-black text-success font-mono italic">{"<"}4.0</span>
                            <p className="text-[8px] text-center font-bold text-success/70">ng/mL</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border-2 border-warning/30 relative">
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-warning uppercase tracking-widest mb-1">REVISIÓN NECESARIA</p>
                            <p className="text-sm font-bold text-white">Consultar con el Director Técnico (Urólogo)</p>
                          </div>
                          <div className="bg-black border border-warning/50 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                            <span className="text-4xl font-black text-warning font-mono italic">{">"}4.0</span>
                            <p className="text-[8px] text-center font-bold text-warning/70">ng/mL</p>
                          </div>
                        </div>
                      </div>

                      <Alert className="border-warning/30 bg-warning/5">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <AlertDescription className="text-xs font-medium">
                          Un PSA elevado <strong>no siempre significa cáncer</strong>. Existen inflamaciones o crecimientos benignos. ¡Pide tu revisión oficial!
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="riesgo" className="mt-4">
                  <Card className="bg-card/90 border-border overflow-hidden">
                    <CardHeader className="bg-warning/10 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-warning" /> Factores de Riesgo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      {[
                        { icon: <Clock className="h-5 w-5 text-warning" />, title: 'Edad de Juego', text: 'Hombres mayores a 40-50 años' },
                        { icon: <Users className="h-5 w-5 text-warning" />, title: 'ADN Futbolero', text: 'Antecedentes familiares directos' },
                        { icon: <Activity className="h-5 w-5 text-warning" />, title: 'Condición Física', text: 'Obesidad y sedentarismo' },
                        { icon: <Target className="h-5 w-5 text-warning" />, title: 'Dieta del Equipo', text: 'Consumo alto de grasas saturadas' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-warning/20 transition-all">
                          <div className="bg-warning/10 p-2 rounded-lg">{item.icon}</div>
                          <div>
                            <p className="text-[10px] font-black text-warning uppercase tracking-widest leading-none mb-1">{item.title}</p>
                            <p className="font-bold text-white text-sm">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faq" className="mt-4 space-y-3">
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 mb-4 flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs font-black text-white uppercase italic tracking-wider">Charla Técnica: Preguntas del Equipo</p>
                  </div>
                  {[
                    { q: '¿El examen duele?', a: '¡Para nada! Es un análisis de sangre rápido. Menos doloroso que un roce en el área.' },
                    { q: '¿Es totalmente gratis?', a: 'Afirmativo. El PSA no tiene costo en nuestros operativos oficiales de campaña.' },
                    { q: '¿Cuándo sale el resultado?', a: 'El VAR de la salud demora entre 3 a 5 días hábiles en darte el veredicto.' },
                    { q: '¿Qué pasa si rindo alto?', a: 'No te preocupes. Te contactamos para agendar con un especialista (el DT médico).' },
                  ].map((item, index) => (
                    <Card key={index} className="bg-card/90 border-border hover:border-primary/20 transition-all cursor-help group">
                      <CardContent className="py-4">
                        <div className="flex gap-3">
                          <HelpCircle className="h-5 w-5 text-warning shrink-0 group-hover:rotate-12 transition-transform" />
                          <div>
                            <p className="font-black text-white text-sm uppercase leading-tight mb-2 tracking-tight">{item.q}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="manual" className="mt-4">
                  <Card className="bg-card/90 border-border overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" /> Manual de Usuario
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-4 text-sm">
                        <div className="flex gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg h-fit text-primary font-black italic text-xs">01</div>
                          <div>
                            <p className="font-black text-white uppercase italic">Fichaje (Registro)</p>
                            <p className="text-muted-foreground text-xs">Completa tu ficha técnica para saltar a la cancha y participar en sorteos.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg h-fit text-primary font-black italic text-xs">02</div>
                          <div>
                            <p className="font-black text-white uppercase italic">Agendamiento</p>
                            <p className="text-muted-foreground text-xs">Selecciona un operativo en "1er Tiempo" y asegura tu titularidad.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg h-fit text-primary font-black italic text-xs">03</div>
                          <div>
                            <p className="font-black text-white uppercase italic">Premios</p>
                            <p className="text-muted-foreground text-xs">Cada examen validado por el VAR médico te da acceso al sorteo final.</p>
                          </div>
                        </div>
                      </div>
                      <Separator className="bg-border/50" />
                      <Button variant="outline" className="w-full border-primary/30 group" asChild>
                        <a href="#" className="flex items-center justify-center gap-2">
                          <Download className="h-4 w-4 group-hover:animate-bounce" /> Descargar Manual Completo (PDF)
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="legal" className="mt-4">
                  <Card className="bg-card/90 border-border overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-border/50">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Scale className="h-5 w-5 text-secondary" /> Propiedad y Uso
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4 text-xs leading-relaxed text-muted-foreground">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Propiedad Intelectual</p>
                        <p>MUG Z (Métele un Gol al Cáncer) y sus contenidos son propiedad exclusiva de la <strong>Fundación SESP</strong> e <strong>Impacta</strong>.</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Uso de la Aplicación</p>
                        <p>Uso gratuito para fines de prevención de salud regional. Prohibida su reproducción comercial total o parcial.</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <p className="font-bold text-white mb-2 uppercase tracking-widest text-[10px]">Responsabilidad Técnica</p>
                        <p>La app es una herramienta de gestión. Los resultados clínicos son responsabilidad de las entidades de salud facultadas.</p>
                      </div>
                      <p className="text-center italic mt-4 opacity-50">© 2026 Fundación SESP / Impacta. Todos los derechos reservados.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ===== GALERÍA TAB ===== */}
          {activeTab === 'galeria' && (
            <div className="px-4 py-6 space-y-6">
              {/* Encabezado estilo consistente con el resto de la app */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-primary/50 rounded-full" />
                  <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Campaña 2026</p>
                  <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-primary/50 rounded-full" />
                </div>
                <h1 className="text-3xl font-black italic text-white uppercase tracking-tight">📸 Galería</h1>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-primary text-sm font-bold uppercase tracking-widest">Los mejores momentos</p>
                  <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px]">{galeriaMock.length} FOTOS</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {galeriaMock.map((item, idx) => (
                  <Card
                    key={item.id}
                    className="bg-card/90 border-border overflow-hidden group cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                    onClick={() => { setSelectedGaleriaItem(item); setShowGaleriaLightbox(true) }}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image src={item.imagen} alt={item.titulo} fill className="object-cover group-hover:scale-108 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      {/* Badge NUEVA en las últimas 2 fotos */}
                      {idx >= galeriaMock.length - 2 && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-success text-success-foreground font-black text-[9px] uppercase animate-pulse shadow-md">🆕 NUEVA</Badge>
                        </div>
                      )}
                      {/* Ícono expand al hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                          <ExternalLink className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="font-black text-sm text-white uppercase italic leading-tight tracking-tight">{item.titulo}</p>
                        <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                          <span className="flex items-center gap-1 font-bold"><ThumbsUp className="w-3 h-3 text-primary" />{item.likes}</span>
                          <span className="flex items-center gap-1 font-bold"><MessageCircle className="w-3 h-3 text-primary" />{item.comentarios}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
                <CardContent className="py-4 text-center">
                  <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-black text-white uppercase italic text-sm">¿Tienes fotos de la campaña?</p>
                  <p className="text-xs text-muted-foreground mb-3">Comparte tus momentos con la comunidad</p>
                  <Button variant="outline" className="border-primary/50 font-black uppercase text-xs">
                    <Share2 className="w-4 h-4 mr-2" />
                    Subir contenido
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== PERFIL TAB ===== */}
          {activeTab === 'perfil' && (
            <div className="px-4 py-6 space-y-6">
              {!user ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-primary/10 mb-4">
                    <Image src="/images/camiseta_cdi.png" alt="Perfil" width={96} height={96} className="object-cover" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No has iniciado sesión</h2>
                  <p className="text-muted-foreground mb-6">Inscríbete o accede a tu cuenta para ver tu perfil</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="bg-primary text-primary-foreground text-lg py-6 px-8 rounded-xl font-black shadow-lg shadow-primary/20 uppercase" onClick={() => setShowRegistration(true)}>
                      <UserPlus className="w-5 h-5 mr-3" /> Fichar
                    </Button>
                    <Button variant="outline" onClick={() => setShowLogin(true)}>
                      <LogOut className="w-4 h-4 mr-2" /> Soy del equipo
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* User Info Card */}
                  <Card className="bg-card/90 border-border overflow-hidden">
                    <div className="h-20 relative overflow-hidden">
                      <Image src="/images/camiseta_cdi.png" alt="Banner" fill className="object-cover opacity-30" />
                    </div>
                    <CardContent className="pt-12 pb-4 relative">
                      <div className="absolute -top-10 left-4">
                        {/* Avatar dinámico con iniciales del usuario */}
                        <div className="w-20 h-20 rounded-2xl border-4 border-background bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center shadow-lg shadow-primary/20">
                          <span className="text-2xl font-black text-white uppercase tracking-tight">
                            {user.nombre.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">{user.nombre}</h2>
                          <p className="text-muted-foreground text-sm">{user.comuna}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {user.club && (
                              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 font-black uppercase text-[10px]">
                                🏆 {user.club}
                              </Badge>
                            )}
                            {user.esJugador && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px]">
                                ⚽ {user.equipo || 'Liga Amateur'}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setShowQR(true)}>
                          <QrCode className="h-5 w-5 text-primary" />
                        </Button>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div>
                          <p className="text-muted-foreground text-xs">RUT</p>
                          <p className="font-medium">{user.rut}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Edad</p>
                          <p className="font-medium">{user.edad} años</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estado de Participación */}
                  <Card className="relative overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/5 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-success/5 pointer-events-none" />
                    <CardContent className="py-6 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">ESTADO DEL JUGADOR</p>
                            <h3 className="text-2xl font-black text-white italic shadow-primary/10">LISTO PARA EL SORTEO</h3>
                          </div>
                          <div className="bg-primary/20 p-3 rounded-2xl rotate-12 group-hover:rotate-0 transition-all duration-500">
                            <Check className="h-8 w-8 text-primary shadow-glow" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-xs font-bold text-white/90 uppercase">1. FICHADO (INSCRIPCIÓN ÉXITOSA)</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-xs font-bold text-white/90 uppercase">2. PARTIDO JUGADO (TEST PSA REALIZADO)</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-xs font-bold text-warning uppercase">3. CONFIRMADO (PARTICIPA EN SORTEO 04/07)</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Badges / Vitrina de Trofeos */}
                  <div>
                    <h3 className="text-lg font-black italic text-white uppercase mb-3 flex items-center gap-2">
                      <Crown className="w-5 h-5 text-warning" /> Vitrina de Trofeos
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {badges.map((badge) => (
                        <BadgeItem key={badge.id} badge={badge} earned={user.badges.includes(badge.id)} />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setShowQR(true)}>
                      <User className="mr-3 h-4 w-4 text-primary" /> Mi Ficha Digital
                    </Button>

                    {/* Share & Earn Section */}
                    <Card className="bg-gradient-to-br from-primary/20 to-card border-primary/30 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <Share2 className="w-16 h-16" />
                      </div>
                      <CardContent className="p-5 relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-primary/20 p-2 rounded-xl">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-black text-white uppercase tracking-tight italic">Arma tu propio equipo</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight leading-tight">Envía este enlace a tus amigos de la liga y aseguren el premio para su club.</p>
                          </div>
                        </div>
                        <Button className="w-full bg-primary text-primary-foreground font-black uppercase italic shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" onClick={handleShare} disabled={isLoading}>
                          <Share2 className="w-5 h-5 mr-2" /> Alienta al Equipo
                        </Button>
                      </CardContent>
                    </Card>

                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-3 h-4 w-4 text-primary" /> Descargar certificado
                    </Button>
                    <Separator />
                    <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                      <LogOut className="mr-3 h-4 w-4" /> Cerrar sesión
                    </Button>
                  </div>
                </>
              )}
            </div>
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
              <DialogTitle>⚽ Ficha por tu equipo</DialogTitle>
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
                <Label>Tu Club / Equipo *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, club: value })}>
                  <SelectTrigger className="bg-input border-border"><SelectValue placeholder="Selecciona tu club" /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="cavancha">Deportivo Cavancha</SelectItem>
                    <SelectItem value="union">Unión Morro</SelectItem>
                    <SelectItem value="estella">Estrella de Chile</SelectItem>
                    <SelectItem value="libre">Agente Libre (Sin club)</SelectItem>
                    <SelectItem value="otro">OTRO (Escribir abajo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.club === 'otro' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                  <Label>Nombre de tu Club *</Label>
                  <Input
                    placeholder="Escribe el nombre de tu equipo"
                    value={formData.otroClub || ''}
                    onChange={(e) => setFormData({ ...formData, otroClub: e.target.value })}
                    className="bg-input border-primary/30 border-2"
                  />
                </div>
              )}

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
                  {showSuccessRegistration ? '¡FICHAJE EXITOSO!' : 'MI FICHA DIGITAL'}
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
