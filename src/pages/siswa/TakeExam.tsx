import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [loading, setLoading] = useState(true);
  const [examTitle, setExamTitle] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const fetchExam = async () => {
      // Mock Data for Engine
      setExamTitle("Ujian Matematika Semester 1");
      const mockQs = [
        { id: 'q1', question: 'Hasil dari 5 + (3 * 2) adalah...', a: '11', b: '10', c: '16', d: '13', correct: 'A' },
        { id: 'q2', question: 'Berapakah akar pangkat dua dari 144?', a: '10', b: '11', c: '12', d: '13', correct: 'C' },
        { id: 'q3', question: 'Berikut yang merupakan bilangan prima adalah...', a: '4', b: '9', c: '15', d: '2', correct: 'D' },
        { id: 'q4', question: 'Volume kubus dengan sisi 3cm adalah...', a: '9cm³', b: '27cm³', c: '18cm³', d: '12cm³', correct: 'B' },
        { id: 'q5', question: 'Hasil dari 1/2 + 1/4 adalah...', a: '2/4', b: '3/4', c: '1/6', d: '1/8', correct: 'B' }
      ];
      setQuestions(mockQs);
      setTimeLeft(10 * 60); // 10 minutes session for demo
      setLoading(false);
    };
    fetchExam();
  }, [id]);

  const handleSubmit = useCallback(() => {
    if (isFinished) return;
    
    // Calculate Score
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correctCount++;
    });
    
    const score = (correctCount / questions.length) * 100;
    setResults({
      score,
      correct: correctCount,
      total: questions.length
    });
    setIsFinished(true);
  }, [isFinished, questions, answers]);

  useEffect(() => {
    if (timeLeft <= 0 || isFinished) {
      if (timeLeft === 0 && !isFinished) handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (ans: string) => {
    if (isFinished) return;
    setAnswers({ ...answers, [questions[currentIdx].id]: ans });
  };

  if (loading) return <div>Menyiapkan soal ujian...</div>;

  if (isFinished) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl shadow-primary/10 border">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-green-200">
            <CheckCircle2 size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold">Ujian Selesai!</h2>
            <p className="text-muted-foreground mt-2">Jawaban Anda telah berhasil dikirim ke sistem.</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Nilai Akhir</p>
            <p className="text-7xl font-black text-primary">{results?.score.toFixed(0)}</p>
            <div className="mt-4 flex gap-4 text-sm font-semibold text-slate-600">
              <span className="text-green-600">Benar: {results?.correct}</span>
              <span className="text-slate-400">|</span>
              <span className="text-red-600">Salah: {results?.total - results?.correct}</span>
            </div>
          </div>
          <Button onClick={() => navigate('/siswa/daftar-ujian')} className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/10">
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <HelpCircle size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{examTitle}</h2>
            <p className="text-xs text-muted-foreground font-medium">Sesi Ujian Aktif • {questions.length} Butir Soal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 leading-none">Waktu Tersisa</p>
            <div className={`flex items-center gap-2 font-mono text-xl font-black ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-slate-800'}`}>
              <Clock size={20} /> {formatTime(timeLeft)}
            </div>
          </div>
          <Button 
            className="rounded-full px-6 font-bold h-11 shadow-md shadow-primary/10 bg-primary hover:bg-primary/90" 
            onClick={() => { if(confirm('Yakin ingin mengakhiri ujian?')) handleSubmit(); }}
          >
            Selesai Ujian
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Main Exam Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Question Card */}
          <Card className="flex-1 shadow-sm border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-1 bg-primary/10 w-full">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <CardContent className="p-8">
              <div className="mb-8">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                  Soal No. {currentIdx + 1}
                </span>
                <h3 className="text-2xl font-bold leading-snug text-slate-800">
                  {currentQ?.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['a', 'b', 'c', 'd'].map((letter) => (
                  <button
                    key={letter}
                    disabled={isFinished}
                    onClick={() => handleSelectAnswer(letter.toUpperCase())}
                    className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${
                      answers[currentQ.id] === letter.toUpperCase()
                        ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 transition-colors ${
                      answers[currentQ.id] === letter.toUpperCase()
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                    }`}>
                      {letter.toUpperCase()}
                    </div>
                    <span className={`text-base font-semibold ${answers[currentQ.id] === letter.toUpperCase() ? 'text-primary' : 'text-slate-600'}`}>
                      {currentQ[letter as keyof typeof currentQ]}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 rounded-full h-12 gap-2"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(currentIdx - 1)}
            >
              <ChevronLeft size={20} /> Sebelumnya
            </Button>
            
            <div className="hidden md:flex gap-2">
               <Button variant="ghost" className="text-amber-600 gap-2 font-bold hover:bg-amber-50">
                 <Flag size={18} /> Tandai Ragu-ragu
               </Button>
            </div>

            {currentIdx === questions.length - 1 ? (
              <Button 
                variant="default" 
                size="lg" 
                className="px-8 rounded-full h-12 font-bold"
                onClick={() => { if(confirm('Yakin ingin submit jawaban?')) handleSubmit(); }}
              >
                Submit Jawaban
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="lg" 
                className="px-8 rounded-full h-12 gap-2 font-bold"
                onClick={() => setCurrentIdx(currentIdx + 1)}
              >
                Selanjutnya <ChevronRight size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar: Question Grid */}
        <div className="lg:col-span-1">
          <Card className="h-full shadow-sm border-slate-100 sticky top-24">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">Navigasi Soal</h4>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold">
                  <CheckCircle2 size={12} /> {Object.keys(answers).length}/{questions.length} Terjawab
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-full aspect-square rounded-xl text-xs font-bold transition-all duration-200 border-2 ${
                      currentIdx === idx 
                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/10 ring-2 ring-white ring-inset' 
                        : answers[q.id] 
                          ? 'border-green-500 bg-green-50 text-green-600' 
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>Sedang Dikerjakan</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span>Sudah Terjawab</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>
                  <span>Belum Terjawab</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
