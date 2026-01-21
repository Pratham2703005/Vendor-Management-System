'use client';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { DevDeleteBtn } from '../_components/buttons/DevDeleteBtn';
import { ManagerView, WriterView } from '../_components/views';
import { Submission } from '@/lib/types';

export function DashboardClient({ role }: { role: string }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => {
        if (data.submissions) setSubmissions(data.submissions);
      })
      .catch(console.error);
  }, []);

  const handleDeleteAll = async () => {
    await fetch('/api/admin/reset', { method: 'POST' });
    setSubmissions([]);
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#181b21',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        },
      }} />
      {role === 'manager' ? (
        <ManagerView submissions={submissions} setSubmissions={setSubmissions} />
      ) : (
        <WriterView submissions={submissions} setSubmissions={setSubmissions} />
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <DevDeleteBtn handleDeleteAll={handleDeleteAll} />
      )}
    </>
  );
}

