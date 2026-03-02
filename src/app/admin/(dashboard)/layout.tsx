import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { logoutAdmin } from '@/app/actions/admin';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session || session.value !== 'authenticated') {
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-auto px-3 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-black italic text-primary">PANEL VAR</span>
                        </div>
                        <span className="font-bold text-lg hidden sm:block">Administración MUG Z</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">SuperAdmin</span>
                        <form action={logoutAdmin}>
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
