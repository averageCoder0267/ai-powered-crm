export function ChartTooltip({ active, payload, label, prefix = "", unit = "" }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-line bg-surface px-3 py-2 shadow-[var(--shadow-pop)]">
            <p className="text-xs font-medium text-ink-soft">{label}</p>
            <p className="text-sm font-semibold text-ink">
                {prefix}
                {Number(payload[0].value).toLocaleString()}
                {unit}
            </p>
        </div>
    );
};