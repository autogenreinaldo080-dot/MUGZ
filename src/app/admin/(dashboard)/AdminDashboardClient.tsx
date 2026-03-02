'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Users, Camera, MapPin, Download, CheckCircle, XCircle, Search, ShieldAlert, Activity } from 'lucide-react';
import { updateUserStatus, updatePhotoStatus } from '@/app/actions/admin-data';
import { useToast } from "@/hooks/use-toast";

type User = any; // simplified for this component
type Photo = any;

interface AdminDashboardClientProps {
    initialUsers: User[];
    initialPhotos: Photo[];
    stats: any;
}

export default function AdminDashboardClient({ initialUsers, initialPhotos, stats }: AdminDashboardClientProps) {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    const [searchQuery, setSearchQuery] = useState('');

    // Lógica de cambio de estado
    const handleStatusChange = async (userId: string, newStatus: string) => {
        // UI optimista
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));

        const result = await updateUserStatus(userId, newStatus);
        if (!result.success) {
            toast({ title: 'Error', description: 'No se pudo actualizar el estado', variant: 'destructive' });
            // revertir si falla
            setUsers(initialUsers);
        } else {
            toast({ title: 'Estado actualizado', description: `El jugador ahora está en: ${newStatus.replace('_', ' ')}` });
        }
    };

    const handlePhotoAction = async (photoId: string, newStatus: string) => {
        setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, status: newStatus } : p));
        const result = await updatePhotoStatus(photoId, newStatus);
        if (!result.success) {
            toast({ title: 'Error', description: 'No se procesó la foto', variant: 'destructive' });
            setPhotos(initialPhotos);
        } else {
            toast({ title: 'Foto ' + (newStatus === 'APPROVED' ? 'Aprobada' : 'Rechazada') });
        }
    };

    // Filtrado
    const filteredUsers = users.filter(u =>
        u.rut.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.club?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Exportar a CSV (Excel básico)
    const downloadExcel = () => {
        // Cabeceras
        const headers = ['RUT,Nombre,Edad,Telefono,Email,Club,Examenes,Estado'];
        // Filas
        const rows = users.map(u =>
            `${u.rut},"${u.nombre}",${u.edad},${u.telefono},${u.email},"${u.club || ''}",${u.examenesDone},${u.status}`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "MUGZ_Database.csv");
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'EN_JUEGO': return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" /> En Juego (PSA OK)</Badge>;
            case 'PRE_CALENTAMIENTO': return <Badge variant="outline" className="text-warning border-warning/50"><Activity className="w-3 h-3 mr-1" /> Pre-calentamiento</Badge>;
            case 'BANEADO': return <Badge variant="destructive"><ShieldAlert className="w-3 h-3 mr-1" /> Expulsado (Ban)</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER Y ESTADISTICAS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard General</h1>
                    <p className="text-muted-foreground">Resumen de la campaña "Métele un Gol al Cáncer"</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={downloadExcel} className="bg-success text-success-foreground hover:bg-success/90 font-medium font-bold">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar a Excel (.csv)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Jugadores Fichados</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.userCount}</div>
                        <p className="text-xs text-muted-foreground">Total de usuarios registrados</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Exámenes Realizados</CardTitle>
                        <div className="h-4 w-4 text-success flex items-center justify-center font-bold">✓</div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.enJuegoCount}</div>
                        <p className="text-xs text-muted-foreground">Jugadores "En Juego"</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Puntos de Tamizaje</CardTitle>
                        <MapPin className="h-4 w-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.operativeCount}</div>
                        <p className="text-xs text-muted-foreground">Operativos activos</p>
                    </CardContent>
                </Card>
            </div>

            {/* TABS DE ADMINISTRACION */}
            <Tabs defaultValue="jugadores" className="mt-8 border border-border/50 rounded-xl bg-card/30 p-4 md:p-6 shadow-xl">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-background/50 border border-border">
                    <TabsTrigger value="jugadores" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold"><Users className="w-4 h-4 mr-2" /> Jugadores (Fichas)</TabsTrigger>
                    <TabsTrigger value="var" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold"><Camera className="w-4 h-4 mr-2" /> Sala VAR (Fotos)</TabsTrigger>
                    <TabsTrigger value="operativos" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold"><MapPin className="w-4 h-4 mr-2" /> Operativos PSA</TabsTrigger>
                </TabsList>

                <TabsContent value="jugadores" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">Gestión de Jugadores</h2>
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
                                    <th className="px-4 py-3 font-semibold">Celular</th>
                                    <th className="px-4 py-3 font-semibold">Club</th>
                                    <th className="px-4 py-3 font-semibold text-center">Estado Actual</th>
                                    <th className="px-4 py-3 font-semibold text-right">Acciones (Cambiar a)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {filteredUsers.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No se encontraron jugadores.</td></tr>
                                ) : filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-mono">{u.rut}</td>
                                        <td className="px-4 py-3 font-medium text-white">{u.nombre} <br /><span className="text-xs text-muted-foreground font-normal">{u.email}</span></td>
                                        <td className="px-4 py-3">{u.telefono}</td>
                                        <td className="px-4 py-3">{u.club || '-'}</td>
                                        <td className="px-4 py-3 text-center">{getStatusBadge(u.status)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="sm" variant="outline" className="h-8 shadow-sm border-success/30 hover:bg-success/20 text-success" onClick={() => handleStatusChange(u.id, 'EN_JUEGO')} disabled={u.status === 'EN_JUEGO'}>
                                                    ✓ Validar Test
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-8 shadow-sm border-warning/30 hover:bg-warning/20 text-warning" onClick={() => handleStatusChange(u.id, 'PRE_CALENTAMIENTO')} disabled={u.status === 'PRE_CALENTAMIENTO'}>
                                                    ↺ Revertir
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/20 hover:text-red-400" title="Expulsar Jugador (Ban)" onClick={() => handleStatusChange(u.id, 'BANEADO')} disabled={u.status === 'BANEADO'}>
                                                    <ShieldAlert className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                <TabsContent value="var" className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">Moderación del VAR (Galería)</h2>
                    <p className="text-sm text-muted-foreground">Aprueba las fotos que subirán los usuarios a la galería pública.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                        {photos.filter(p => p.status === 'PENDING').length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border/50 rounded-lg">
                                <Camera className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No hay fotos pendientes de revisión en el VAR.</p>
                            </div>
                        ) : photos.filter(p => p.status === 'PENDING').map(photo => (
                            <Card key={photo.id} className="overflow-hidden border-border/50 bg-background/50">
                                <div className="h-48 bg-muted relative">
                                    {/* Imagen (placeholder si no hay url valida) */}
                                    <img src={photo.url} alt="Envío de usuario" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = '/images/crack_oyarzo.png'} />
                                </div>
                                <CardContent className="p-3">
                                    <p className="text-xs text-muted-foreground mb-3 truncate">Subido por: Jugador MUG</p>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1 bg-success text-success-foreground hover:bg-success/90" onClick={() => handlePhotoAction(photo.id, 'APPROVED')}><CheckCircle className="w-4 h-4 mr-1" /> Aprobar</Button>
                                        <Button size="sm" variant="destructive" className="flex-1" onClick={() => handlePhotoAction(photo.id, 'REJECTED')}><XCircle className="w-4 h-4 mr-1" /> Rechazar</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8 border-t border-border pt-4">
                        <h3 className="text-lg font-bold mb-4 opacity-70">Aprobadas Recientemente</h3>
                        <div className="flex gap-2 min-h-16 text-muted-foreground text-sm">Las fotos aprobadas aparecerán aquí y en la página principal.</div>
                    </div>
                </TabsContent>

                <TabsContent value="operativos" className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">Puntos de Tamizaje (Operativos)</h2>
                    <div className="h-[200px] border border-dashed border-border/50 rounded-lg flex items-center justify-center text-muted-foreground bg-background/30">
                        Módulo de edición de Operativos en construcción. Actualmente puedes exportar y validar jugadores de los operativos activos.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
