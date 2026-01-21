export function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20',
    approved: 'bg-green-500/20 text-green-300 border-green-500/20',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/20',
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[status] || 'bg-gray-700'}`}>
      {status.toUpperCase()}
    </span>
  );
}