import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/core-ui/button';
import { School, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/layout/Logo';

export default function Landing() {
  const navigate = useNavigate();

  const jurusans = [
    { name: 'Teknik Komputer & Jaringan', code: 'TKJ' },
    { name: 'Desain Komunikasi Visual', code: 'DKV' },
    { name: 'Akuntansi', code: 'AK' },
    { name: 'Broadcasting', code: 'BC' },
    { name: 'Manajemen Perkantoran & Layanan Bisnis', code: 'MPLB' },
    { name: 'Bisnis Digital', code: 'BD' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo className="w-12 h-12" imageClassName="w-12 h-12" />
          <div>
            <h1 className="font-bold text-lg leading-tight">SMK Prima Unggul</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">CBT Portal</p>
          </div>
        </div>
        <Button onClick={() => navigate('/login')} className="rounded-full px-6">
          Login Portal
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Platform Ujian Online Resmi
          </div>
          <h2 className="text-6xl font-extrabold tracking-tight leading-[1.1]">
            Menuju Pendidikan <br />
            <span className="text-primary italic">Masa Depan</span> Digital.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            Sistem Computer Based Test (CBT) terpadu untuk efisiensi ujian, transparansi nilai, dan kemudahan manajemen soal bagi seluruh siswa SMK Prima Unggul.
          </p>
          <div className="flex gap-4">
            <Button size="lg" onClick={() => navigate('/login')} className="rounded-full px-8 h-12 text-base gap-2">
              Mulai Ujian <ArrowRight size={20} />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-slate-100">
            <img 
              src="https://picsum.photos/seed/school/800/600" 
              alt="School environment" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
              <p className="text-2xl font-bold">SMK Prima Unggul</p>
              <p className="opacity-80">Terakreditasi A - Unggul dalam Prestasi, Terpuji dalam Pekerti</p>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-1"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-1"></div>
        </motion.div>
      </section>

      {/* Jurusan Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl font-bold">Jurusan Kami</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Beragam pilihan kompetensi keahlian yang siap mencetak tenaga kerja profesional dan kompeten di bidangnya.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jurusans.map((j, idx) => (
              <motion.div 
                key={j.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 mb-4 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <span className="font-bold">{j.code}</span>
                </div>
                <h4 className="text-lg font-bold mb-2">{j.name}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Kurikulum Industri</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t text-center text-sm text-muted-foreground">
        <p>&copy; 2026 SMK Prima Unggul. All rights reserved.</p>
        <p className="mt-2 font-medium text-slate-800">CBT System v2.0.0</p>
      </footer>
    </div>
  );
}
