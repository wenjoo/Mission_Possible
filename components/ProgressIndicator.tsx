type ProgressIndicatorProps = {
  current: number;
  total: number;
};

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(1, current), safeTotal);
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
      <span className="rounded-full bg-[var(--ink)]/5 px-3 py-1">
        Scene {safeCurrent} of {safeTotal}
      </span>
      <span className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--ink)]/10">
        <span
          className="block h-full rounded-full bg-[var(--accent)]/80 transition-all duration-500"
          style={{ width: `${(safeCurrent / safeTotal) * 100}%` }}
        />
      </span>
    </div>
  );
}
