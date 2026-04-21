import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  BookOpen, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  FileText,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function GuruQuestions() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [questionText, setQuestionText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correct, setCorrect] = useState('A');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data } = await supabase.from('questions').select('*');
    if (data) setQuestions(data);
    else {
      setQuestions([
        { 
          id: '1', 
          question: 'Siapakah penemu bola lampu?', 
          option_a: 'Thomas Alva Edison', 
          option_b: 'Albert Einstein', 
          option_c: 'Isaac Newton', 
          option_d: 'Nikola Tesla', 
          correct_answer: 'A' 
        },
        { 
          id: '2', 
          question: 'Apa ibukota Indonesia?', 
          option_a: 'Bandung', 
          option_b: 'Jakarta', 
          option_c: 'Surabaya', 
          option_d: 'Medan', 
          correct_answer: 'B' 
        },
      ]);
    }
    setLoading(false);
  };

  const handleAddQuestion = async () => {
    const newQ = {
      id: Math.random().toString(),
      question: questionText,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_answer: correct
    };
    setQuestions([...questions, newQ]);
    setIsAddOpen(false);
    // Reset Form
    setQuestionText(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setCorrect('A');
  };

  const filtered = questions.filter(q => q.question.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bank Soal</h1>
          <p className="text-muted-foreground">Kumpulan soal pilihan ganda yang dapat digunakan dalam ujian.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 h-11 px-6 rounded-full shadow-lg shadow-primary/20">
              <Plus size={18} /> Tambah Soal Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Soal Pilihan Ganda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label>Pertanyaan</Label>
                <Textarea value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Tuliskan pertanyaan disini..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Opsi A</Label>
                  <Input value={optA} onChange={e => setOptA(e.target.value)} placeholder="Jawaban A" />
                </div>
                <div className="space-y-2">
                  <Label>Opsi B</Label>
                  <Input value={optB} onChange={e => setOptB(e.target.value)} placeholder="Jawaban B" />
                </div>
                <div className="space-y-2">
                  <Label>Opsi C</Label>
                  <Input value={optC} onChange={e => setOptC(e.target.value)} placeholder="Jawaban C" />
                </div>
                <div className="space-y-2">
                  <Label>Opsi D</Label>
                  <Input value={optD} onChange={e => setOptD(e.target.value)} placeholder="Jawaban D" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Jawaban Benar</Label>
                <div className="flex gap-4">
                  {['A', 'B', 'C', 'D'].map(val => (
                    <Button 
                      key={val}
                      variant={correct === val ? 'default' : 'outline'}
                      className="w-full font-bold"
                      onClick={() => setCorrect(val)}
                    >
                      {val}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
              <Button onClick={handleAddQuestion}>Simpan Soal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Cari soal berdasarkan kata kunci..." 
            className="pl-10 h-11"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 gap-2">
          <Filter size={18} /> Filter Mapel
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((q, idx) => (
          <Card key={q.id} className="hover:border-primary/20 transition-all group shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2 px-2 py-0.5 bg-primary/5 w-fit rounded">
                    <FileText size={12} /> Soal #{idx+1}
                  </div>
                  <h3 className="text-lg font-bold leading-relaxed">{q.question}</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-50"><Edit size={18} /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-red-50"><Trash2 size={18} /></Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Choice option="A" text={q.option_a} isCorrect={q.correct_answer === 'A'} />
                <Choice option="B" text={q.option_b} isCorrect={q.correct_answer === 'B'} />
                <Choice option="C" text={q.option_c} isCorrect={q.correct_answer === 'C'} />
                <Choice option="D" text={q.option_d} isCorrect={q.correct_answer === 'D'} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Choice({ option, text, isCorrect }: any) {
  return (
    <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${isCorrect ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-white border-slate-100'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-green-500 text-white shadow-md shadow-green-100' : 'bg-slate-100 text-slate-500'}`}>
        {option}
      </div>
      <p className={`text-sm font-medium ${isCorrect ? 'text-green-900' : 'text-slate-700'}`}>{text}</p>
      {isCorrect && <CheckCircle2 size={16} className="ml-auto text-green-500" />}
    </div>
  );
}
