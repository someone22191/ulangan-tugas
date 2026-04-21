import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ClipboardList, 
  GraduationCap, 
  LogOut,
  ChevronRight,
  School
} from 'lucide-react';
import { Button } from '@/components/elements/Button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Logo from '@/components/layout/Logo';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (data) setRole(data.role);
    };
    fetchUserRole();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard', 
      roles: ['admin', 'guru', 'siswa'] 
    },
    // Admin Items
    { 
      title: 'Manajemen User', 
      icon: Users, 
      path: '/admin/users', 
      roles: ['admin'] 
    },
    { 
      title: 'Semua Ujian', 
      icon: ClipboardList, 
      path: '/admin/exams', 
      roles: ['admin'] 
    },
    // Guru Items
    { 
      title: 'Bank Soal', 
      icon: BookOpen, 
      path: '/guru/bank-soal', 
      roles: ['guru', 'admin'] 
    },
    { 
      title: 'Buat Ujian', 
      icon: ClipboardList, 
      path: '/guru/buat-ujian', 
      roles: ['guru', 'admin'] 
    },
    // Siswa Items
    { 
      title: 'Daftar Ujian', 
      icon: GraduationCap, 
      path: '/siswa/daftar-ujian', 
      roles: ['siswa'] 
    },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <Logo className="w-10 h-10 shadow-none border-none" imageClassName="w-10 h-10" />
        <div>
          <h1 className="font-bold text-sm leading-tight">SMK Prima</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Unggul CBT</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {filteredMenu.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-11 transition-all duration-200",
              location.pathname === item.path 
                ? "bg-primary/10 text-primary hover:bg-primary/15 font-medium" 
                : "text-muted-foreground hover:bg-slate-100"
            )}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={18} />
            <span className="flex-1">{item.title}</span>
            {location.pathname === item.path && <ChevronRight size={14} />}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate">{user.email}</p>
            <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
