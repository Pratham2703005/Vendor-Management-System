export function ErrorBanner({ error }: { error: string }) {
    return (
        <div className="text-red-200 text-sm text-center bg-red-700/10 border border-2 border-red-700/30 p-2 rounded-lg">
          {error == "User not found" ?  "Write 'writer' and 'manager' in the Access ID field" : error}
        </div>
    )
}