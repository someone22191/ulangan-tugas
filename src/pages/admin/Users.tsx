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
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  UserPlus, 
  Mail,
  ShieldCheck,
  GraduationCap,
  History,
  BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('siswa');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('users').select('*');
    if (data) setUsers(data);
    else {
      // Mock data if fetch fails (e.g. no DB yet)
      setUsers([
        { id: '1', name: 'Admin Utama', role: 'admin', email: 'admin@school.com' },
        { id: '2', name: 'Budi Santoso', role: 'guru', email: 'budi@school.com' },
        { id: '3', name: 'Siti Aminah', role: 'siswa', email: 'siti@school.com' },
      ]);
    }
    setLoading(false);
  };

  const handleAddUser = async () => {
    // In production, this would call a Supabase function to create auth user + DB entry
    const newUser = { id: Math.random().toString(36).substr(2, 9), name: newName, email: newEmail, role: newRole };
    setUsers([...users, newUser]);
    setIsAddOpen(false);
    // Reset
    setNewName(''); setNewEmail(''); setNewRole('siswa');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">Kelola hak akses untuk Admin, Guru, dan Siswa.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full h-11 px-6 shadow-lg shadow-primary/20">
              <UserPlus size={18} /> Tambah User Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
              <DialogDescription>Input data user yang akan didaftarkan ke sistem.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Contoh: Budi Sudarsono" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="email@school.com" />
              </div>
              <div className="space-y-2">
                <Label>Role / Peran</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="guru">Guru Pengampu</SelectItem>
                    <SelectItem value="siswa">Siswa Didik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
              <Button onClick={handleAddUser}>Simpan User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Cari user berdasarkan nama atau email..." 
              className="pl-10 h-10" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon"><History size={18} /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Nama Pengguna</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {user.name?.[0].toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground flex items-center gap-2">
                      <Mail size={14} /> {user.email}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreHorizontal size={18} /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(user.id)}><Trash2 size={18} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-medium">
                    {loading ? 'Sedang memuat data...' : 'Tidak ada user ditemukan.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: any = {
    admin: "bg-red-100 text-red-700 border-red-200",
    guru: "bg-blue-100 text-blue-700 border-blue-200",
    siswa: "bg-green-100 text-green-700 border-green-200"
  };

  const icons: any = {
    admin: <ShieldCheck size={14} />,
    guru: <BookOpen size={14} />,
    siswa: <GraduationCap size={14} />
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${styles[role] || styles.siswa}`}>
      {icons[role] || icons.siswa}
      {role}
    </span>
  );
}
