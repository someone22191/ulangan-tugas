import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SiswaExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      const { data } = await supabase.from('exams').select('*');
      if (data) setExams(data);
      else {
        // Mock data
        setExams([
          { id: '1', title: 'Ujian Matematika Semester 1', duration: 90, status: 'available', subject: 'Matematika' },
          { id: '2', title: 'Ujian Bahasa Inggris Lanjutan', duration: 60, status: 'available', subject: 'B. Inggris' },
          { id: '3', title: 'Simulasi UNBK 2026', duration: 120, status: 'completed', score: 85, subject: 'Umum' },
        ]);
      }
      setLoading(false);
    };
    fetchExams();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Daftar Ujian</h1>
        <p className="text-muted-foreground">Pilih ujian yang tersedia untuk dikerjakan hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} className={`shadow-sm transition-all duration-300 border-l-4 ${exam.status === 'completed' ? 'border-l-green-500 opacity-80' : 'border-l-primary hover:shadow-lg hover:shadow-primary/5'}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {exam.subject}
                </div>
                {exam.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Selesai
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    <AlertCircle size={12} /> Tersedia
                  </span>
                )}
              </div>
              <CardTitle className="text-xl font-bold line-clamp-1">{exam.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Timer size={14} /> Durasi: {exam.duration} Menit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-slate-50 rounded-xl">
                  <FileText size={18} className="text-slate-400" />
                  <span>30 Soal Pilihan Ganda</span>
                </div>
                {exam.status === 'completed' && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-sm font-semibold text-green-800">Nilai Anda:</span>
                    <span className="text-xl font-black text-green-600">{exam.score}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              {exam.status === 'completed' ? (
                <Button variant="outline" className="w-full font-bold h-11" disabled>
                  Ujian Selesai
                </Button>
              ) : (
                <Button 
                  className="w-full font-bold h-11 gap-2 shadow-lg shadow-primary/10" 
                  onClick={() => navigate(`/siswa/kerjakan/${exam.id}`)}
                >
                  <PlayCircle size={18} /> Mulai Kerjakan
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {exams.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <ClipboardList size={32} />
          </div>
          <h3 className="text-lg font-bold">Belum Ada Ujian</h3>
          <p className="text-muted-foreground">Silakan hubungi wali kelas atau guru pengampu Anda.</p>
        </div>
      )}
    </div>
  );
}
