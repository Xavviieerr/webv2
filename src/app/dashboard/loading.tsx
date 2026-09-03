export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 md:gap-6 animate-pulse">
      <div className="w-full rounded-2xl bg-[#D4E8EA] p-6 sm:p-8 lg:p-10 h-48" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#D4E8EA] rounded-xl p-5 sm:p-6 h-44" />
        ))}
      </div>

      <div className="rounded-2xl bg-[#05353A] p-6 sm:p-8 h-48" />
    </div>
  );
}
