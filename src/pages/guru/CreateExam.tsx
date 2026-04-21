import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';

export default function GuruCreateExam() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('60');

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase.from('questions').select('*');
      if (data) setQuestions(data);
      else {
        // Mock data
        setQuestions([
          { id: '1', question: 'Siapakah presiden pertama Indonesia?' },
          { id: '2', question: 'Apa warna bendera Indonesia?' },
          { id: '3', question: '2 + 2 = ?' },
          { id: '4', question: 'Siapa penemu gravitasi?' },
        ]);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const handleToggle = (id: string) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!title || selectedQuestions.length === 0) {
      alert('Harap isi judul dan pilih minimal satu soal.');
      return;
    }
    // Simulation
    alert(`Ujian "${title}" berhasil dibuat dengan ${selectedQuestions.length} soal.`);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buat Ujian Baru</h1>
          <p className="text-muted-foreground">Atur konfigurasi ujian dan pilih soal-soal pendukung.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg">Konfigurasi</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <ClipboardList size={16} className="text-primary" /> Judul Ujian
                </Label>
                <Input 
                  placeholder="Contoh: UTS Matematika XII" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Clock size={16} className="text-primary" /> Durasi (Menit)
                </Label>
                <Input 
                  type="number" 
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Soal Terpilih:</span>
                  <span className="font-bold text-primary">{selectedQuestions.length} Soal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-bold text-amber-600">Draft</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t pt-6">
              <Button onClick={handleSave} className="w-full h-11 text-base font-bold shadow-lg shadow-primary/10">
                Publikasikan Ujian
              </Button>
            </CardFooter>
          </Card>

          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
            <AlertCircle className="text-primary shrink-0" size={24} />
            <p className="text-sm leading-relaxed text-primary/80 font-medium font-sans">
              Pastikan Anda telah memeriksa kembali durasi dan kelayakan soal sebelum dipublikasikan ke siswa.
            </p>
          </div>
        </div>

        {/* Right Column: Question Selector */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b space-y-4 pt-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Daftar Soal Tersedia</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedQuestions([])}>
                  Reset Pilihan
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input placeholder="Cari soal..." className="pl-10 h-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[600px] overflow-y-auto">
              <div className="divide-y">
                {questions.map((q) => (
                  <div 
                    key={q.id} 
                    className={`p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${selectedQuestions.includes(q.id) ? 'bg-primary/5' : ''}`}
                    onClick={() => handleToggle(q.id)}
                  >
                    <Checkbox checked={selectedQuestions.includes(q.id)} className="mt-1" />
                    <div className="flex-1">
                      <p className="font-medium mb-2">{q.question}</p>
                      <div className="flex gap-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">PG (Pilihan Ganda)</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tingkat: Medium</span>
                      </div>
                    </div>
                    {selectedQuestions.includes(q.id) && <CheckCircle2 className="text-primary mt-1" size={18} />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
