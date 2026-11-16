import { Building2, Trophy } from "lucide-react";
import { Card, SectionHeading } from "../../ui";
import { STAGE_STYLES } from "@/lib/constants";
import { currency } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ── Top open deals (highest-value active leads) ────────────────────── */
export function TopDeals({ leads }) {
    const deals = [...leads]
        .filter((l) => l.status !== "Won" && l.status !== "Lost")
        .sort((a, b) => (b.value || 0) - (a.value || 0))
        .slice(0, 5);

    return (
        <Card className="flex flex-col p-6">
            <SectionHeading icon={Trophy} title="Top Open Deals" subtitle="Biggest active opportunities" to="/leads" />
            {deals.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-soft">No open deals yet.</p>
            ) : (
                <ul className="mt-4 space-y-2.5">
                    {deals.map((l, i) => {
                        const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
                        return (
                            <li key={l._id} className="flex items-center gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-ink-soft">
                                    {i + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-ink">{l.name}</p>
                                    <p className="flex items-center gap-1 truncate text-xs text-ink-soft">
                                        <Building2 className="h-3 w-3" /> {l.company || "—"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-ink">
                                        {currency(l.value, { compact: true })}
                                    </p>
                                    <span className={cn("text-[11px] font-medium", style.badge, "bg-transparent px-0")}>
                                        {l.status}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
};