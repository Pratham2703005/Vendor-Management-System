import { Submission } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";
import { StatusBadge } from "../badge/StatusBadge";
import { MarkdownRenderer } from "../MarkdownRenderer";

export function ManagerView({ submissions, setSubmissions }: { submissions: Submission[], setSubmissions: Dispatch<SetStateAction<Submission[]>> }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-200 text-center">
            <strong>UI Guide:</strong> Review submissions below. Use the "Approve" (Green) or "Reject" (Red) buttons to make a decision.
            <br />
            Content is limited to the first 1000 words for efficiency. Email notifications contain a 10-word summary.
          </div>

      <div className="grid gap-6">
        {/* Pending List */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-white">Pending Approval</h3>
            <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-xs font-bold">{pending.length}</span>
          </div>

          <div className="grid gap-4">
            {pending.map(sub => (
              <div key={sub.id} className="glass-card rounded-xl border-l-4 border-indigo-500 overflow-hidden transition-all duration-300">
                {/* Header / Summary */}
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center hover:bg-white/5"
                  onClick={() => toggleExpand(sub.id)}
                >
                  <div className="flex-1 mr-4">
                    <h4 className="text-xl font-bold text-white mb-1 flex items-center gap-3">
                      {sub.title}
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-surface border border-white/10 text-gray-400 transition-transform duration-300 ${expandedId === sub.id ? 'rotate-180' : ''}`}>
                         ▼
                      </span>
                    </h4>
                    {!expandedId || expandedId !== sub.id ? (
                       <p className="text-gray-400 text-sm line-clamp-1">
                         {sub.content.slice(0, 100)}...
                       </p>
                    ) : null}
                  </div>
                  
                  {/* Action Buttons in Header */}
                  <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAction(sub.id, 'approve'); }}
                        className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded text-sm transition-colors border border-green-500/20"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAction(sub.id, 'reject'); }}
                        className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded text-sm transition-colors border border-red-500/20"
                      >
                        Reject
                      </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === sub.id && (
                  <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2">
                    <div className="h-px bg-white/10 mb-4"></div>
                    
                    <div className="mb-4 text-gray-300">
                      <MarkdownRenderer content={sub.content} />
                    </div>
                    
                    {sub.image_ref && (
                      <div className="text-xs text-pink-400 mb-6 bg-pink-500/10 inline-block px-3 py-2 rounded border border-pink-500/20">
                        <strong>Image Reference:</strong> {sub.image_ref}
                      </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(sub.id, 'approve'); }}
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-green-900/20"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAction(sub.id, 'reject'); }}
                          className="px-6 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 font-medium"
                        >
                          Reject
                        </button>
                    </div>
                  </div>
                )}
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
          <div className="grid gap-3">
            {history.map(sub => (
              <div key={sub.id} className="glass rounded-xl overflow-hidden transition-all duration-300">
                 <div 
                  className="p-4 cursor-pointer flex justify-between items-center hover:bg-white/5"
                  onClick={() => toggleExpand(sub.id)}
                >
                  <div className="flex-1 mr-4">
                    <span className="text-gray-200 font-medium">{sub.title}</span>
                    <span className="text-gray-500 text-sm ml-2">- {new Date(sub.created_at).toLocaleDateString()}</span>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>

                {expandedId === sub.id && (
                  <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-1 bg-black/20">
                     <div className="h-px bg-white/5 mb-3"></div>
                     
                     <div className="mb-4 text-gray-300">
                        <MarkdownRenderer content={sub.content} />
                     </div>

                     {sub.image_ref && (
                      <div className="mt-3 text-xs text-pink-400/70 border border-pink-500/10 inline-block px-2 py-1 rounded">
                        Reference: {sub.image_ref}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {history.length === 0 && <div className="p-4 text-gray-500 text-sm">No history yet.</div>}
          </div>
        </section>
      </div>
    </div>
  );
}