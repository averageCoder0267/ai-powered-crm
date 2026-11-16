import { AlertTriangle, CalendarClock, Clock } from "lucide-react";
import { Badge, Card, SectionHeading } from "../../ui";
import { shortDate } from "@/lib/format";
import { isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { PRIORITY_STYLES } from "@/lib/constants";

/* ── Upcoming follow-ups (next due tasks) ───────────────────────────── */
export function UpcomingTasks({ tasks }) {
    const upcoming = tasks
        .filter((t) => t.status !== "Completed")
        .sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        })
        .slice(0, 4);

    return (
        <Card className="flex flex-col p-6">
            <SectionHeading
                icon={CalendarClock}
                title="Upcoming Follow-ups"
                subtitle="Don't let these slip"
                to="/tasks"
            />
            {upcoming.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-soft">You're all caught up 🎉</p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {upcoming.map((t) => {
                        const overdue = t.dueDate && isPast(new Date(t.dueDate));
                        return (
                            <li key={t._id} className="flex items-start gap-3">
                                <span
                                    className={cn(
                                        "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                        overdue ? "bg-rose-50 text-rose-600" : "bg-brand-50 text-brand-600"
                                    )}
                                >
                                    {overdue ? (
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                    ) : (
                                        <Clock className="h-3.5 w-3.5" />
                                    )}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                                    <p className={cn("text-xs", overdue ? "text-rose-600" : "text-ink-soft")}>
                                        {t.dueDate ? shortDate(t.dueDate) : "No due date"}
                                        {t.relatedLead?.name ? ` · ${t.relatedLead.name}` : ""}
                                    </p>
                                </div>
                                <Badge className={PRIORITY_STYLES[t.priority]}>{t.priority}</Badge>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
};