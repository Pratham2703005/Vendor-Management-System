import { Submission } from "@/lib/types";
import { Dispatch, SetStateAction, useState, useRef } from "react";
import { StatusBadge } from "../badge/StatusBadge";
import toast from "react-hot-toast";
import { MarkdownRenderer } from "../MarkdownRenderer";

export function WriterView({ submissions, setSubmissions }: { submissions: Submission[], setSubmissions: Dispatch<SetStateAction<Submission[]>> }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const [parsedData, setParsedData] = useState<{ title: string; content: string; image_ref?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    const toastId = toast.loading('Parsing document...');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setParsedData(data);
        toast.success('Document parsed successfully', { id: toastId });
      } else {
        toast.error('Parse error: ' + data.error, { id: toastId });
      }
    } catch (err) {
      toast.error('Upload failed', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!parsedData) return;
    setLoading(true);
    const toastId = toast.loading('Submitting...');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Submitted for approval!', { id: toastId });
        setSubmissions((prev: any) => [data.submission, ...prev]);
        setParsedData(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast.error('Error: ' + data.error, { id: toastId });
      }
    } catch (err) {
      toast.error('Submission failed', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Writer Workspace</h2>
        <button onClick={() => window.location.href='/'} className="text-sm text-gray-400 hover:text-white">Logout</button>
      </header>

      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-200">
        <strong>How to use:</strong> Upload a .docx, .txt, or .md file. Review the preview and click "Submit" to send it to a manager.
      </div>

      <div className="glass-card p-8 rounded-2xl border-dashed border-2 border-indigo-500/30 hover:border-indigo-500/50 transition-colors text-center">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload} 
          accept=".docx,.txt,.md"
          className="hidden" 
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer block space-y-4">
          <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-white">Click to upload document</p>
            <p className="text-sm text-gray-400">Support for .docx, .md, .txt</p>
          </div>
        </label>
      </div>

      {loading && <div className="text-center text-indigo-400 animate-pulse">Processing...</div>}

      {parsedData && (
        <div className="glass-card p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-white">Preview</h3>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-green-900/20"
            >
              Submit for Approval
            </button>
          </div>
          
          <div className="bg-surface/50 p-6 rounded-xl border border-white/5 space-y-4">
            {parsedData.image_ref && (
              <div className="mb-4">
                <span className="text-xs font-mono text-pink-400 block mb-1">IMAGE REFERENCE DETECTED</span>
                <div className="bg-black/30 p-2 rounded text-sm text-gray-300 font-mono break-all border border-pink-500/20">
                  {parsedData.image_ref}
                </div>
              </div>
            )}
            <h1 className="text-2xl font-bold text-white border-b border-white/10 pb-4">{parsedData.title}</h1>
            <div className="mb-4 text-gray-300">
                <MarkdownRenderer content={parsedData.content} />
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="mt-12">
        <h3 className="text-lg font-medium text-gray-400 mb-4">Recent Submissions</h3>
        <div className="space-y-3">
          {submissions.map(sub => (
            <div key={sub.id} className="glass rounded-xl overflow-hidden transition-all duration-300">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center hover:bg-white/5"
                onClick={() => toggleExpand(sub.id)}
              >
                  <div className="flex-1 mr-4">
                    <span className="font-medium text-gray-200">{sub.title}</span>
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
          {submissions.length === 0 && <p className="text-gray-500 italic">No submissions yet.</p>}
        </div>
      </div>
    </div>
  );
}
