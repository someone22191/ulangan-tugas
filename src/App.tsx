import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminExams from '@/pages/admin/Exams';
import GuruQuestions from '@/pages/guru/QuestionBank';
import GuruCreateExam from '@/pages/guru/CreateExam';
import SiswaExams from '@/pages/siswa/ExamList';
import TakeExam from '@/pages/siswa/TakeExam';
import Sidebar from '@/components/layout/Sidebar';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* Protected Routes */}
        <Route 
          path="/*" 
          element={
            session ? (
              <div className="flex h-screen bg-slate-50">
                <Sidebar user={session.user} />
                <main className="flex-1 overflow-y-auto p-8">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard session={session} />} />
                    
                    {/* Admin routes */}
                    <Route path="admin/users" element={<AdminUsers />} />
                    <Route path="admin/exams" element={<AdminExams />} />
                    
                    {/* Guru routes */}
                    <Route path="guru/bank-soal" element={<GuruQuestions />} />
                    <Route path="guru/buat-ujian" element={<GuruCreateExam />} />
                    
                    {/* Siswa routes */}
                    <Route path="siswa/daftar-ujian" element={<SiswaExams />} />
                    <Route path="siswa/kerjakan/:id" element={<TakeExam />} />
                    
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}
