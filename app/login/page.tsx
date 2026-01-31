'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic client-side validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        // Safety timeout to prevent infinite buffering
        const safetyTimeout = setTimeout(() => {
            if (loading) {
                setLoading(false);
                setError('Request timed out. Please try again.');
            }
        }, 15000); // 15 seconds max

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            clearTimeout(safetyTimeout);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md bg-card border border-border">
                <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                        <CardTitle className="text-3xl font-serif uppercase tracking-widest">
                            LawyerUp
                        </CardTitle>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 bg-muted p-1 border border-border">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${mode === 'login'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${mode === 'signup'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleAuth} className="flex flex-col gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-background border border-input text-foreground focus:outline-none focus:border-ring transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-destructive text-sm text-center border border-destructive/50 bg-destructive/10 py-2">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </Button>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Or</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        <Button
                            type="button"
                            onClick={handleGoogleLogin}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-3"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-.56z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                        >
                            ← Back to Landing Page
                        </a>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
