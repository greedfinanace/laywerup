import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function AuthErrorPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md bg-card border border-destructive/50">
                <CardHeader className="border-b border-border flex flex-col items-center">
                    <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
                    <CardTitle className="text-2xl font-serif uppercase tracking-widest text-center">
                        Authentication Error
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground mb-6">
                        There was a problem authenticating with Google. This could be due to a cancelled login attempt or a configuration issue.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link href="/login" className="w-full">
                            <Button className="w-full uppercase tracking-wider">
                                Return to Login
                            </Button>
                        </Link>
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full uppercase tracking-wider">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
