import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Search, 
  Eye, 
  Download, 
  Trash2, 
  User,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminExams() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    const { data } = await supabase.from('exams').select('*');
    if (data) setExams(data);
    else {
      // Mock data
      setExams([
        { id: '1', title: 'Ujian Matematika Semester 1', duration: 90, created_by: 'Pak Budi', date: '2026-05-02' },
        { id: '2', title: 'Ujian Bahasa Inggris Lanjutan', duration: 60, created_by: 'Ibu Siti', date: '2026-05-05' },
        { id: '3', title: 'Simulasi Kejuruan TKJ', duration: 120, created_by: 'Pak Joko', date: '2026-05-10' },
      ]);
    }
    setLoading(false);
  };

  const filtered = exams.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Ujian</h1>
          <p className="text-muted-foreground">Lihat dan kontrol seluruh ujian yang aktif dalam sistem.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={18} /> Rekap Nilai (Excel)
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-2">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Cari ujian berdasarkan judul..." 
              className="pl-10 h-10" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead>Judul Ujian</TableHead>
                <TableHead>Dibuat Oleh</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((exam) => (
                <TableRow key={exam.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-bold text-slate-700">{exam.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-muted-foreground" /> {exam.created_by}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-muted-foreground" /> {exam.duration} Menit
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full border border-green-100 flex items-center gap-1 w-fit">
                      <CheckCircle2 size={12} /> Aktif
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Lihat Detail"><Eye size={18} /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive"><Trash2 size={18} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
