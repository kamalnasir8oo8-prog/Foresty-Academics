function StatCard({ icon: Icon, label, value, sub, color = "blue", large }) {
  /* Soft pastel icon backgrounds with a matching accent and glow */
  const palette = {
    green:  { container: "bg-emerald-100 dark:bg-emerald-900 shadow-emerald-500/40 dark:shadow-emerald-900/50", icon: "text-emerald-600 dark:text-emerald-400", ambient: "bg-emerald-400" },
    blue:   { container: "bg-indigo-100 dark:bg-indigo-900 shadow-indigo-500/40 dark:shadow-indigo-900/50", icon: "text-indigo-600 dark:text-indigo-400", ambient: "bg-indigo-400"  },
    amber:  { container: "bg-amber-100 dark:bg-amber-900 shadow-amber-500/40 dark:shadow-amber-900/50", icon: "text-amber-600 dark:text-amber-400", ambient: "bg-amber-400"   },
    red:    { container: "bg-rose-100 dark:bg-rose-900 shadow-rose-500/40 dark:shadow-rose-900/50", icon: "text-rose-600 dark:text-rose-400", ambient: "bg-rose-400"    },
    purple: { container: "bg-violet-100 dark:bg-violet-900 shadow-violet-500/40 dark:shadow-violet-900/50", icon: "text-violet-600 dark:text-violet-400", ambient: "bg-violet-400"  },
  };
  const c = palette[color] ?? palette.purple;

  return (
    <div className="group relative mt-7">
      {/* ── Icon container — half overlapping the top edge ── */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10">
        <div
          className={`w-14 h-14 rounded-2xl ${c.container}
            flex items-center justify-center
            shadow-lg
            transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5`}
        >
          <Icon className={`w-6 h-6 ${c.icon}`} strokeWidth={2} />
        </div>
      </div>

      {/* ── Card body ── */}
      <div
        className="relative overflow-hidden
          rounded-3xl bg-white dark:bg-gray-900
          border
          border-gray-100 
          dark:border-gray-800
          
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)]
          transition-all duration-300
          px-5 pt-9 pb-5 text-center
          h-full flex flex-col items-center justify-center"
      >
        {/* Inner ambient glow radiating from top-left */}
        <div className={`absolute -top-12 left-1/2 -translate-x-1/2  w-40 h-40 rounded-full blur-[50px] opacity-20 pointer-events-none ${c.ambient}`} />
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none ${c.ambient}`} />

        {/* Title / Label */}
        <p className="relative z-10 text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">{label}</p>

        {/* Subtitle / secondary info */}
        {sub && (
          <span className="relative z-10 inline-block mt-1.5 px-2.5 py-0.5 rounded-full
            bg-gray-100 dark:bg-gray-800
            text-[11px] font-medium text-gray-500 dark:text-gray-400">
            {sub}
          </span>
        )}

        {/* Primary value */}
        <p className={`relative z-10 font-extrabold text-gray-900 dark:text-white leading-none mt-3
          ${large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default StatCard;