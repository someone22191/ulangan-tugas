import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/core-ui/button';
import { Input } from '@/components/core-ui/input';
import { Label } from '@/components/core-ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/core-ui/card';
import { School, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/layout/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If it's a placeholder URL, allow "mock" login for demo purposes
    const isPlaceholder = import.meta.env.VITE_SUPABASE_URL?.includes('placeholder');
    
    if (isPlaceholder) {
      // Simulation for demo
      setTimeout(() => {
        setLoading(false);
        // Note: In real app this would store session in supabase client
        alert("Demo Mode: Silakan konfigurasi Supabase URL untuk login yang sebenarnya. Untuk sekarang, saya akan mencoba mengarahkan Anda.");
        navigate('/dashboard');
      }, 1000);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Logo className="w-16 h-16" imageClassName="w-16 h-16" />
          <div className="text-left">
            <h1 className="font-bold text-xl leading-tight text-slate-900">SMK Prima Unggul</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold font-mono">CBT Portal</p>
          </div>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Masukkan email dan password untuk masuk ke sistem.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm flex items-center gap-3 border border-destructive/20">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email text-sm font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="h-11 px-4"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password text-sm font-medium">Password</Label>
                  <button type="button" className="text-sm text-primary hover:underline font-medium">Lupa password?</button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="h-11 px-4"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 text-base font-semibold rounded-lg" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Masuk sekarang'}
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground font-semibold tracking-wider">Atau bantuan</span>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Siswa baru atau guru baru? <br />
                <button type="button" className="text-primary font-bold hover:underline">Hubungi Administrator</button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
