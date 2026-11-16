import { Avatar, Dropdown, DropdownItem } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Badge, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";

/* ─── ContactTableRow ────────────────────────────────────────────────────────
   Single row for the table view.
   ──────────────────────────────────────────────────────────────────────────── */

export function ContactTableRow({
    contact,
    flipId,
    favLoading,
    onToggleFavorite,
    onOpen,
    onEdit,
    onDelete,
}) {
    return (
        <tr
            data-flip-id={flipId}
            onClick={onOpen}
            className="group cursor-pointer border-b border-line last:border-0 transition hover:bg-surface-muted/50"
        >
            {/* Contact (avatar + name + company) */}
            <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                    <Avatar name={contact.name} size="sm" />
                    <div>
                        <p className="font-medium text-ink">{contact.name}</p>
                        <p className="text-xs text-ink-soft">
                            {contact.company || contact.email || "—"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Title */}
            <td className="px-6 py-3.5 text-sm text-ink-soft">
                {contact.title || "—"}
            </td>

            {/* Tags */}
            <td className="px-6 py-3.5">
                <div className="flex flex-wrap gap-1">
                    {(contact.tags || []).slice(0, 2).map((tag) => (
                        <Badge
                            key={tag}
                            className="bg-brand-50 text-brand-700 text-[11px] px-2 py-0.5"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {(contact.tags || []).length > 2 && (
                        <Badge className="bg-surface-muted text-ink-soft text-[11px] px-2 py-0.5">
                            +{contact.tags.length - 2}
                        </Badge>
                    )}
                    {!(contact.tags?.length) && (
                        <span className="text-xs text-ink-soft/50">—</span>
                    )}
                </div>
            </td>

            {/* Email */}
            <td className="px-6 py-3.5 text-sm text-ink-soft">
                {contact.email ? (
                    <a
                        href={`mailto:${contact.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-brand-700 hover:underline transition"
                    >
                        {contact.email}
                    </a>
                ) : (
                    "—"
                )}
            </td>

            {/* Phone */}
            <td className="px-6 py-3.5 text-sm text-ink-soft">
                {contact.phone || "—"}
            </td>

            {/* Actions */}
            <td className="px-6 py-3.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                    {/* Favorite star */}
                    <button
                        onClick={(e) => onToggleFavorite(e, contact)}
                        disabled={favLoading}
                        aria-label={contact.favorite ? "Unmark favorite" : "Mark as favorite"}
                        className="rounded-lg p-1.5 text-ink-soft/40 transition hover:text-amber-400"
                    >
                        <Star
                            className={cn(
                                "h-4 w-4 transition",
                                contact.favorite ? "fill-amber-400 text-amber-400" : ""
                            )}
                        />
                    </button>
                    <Dropdown
                        trigger={
                            <button className="rounded-lg p-1.5 text-ink-soft transition hover:bg-surface-muted">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        }
                    >
                        <DropdownItem onClick={onEdit}>
                            <Pencil className="h-4 w-4" /> Edit
                        </DropdownItem>
                        <DropdownItem danger onClick={onDelete}>
                            <Trash2 className="h-4 w-4" /> Delete
                        </DropdownItem>
                    </Dropdown>
                </div>
            </td>
        </tr>
    );
};