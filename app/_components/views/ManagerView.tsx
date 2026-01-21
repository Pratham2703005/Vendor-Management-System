import { Submission } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";
import { StatusBadge } from "../badge/StatusBadge";

export function ManagerView({ submissions, setSubmissions }: { submissions: Submission[], setSubmissions: Dispatch<SetStateAction<Submission[]>> }) {
  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/respond?id=${id}&action=${action}`);
      if (res.ok || res.redirected) { // API redirects, but fetch might follow or not depending on config, usually we just update state
        setSubmissions((prev: Submission[]) => 
          prev.map(s => s.id === id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pending = submissions.filter(s => s.status === 'pending');
  const history = submissions.filter(s => s.status !== 'pending');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Manager Dashboard</h2>
          <p className="text-gray-400">Review pending content</p>
        </div>
        <button onClick={() => window.location.href='/'} className="text-sm text-gray-400 hover:text-white">Logout</button>
      </header>

      <div className="grid gap-6">
        {/* Pending List */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-white">Pending Approval</h3>
            <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-xs font-bold">{pending.length}</span>
          </div>

          <div className="grid gap-4">
            {pending.map(sub => (
              <div key={sub.id} className="glass-card p-6 rounded-xl border-l-4 border-indigo-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{sub.title}</h4>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{sub.content}</p>
                    {sub.image_ref && (
                      <div className="text-xs text-pink-400 mb-4 bg-pink-500/10 inline-block px-2 py-1 rounded">
                        Has Image: {sub.image_ref.slice(0, 30)}...
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => handleAction(sub.id, 'approve')}
                      className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleAction(sub.id, 'reject')}
                      className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="p-8 text-center border border-dashed border-gray-700 rounded-xl text-gray-500">
                All caught up! No pending submissions.
              </div>
            )}
          </div>
        </section>

        {/* Action History */}
        <section className="mt-8 pt-8 border-t border-white/5">
          <h3 className="text-lg font-medium text-gray-400 mb-4">Past Actions</h3>
          <div className="bg-surface/30 rounded-xl overflow-hidden">
            {history.map(sub => (
              <div key={sub.id} className="p-4 border-b border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors">
                <span className="text-gray-300">{sub.title}</span>
                <StatusBadge status={sub.status} />
              </div>
            ))}
            {history.length === 0 && <div className="p-4 text-gray-500 text-sm">No history yet.</div>}
          </div>
        </section>
      </div>
    </div>
  );
}