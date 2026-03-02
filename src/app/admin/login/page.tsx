'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Import the server action dynamically to avoid boundary errors
            const { loginAdmin } = await import('@/app/actions/admin');
            const result = await loginAdmin(password);

            if (result.success) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(result.error || 'Autenticación fallida');
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black italic text-primary tracking-tight">VAR / ADMINISTRADOR</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Campaña "Métele un Gol al Cáncer"</p>
                </div>

                <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Ingreso Seguro</CardTitle>
                        <CardDescription className="text-sm">
                            Por favor, ingrese la clave de acceso para continuar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña Maestra</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-background/50 text-center tracking-[0.2em] font-mono text-lg"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive text-sm font-medium">
                                    <ShieldAlert className="w-4 h-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full font-bold uppercase tracking-wider h-12"
                                disabled={loading || !password}
                            >
                                {loading ? 'Verificando...' : 'Desbloquear Panel'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center mt-8">
                    <Button variant="ghost" onClick={() => router.push('/')} className="text-muted-foreground hover:text-white">
                        ← Volver a la cancha
                    </Button>
                </div>
            </div>
        </div>
    );
}
