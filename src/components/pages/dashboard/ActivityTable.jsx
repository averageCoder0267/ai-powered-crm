import { currency, shortDate, timeOf } from "@/lib/format";
import { Avatar } from "../../ui";
import { STAGE_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/* ── Recent activity table (Payment History style) ──────────────────── */
export function ActivityTable({ leads }) {
    if (!leads.length)
        return <p className="py-10 text-center text-sm text-ink-soft">No recent activity yet.</p>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-ink-soft">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="hidden pb-3 font-medium sm:table-cell">Time</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 text-right font-medium">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((l) => {
                        const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
                        return (
                            <tr
                                key={l.id}
                                className="border-t border-line transition hover:bg-surface-muted/50"
                            >
                                <td className="py-3.5">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={l.name} size="sm" />
                                        <div>
                                            <p className="font-medium text-ink">{l.name}</p>
                                            <p className="text-xs text-ink-soft">{l.company || "—"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3.5 text-ink-soft">{shortDate(l.updatedAt)}</td>
                                <td className="hidden py-3.5 text-ink-soft sm:table-cell">
                                    {timeOf(l.updatedAt)}
                                </td>
                                <td className="py-3.5">
                                    <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                                        <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                                        {l.status}
                                    </span>
                                </td>
                                <td className="py-3.5 text-right font-semibold text-ink">
                                    {currency(l.value)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};