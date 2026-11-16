import { cn } from "@/lib/utils";

export function StageChip({ label, count, dot, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                active
                    ? "border-transparent bg-brand-600 text-white shadow-sm"
                    : "border-line bg-surface text-ink-soft hover:text-ink hover:bg-surface-muted"
            )}
        >
            {dot && <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-white" : dot)} />}
            {label}
            <span
                className={cn(
                    "rounded-full px-1.5 text-xs font-semibold",
                    active ? "bg-white/20 text-white" : "bg-surface-muted text-ink-soft"
                )}
            >
                {count}
            </span>
        </button>
    );
};