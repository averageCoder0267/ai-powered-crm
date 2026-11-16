import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

/* ─── StatTile ───────────────────────────────────────────────────────────────
   KPI card: tinted icon square + label + large value.
   ──────────────────────────────────────────────────────────────────────────── */

export function StatTile({ icon: Icon, label, value, tint }) {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", tint)}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-xs text-ink-soft">{label}</p>
                    <p className="font-display text-lg font-bold text-ink">{value}</p>
                </div>
            </div>
        </Card>
    );
};