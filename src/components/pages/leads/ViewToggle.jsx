import { cn } from "@/lib/utils";
import { LayoutGrid, Table2 } from "lucide-react";

/* ── Table / grid view toggle ───────────────────────────────────────── */
export function ViewToggle({ view, onChange }) {
    const options = [
        { value: "table", icon: Table2, label: "Table view" },
        { value: "grid", icon: LayoutGrid, label: "Card view" },
    ];
    return (
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface-muted p-1">
            {options.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    title={label}
                    aria-label={label}
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition",
                        view === value ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink"
                    )}
                >
                    <Icon className="h-4 w-4" />
                </button>
            ))}
        </div>
    );
};