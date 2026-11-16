import { Avatar, Badge, Dropdown, DropdownItem } from "@/components/ui";
import { PRIORITY_STYLES, STAGE_STYLES } from "@/lib/constants";
import { currency, relative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Building2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

/* ── Card used in the grid view ─────────────────────────────────────── */
export function GridCard({ lead, selected, onToggle, onOpen, onEdit, onDelete }) {
    const stage = STAGE_STYLES[lead.status] || STAGE_STYLES.New;
    return (
        <div
            onClick={onOpen}
            className={cn(
                "group relative cursor-pointer rounded-2xl border bg-surface p-5 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-pop)]",
                selected ? "border-brand-400 ring-2 ring-brand-500/30" : "border-line"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={lead.name} size="md" />
                    <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{lead.name}</p>
                        <p className="flex items-center gap-1 truncate text-xs text-ink-soft">
                            <Building2 className="h-3 w-3 shrink-0" /> {lead.company || lead.email || "—"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={onToggle}
                        className="h-4 w-4 rounded border-line accent-brand-600"
                        aria-label={`Select ${lead.name}`}
                    />
                    <Dropdown
                        trigger={
                            <button className="rounded-lg p-1.5 text-ink-soft transition hover:bg-surface-muted">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        }
                    >
                        <DropdownItem onClick={() => onEdit(lead)}>
                            <Pencil className="h-4 w-4" /> Edit
                        </DropdownItem>
                        <DropdownItem danger onClick={() => onDelete(lead)}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge className={stage.badge} dot={stage.dot}>
                    {lead.status}
                </Badge>
                <Badge className={PRIORITY_STYLES[lead.priority]}>{lead.priority}</Badge>
                <span className="inline-flex rounded-lg bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-soft">
                    {lead.source}
                </span>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                <div>
                    <p className="text-xs text-ink-soft">Deal value</p>
                    <p className="font-display text-xl font-bold text-ink">{currency(lead.value)}</p>
                </div>
                <span className="text-xs text-ink-soft">{relative(lead.updatedAt)}</span>
            </div>
        </div>
    );
};