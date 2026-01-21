export function DevDeleteBtn({ handleDeleteAll }: { handleDeleteAll: () => void }) {
    return (
        <button
          onClick={handleDeleteAll}
          className="fixed bottom-4 right-4 bg-zinc-900/90 hover:bg-zinc-900 hover:text-gray-400/80 text-gray-400/50 px-4 py-2 rounded-lg text-xs font-bold shadow-lg z-50 border border-zinc-900"
        >
          [DEV] DELETE ALL
        </button>
    )
}