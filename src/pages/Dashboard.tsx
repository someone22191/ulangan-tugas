import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ session }: { session: any }) {
  const [role, setRole] = useState<string>('');
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      const userRole = userData?.role || 'siswa';
      setRole(userRole);

      // Fetch stats based on role
      try {
        if (userRole === 'admin') {
          const [{ count: userCount }, { count: examCount }] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }),
            supabase.from('exams').select('*', { count: 'exact', head: true })
          ]);
          setStats({ users: userCount || 0, exams: examCount || 0 });
        } else if (userRole === 'guru') {
          const [{ count: qCount }, { count: eCount }] = await Promise.all([
            supabase.from('questions').select('*', { count: 'exact', head: true }).eq('created_by', session.user.id),
            supabase.from('exams').select('*', { count: 'exact', head: true }).eq('created_by', session.user.id)
          ]);
          setStats({ questions: qCount || 0, myExams: eCount || 0 });
        } else {
          const { data: results } = await supabase
            .from('results')
            .select('*')
            .eq('user_id', session.user.id);
          setStats({ examsTaken: results?.length || 0 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang!</h1>
        <p className="text-muted-foreground">Halo, {session.user.email}. Berikut ringkasan hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {role === 'admin' && (
          <>
            <StatCard icon={Users} title="Total User" value={stats.users} color="bg-blue-500" />
            <StatCard icon={ClipboardList} title="Total Ujian" value={stats.exams} color="bg-primary" />
            <StatCard icon={BookOpen} title="Soal Dibuat" value="1.2k" color="bg-green-500" />
            <StatCard icon={CheckCircle2} title="Ujian Selesai" value="842" color="bg-orange-500" />
          </>
        )}
        {role === 'guru' && (
          <>
            <StatCard icon={BookOpen} title="Bank Soal Saya" value={stats.questions} color="bg-green-500" />
            <StatCard icon={ClipboardList} title="Ujian Saya" value={stats.myExams} color="bg-primary" />
            <StatCard icon={Users} title="Siswa Menjawab" value="240" color="bg-blue-500" />
            <StatCard icon={Clock} title="Ujian Aktif" value="3" color="bg-orange-500" />
          </>
        )}
        {role === 'siswa' && (
          <>
            <StatCard icon={ClipboardList} title="Ujian Diambil" value={stats.examsTaken} color="bg-primary" />
            <StatCard icon={CheckCircle2} title="Nilai Rata-rata" value="85.4" color="bg-green-500" />
            <StatCard icon={Clock} title="Sisa Waktu" value="--" color="bg-orange-500" />
            <StatCard icon={Users} title="Peringkat" value="#4" color="bg-blue-500" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
              <CardDescription>Log aktivitas sistem 24 jam terakhir</CardDescription>
            </div>
            {role === 'guru' && (
              <Button size="sm" onClick={() => navigate('/guru/buat-ujian')}>
                <Plus size={16} className="mr-2" /> Buat Ujian
              </Button>
            )}
            {role === 'siswa' && (
              <Button size="sm" onClick={() => navigate('/siswa/daftar-ujian')}>
                Lihat Jadwal
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Ujian Matematika Dasar Berhasil Disimpan</p>
                    <p className="text-xs text-muted-foreground">Oleh Ahmad Sanusi (Guru) • 2 Jam yang lalu</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Sekolah</CardTitle>
            <CardDescription>Pengumuman terbaru dari pusat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h4 className="font-bold text-primary text-sm mb-1 uppercase tracking-wider">Penting</h4>
              <p className="text-sm">Ujian Tengah Semester akan dilaksanakan pada tanggal 2 Mei 2026. Pastikan seluruh siswa sudah terdaftar.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
              <h4 className="font-bold text-slate-800 text-sm mb-1">Update Sistem</h4>
              <p className="text-sm text-muted-foreground">Versi 2.0.0 sudah rilis dengan fitur timer otomatis yang lebih stabil.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }: any) {
  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
