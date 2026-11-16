import { Avatar } from "@/components/ui";
import { PRIORITY_STYLES } from "@/lib/constants";
import { currency } from "@/lib/format";
import { aiApi } from "@/lib/services";
import { cn } from "@/lib/utils";
import { Badge, Building2, GripVertical, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


/* ── Card UI ────────────────────────────────────────────────────────── */
export function LeadCard({ lead, dragHandle, overlay }) {
    const [suggesting, setSuggesting] = useState(false);

    // AI: suggest the next best action / priority for this lead.
    const suggest = async (e) => {
        e.stopPropagation();
        setSuggesting(true);
        try {
            const res = await aiApi.leadSummary({ leadId: lead._id });
            toast(`AI suggestion for ${lead.name}`, {
                description: `${res.nextBestAction} (suggested priority: ${res.suggestedPriority})`,
                duration: 7000,
            });
        } catch (err) {
            toast.error(err.message || "AI unavailable");
        } finally {
            setSuggesting(false);
        }
    };

    return (
        <div
            className={cn(
                "group rounded-2xl bg-surface p-3.5 shadow-(--shadow-soft) transition border border-line/60",
                overlay ? "shadow-(--shadow-pop) rotate-2" : "hover:shadow-(--shadow-card)"
            )}
        >
            {/* Name / company row + drag handle */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <Avatar name={lead.name} size="sm" />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{lead.name}</p>
                        <p className="flex items-center gap-1 truncate text-xs text-ink-soft">
                            <Building2 className="h-3 w-3 shrink-0" />
                            {lead.company || "—"}
                        </p>
                    </div>
                </div>
                {dragHandle && (
                    <button
                        {...dragHandle.attributes}
                        {...dragHandle.listeners}
                        className="cursor-grab text-ink-soft/50 transition hover:text-ink-soft active:cursor-grabbing"
                        aria-label="Drag"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Value + priority */}
            <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-ink">{currency(lead.value)}</span>
                <Badge className={PRIORITY_STYLES[lead.priority]}>{lead.priority}</Badge>
            </div>

            {/* AI suggest button — appears on hover, hidden in DragOverlay */}
            {!overlay && (
                <button
                    onClick={suggest}
                    disabled={suggesting}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-50 py-1.5 text-xs font-medium text-brand-700 opacity-0 transition group-hover:opacity-100 hover:bg-brand-100 disabled:opacity-60"
                >
                    <Sparkles className={cn("h-3.5 w-3.5", suggesting && "animate-pulse")} />
                    {suggesting ? "Thinking…" : "AI suggest next step"}
                </button>
            )}
        </div>
    );
};