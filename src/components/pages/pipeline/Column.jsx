import { currency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { LeadCard } from ".";
import { STAGE_STYLES } from "@/lib/constants";

export function Column({ stage, leads }) {
    const { setNodeRef, isOver } = useDroppable({ id: stage });
    const style = STAGE_STYLES[stage];
    const value = leads.reduce((s, l) => s + (l.value || 0), 0);

    return (
        <div className="flex w-80 shrink-0 flex-col">
            {/* Colored top accent bar */}
            <div className={cn("mb-2 h-1 w-full rounded-full", style.bar)} />

            {/* Column header */}
            <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", style.dot)} />
                    <h3 className="text-sm font-semibold text-ink">{stage}</h3>
                    <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink-soft shadow-sm border border-line">
                        {leads.length}
                    </span>
                </div>
                <span className="text-xs font-medium text-ink-soft">
                    {currency(value, { compact: true })}
                </span>
            </div>

            {/* Droppable column body */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex min-h-[60vh] flex-1 flex-col gap-3 rounded-3xl border-2 border-dashed border-transparent bg-surface-muted/60 p-3 transition",
                    isOver && "border-brand-300 bg-brand-50/60"
                )}
            >
                <SortableContext
                    items={leads.map((l) => l._id)}
                    strategy={verticalListSortingStrategy}
                >
                    {leads.map((lead) => (
                        <SortableCard key={lead._id} lead={lead} />
                    ))}
                </SortableContext>
                {leads.length === 0 && (
                    <p className="mt-6 text-center text-xs text-ink-soft">Drop leads here</p>
                )}
            </div>
        </div>
    );
};

/* ── Sortable card wrapper ──────────────────────────────────────────── */
function SortableCard({ lead }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: lead._id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: transform, transition }}
            className={cn(isDragging && "opacity-40")}
        >
            <LeadCard lead={lead} dragHandle={{ attributes, listeners }} />
        </div>
    );
};