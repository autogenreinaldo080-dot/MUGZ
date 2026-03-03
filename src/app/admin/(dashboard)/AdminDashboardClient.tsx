'use client';

import { useState, useMemo, useRef, useLayoutEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Users, Camera, MapPin, Download, CheckCircle, XCircle, Search, ShieldAlert, Activity, BarChart3 } from 'lucide-react';
import { updateUserStatus, updatePhotoStatus } from '@/app/actions/admin-data';
import { useToast } from "@/hooks/use-toast";

type User = any;
type Photo = any;

interface AdminDashboardClientProps {
    initialUsers: User[];
    initialPhotos: Photo[];
    stats: any;
}

// Helper: Ref-based width component to avoid inline style warnings
function BarEffect({ pct, className }: { pct: number; className: string }) {
    const ref = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.style.width = `${pct}%`;
        }
    }, [pct]);
    return <div ref={ref} className={className} />;
}

// Helper: Progress bar component
function StatBar({ label, value, total, color = 'bg-primary' }: { label: string; value: number; total: number; color?: string }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    const barRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (barRef.current) {
            barRef.current.style.width = `${pct}%`;
        }
    }, [pct]);

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium truncate pr-2">{label}</span>
                <span className="text-muted-foreground shrink-0">{value} <span className="text-xs">({pct}%)</span></span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
                <div ref={barRef} className={`h-full ${color} rounded-full transition-all duration-500`} />
            </div>
        </div>
    );
}

