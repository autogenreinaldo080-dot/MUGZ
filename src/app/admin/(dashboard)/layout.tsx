import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    // Si no hay sesión, protegemos la ruta mandándolos al login
    if (!session || session.value !== 'authenticated') {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Admin Navbar */}
            <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xl font-black italic text-primary">VAR</span>
                        </div>
                        <span className="font-bold text-lg hidden sm:block">Panel de Administración</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">SuperAdmin</span>
                        <form action={async () => {
                            'use server';
                            const { cookies } = await import('next/headers');
                            (await cookies()).delete('admin_session');
                            redirect('/admin/login');
                        }}>
                            <button type="submit" className="text-sm font-medium text-destructive hover:underline">
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <main className="flex-1 container mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
