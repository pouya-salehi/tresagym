export default function ClientModalSkeleton() {
  const items = Array(7).fill(0);

  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-6 bg-gradient-to-r from-gray-700/40 via-gray-600/30 to-gray-700/40 rounded-md w-1/3 mx-auto mb-5" />
      {items.map((_, i) => (
        <div
          key={i}
          className="h-10 w-full bg-gradient-to-r from-gray-700/30 via-gray-600/20 to-gray-700/30 rounded-xl shadow-inner"
        />
      ))}
      <div className="mt-6 h-3 w-2/5 bg-gradient-to-r from-amber-400/50 via-yellow-300/40 to-amber-400/50 rounded-full mx-auto shadow-[0_0_15px_rgba(255,193,7,0.5)]" />
    </div>
  );
}