export default function AdminDashboardClient({ initialUsers, initialPhotos, stats }: AdminDashboardClientProps) {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    const [searchQuery, setSearchQuery] = useState('');

    // ============ ESTADÍSTICAS COMPUTADAS ============
    const estadisticas = useMemo(() => {
        if (!users || users.length === 0) return null;
        const total = users.length;

        // Estado
        const enJuego = users.filter(u => u.status === 'EN_JUEGO').length;
        const preCalentamiento = users.filter(u => u.status === 'PRE_CALENTAMIENTO').length;
        const baneados = users.filter(u => u.status === 'BANEADO').length;
        const tasaConversion = total > 0 ? Math.round((enJuego / total) * 100) : 0;

        // Grupos etarios
        const grupos: Record<string, number> = { '40-49': 0, '50-59': 0, '60-69': 0, '70+': 0 };
        let edadTotal = 0;
        users.forEach(u => {
            const edad = parseInt(u.edad) || 0;
            edadTotal += edad;
            if (edad >= 70) grupos['70+']++;
            else if (edad >= 60) grupos['60-69']++;
            else if (edad >= 50) grupos['50-59']++;
            else if (edad >= 40) grupos['40-49']++;
        });
        const edadPromedio = total > 0 ? Math.round(edadTotal / total) : 0;

        // Por Club (top 5)
        const clubCount: Record<string, number> = {};
        users.forEach(u => { if (u.club) clubCount[u.club] = (clubCount[u.club] || 0) + 1; });
        const topClubes = Object.entries(clubCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

        // Por Comuna (top 5)
        const comunaCount: Record<string, number> = {};
        users.forEach(u => { if (u.comuna) comunaCount[u.comuna] = (comunaCount[u.comuna] || 0) + 1; });
        const topComunas = Object.entries(comunaCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

        // Socios CDI
        const sociosCDI = users.filter(u => u.esSocioCDI).length;

        return { total, enJuego, preCalentamiento, baneados, tasaConversion, grupos, edadPromedio, topClubes, topComunas, sociosCDI };
    }, [users]);

    // ============ HANDLERS ============
    const handleStatusChange = async (userId: string, newStatus: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        const result = await updateUserStatus(userId, newStatus);
        if (!result.success) {
            toast({ title: 'Error', description: 'No se pudo actualizar el estado', variant: 'destructive' });
            setUsers(initialUsers);
        } else {
            toast({ title: 'Estado actualizado', description: `Jugador: ${newStatus.replace(/_/g, ' ')}` });
        }
    };

    const handlePhotoAction = async (photoId: string, newStatus: string) => {
        setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, status: newStatus } : p));
        const result = await updatePhotoStatus(photoId, newStatus);
        if (!result.success) {
            toast({ title: 'Error', description: 'No se procesó la foto', variant: 'destructive' });
            setPhotos(initialPhotos);
        } else {
            toast({ title: 'Foto ' + (newStatus === 'APPROVED' ? 'Aprobada ✅' : 'Rechazada ❌') });
        }
    };

    const filteredUsers = users.filter(u =>
        u.rut?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.club?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const downloadExcel = () => {
        const headers = ['RUT,Nombre,Edad,Telefono,Email,Comuna,Club,SocioCDI,Examenes,Estado'];
        const rows = users.map(u =>
            `${u.rut},"${u.nombre}",${u.edad},${u.telefono},${u.email},"${u.comuna || ''}","${u.club || ''}",${u.esSocioCDI ? 'SI' : 'NO'},${u.examenesDone},${u.status}`
        );
        const csv = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", "MUGZ_Base_de_Datos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'EN_JUEGO': return <Badge className="bg-success text-success-foreground text-xs"><CheckCircle className="w-3 h-3 mr-1" /> En Juego</Badge>;
            case 'PRE_CALENTAMIENTO': return <Badge variant="outline" className="text-warning border-warning/50 text-xs"><Activity className="w-3 h-3 mr-1" /> Pre-calentamiento</Badge>;
            case 'BANEADO': return <Badge variant="destructive" className="text-xs"><ShieldAlert className="w-3 h-3 mr-1" /> Baneado</Badge>;
            default: return <Badge variant="secondary" className="text-xs">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER STATS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard VAR</h1>
                    <p className="text-muted-foreground">Campaña "Métele un Gol al Cáncer"</p>
                </div>
                <Button onClick={downloadExcel} className="bg-success text-success-foreground hover:bg-success/90 font-bold">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Excel (.csv)
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{stats.userCount}</div>
                        <p className="text-xs text-muted-foreground">Total Fichados</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-success/30 border">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-success">{stats.enJuegoCount}</div>
                        <p className="text-xs text-muted-foreground">En Juego (PSA ✓)</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-warning/30 border">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-warning">{stats.userCount - stats.enJuegoCount}</div>
                        <p className="text-xs text-muted-foreground">Pre-calentamiento</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{stats.operativeCount}</div>
                        <p className="text-xs text-muted-foreground">Operativos PSA</p>
                    </CardContent>
                </Card>
            </div>

            {/* TABS PRINCIPALES */}
            <Tabs defaultValue="estadisticas" className="border border-border/50 rounded-xl bg-card/30 p-4 md:p-6 shadow-xl">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-background/50 border border-border">
                    <TabsTrigger value="estadisticas" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-xs sm:text-sm">
                        <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" /> Estadísticas
                    </TabsTrigger>
                    <TabsTrigger value="jugadores" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-xs sm:text-sm">
                        <Users className="w-4 h-4 mr-1 sm:mr-2" /> Jugadores
                    </TabsTrigger>
                    <TabsTrigger value="var" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-xs sm:text-sm">
                        <Camera className="w-4 h-4 mr-1 sm:mr-2" /> VAR
                    </TabsTrigger>
                    <TabsTrigger value="operativos" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold text-xs sm:text-sm">
                        <MapPin className="w-4 h-4 mr-1 sm:mr-2" /> Operativos
                    </TabsTrigger>
                </TabsList>

                {/* ========== TAB: ESTADÍSTICAS ========== */}
                <TabsContent value="estadisticas" className="space-y-6">
                    {!estadisticas || estadisticas.total === 0 ? (
                        <div className="py-16 text-center text-muted-foreground border border-dashed border-border/50 rounded-xl">
                            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">Sin datos estadísticos aún</p>
                            <p className="text-sm mt-1">Las estadísticas se generarán cuando los jugadores comiencen a inscribirse.</p>
                        </div>
                    ) : (
                        <>
                            {/* Indicador Central: Tasa de Conversión */}
                            <div className="bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20 rounded-xl p-6 text-center">
                                <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Tasa de Conversión (Fichado → Examen Realizado)</p>
                                <div className="text-6xl font-black text-primary">{estadisticas.tasaConversion}%</div>
                                <p className="text-muted-foreground text-sm mt-2">{estadisticas.enJuego} de {estadisticas.total} inscritos ya tienen su examen PSA validado</p>
                                <div className="h-3 bg-border rounded-full overflow-hidden mt-4 max-w-md mx-auto">
                                    <BarEffect
                                        pct={estadisticas.tasaConversion}
                                        className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-1000"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Estado de Jugadores */}
                                <Card className="bg-card/50 border-border">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Estado de Jugadores</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <StatBar label="✅ En Juego (examen validado)" value={estadisticas.enJuego} total={estadisticas.total} color="bg-success" />
                                        <StatBar label="⏳ Pre-calentamiento (sin examen)" value={estadisticas.preCalentamiento} total={estadisticas.total} color="bg-warning" />
                                        <StatBar label="🚫 Baneados" value={estadisticas.baneados} total={estadisticas.total} color="bg-destructive" />
                                        <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
                                            Edad promedio de inscritos: <strong className="text-foreground">{estadisticas.edadPromedio} años</strong>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Grupos Etarios */}
                                <Card className="bg-card/50 border-border">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Distribución por Edad</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {Object.entries(estadisticas.grupos).map(([rango, count]) => (
                                            <StatBar key={rango} label={`${rango} años`} value={count as number} total={estadisticas.total} color="bg-primary" />
                                        ))}
                                        <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
                                            Socios CDI inscritos: <strong className="text-primary">{estadisticas.sociosCDI}</strong>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Top Clubes */}
                                <Card className="bg-card/50 border-border">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">🏆 Ranking de Clubes</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {estadisticas.topClubes.length === 0 ? (
                                            <p className="text-muted-foreground text-sm">Sin datos de club aún.</p>
                                        ) : estadisticas.topClubes.map(([club, count], i) => (
                                            <StatBar key={club} label={`${i + 1}. ${club}`} value={count as number} total={estadisticas.total} color={i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-primary/60'} />
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Top Comunas */}
                                <Card className="bg-card/50 border-border">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Inscritos por Comuna</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {estadisticas.topComunas.length === 0 ? (
                                            <p className="text-muted-foreground text-sm">Sin datos de comuna aún.</p>
                                        ) : estadisticas.topComunas.map(([comuna, count]) => (
                                            <StatBar key={comuna} label={comuna} value={count as number} total={estadisticas.total} color="bg-cyan-500" />
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* ========== TAB: JUGADORES ========== */}
                <TabsContent value="jugadores" className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold">Gestión de Jugadores</h2>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por RUT, Nombre o Club..."
                                className="pl-8 bg-background border-border"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border border-border/50 overflow-x-auto bg-background/50">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted text-muted-foreground border-b border-border/50 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">RUT</th>
                                    <th className="px-4 py-3 font-semibold">Jugador</th>
                                    <th className="px-4 py-3 font-semibold">Edad</th>
                                    <th className="px-4 py-3 font-semibold">Club / Comuna</th>
                                    <th className="px-4 py-3 font-semibold text-center">Estado</th>
                                    <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {filteredUsers.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No se encontraron jugadores.</td></tr>
                                ) : filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-mono text-xs">{u.rut}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-white">{u.nombre}</div>
                                            <div className="text-xs text-muted-foreground">{u.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center">{u.edad}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">{u.club || '—'}</div>
                                            <div className="text-xs text-muted-foreground">{u.comuna}</div>
                                        </td>
                                        <td className="px-4 py-3 text-center">{getStatusBadge(u.status)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="outline" className="h-7 text-xs border-success/30 hover:bg-success/20 text-success" onClick={() => handleStatusChange(u.id, 'EN_JUEGO')} disabled={u.status === 'EN_JUEGO'}>
                                                    ✓ Validar
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-7 text-xs border-warning/30 hover:bg-warning/20 text-warning" onClick={() => handleStatusChange(u.id, 'PRE_CALENTAMIENTO')} disabled={u.status === 'PRE_CALENTAMIENTO'}>
                                                    ↺
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/20" title="Banear" onClick={() => handleStatusChange(u.id, 'BANEADO')} disabled={u.status === 'BANEADO'}>
                                                    <ShieldAlert className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                {/* ========== TAB: VAR (GALERÍA) ========== */}
                <TabsContent value="var" className="space-y-4">
                    <h2 className="text-xl font-bold">Moderación VAR — Galería de Fotos</h2>
                    <p className="text-sm text-muted-foreground">Aprueba las fotos que subirán los usuarios a la galería pública.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {photos.filter(p => p.status === 'PENDING').length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
                                <Camera className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No hay fotos pendientes de revisión.</p>
                            </div>
                        ) : photos.filter(p => p.status === 'PENDING').map(photo => (
                            <Card key={photo.id} className="overflow-hidden border-border/50 bg-background/50">
                                <div className="h-40 bg-muted">
                                    <img src={photo.url} alt="Envío" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/images/crack_oyarzo.png'; }} />
                                </div>
                                <CardContent className="p-2">
                                    <div className="flex gap-1 mt-1">
                                        <Button size="sm" className="flex-1 h-8 text-xs bg-success text-success-foreground hover:bg-success/90" onClick={() => handlePhotoAction(photo.id, 'APPROVED')}><CheckCircle className="w-3 h-3 mr-1" /> Aprobar</Button>
                                        <Button size="sm" variant="destructive" className="flex-1 h-8 text-xs" onClick={() => handlePhotoAction(photo.id, 'REJECTED')}><XCircle className="w-3 h-3 mr-1" /> Rechazar</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* ========== TAB: OPERATIVOS ========== */}
                <TabsContent value="operativos" className="space-y-4">
                    <h2 className="text-xl font-bold">Puntos de Tamizaje PSA</h2>
                    <div className="h-40 border border-dashed border-border/50 rounded-lg flex items-center justify-center text-muted-foreground bg-background/30 text-sm">
                        Módulo de gestión de operativos en construcción. Los datos actuales se exportan en el Excel.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
