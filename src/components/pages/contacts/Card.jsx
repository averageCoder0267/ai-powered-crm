import { Avatar, Badge, Dropdown, DropdownItem } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Mail, MoreHorizontal, Pencil, Phone, Star, Trash2 } from "lucide-react";

/* ─── ContactCard ────────────────────────────────────────────────────────────
   Single premium contact tile for the card grid view.
   Shows avatar, name, title/company, favorite toggle, tags, email/phone.
   ──────────────────────────────────────────────────────────────────────────── */

export function ContactCard({
    contact,
    flipId,
    favLoading,
    onToggleFavorite,
    onOpen,
    onEdit,
    onDelete,
}) {
    return (
        <div
            data-flip-id={flipId}
            onClick={onOpen}
            className="relative cursor-pointer rounded-2xl border border-line bg-surface p-5 shadow-(--shadow-card) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-pop)"
        >
            {/* Favorite star — top right, stopPropagation so card click doesn't fire */}
            <button
                onClick={(e) => onToggleFavorite(e, contact)}
                disabled={favLoading}
                aria-label={contact.favorite ? "Unmark favorite" : "Mark as favorite"}
                className="absolute right-4 top-4 rounded-lg p-1 text-ink-soft/40 transition hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
            >
                <Star
                    className={cn(
                        "h-4 w-4 transition",
                        contact.favorite ? "fill-amber-400 text-amber-400" : ""
                    )}
                />
            </button>

            {/* Dropdown — positioned below the star */}
            <div
                className="absolute right-3 top-10 mt-1"
                onClick={(e) => e.stopPropagation()}
            >
                <Dropdown
                    trigger={
                        <button className="rounded-lg p-1.5 text-ink-soft/50 transition hover:bg-surface-muted hover:text-ink-soft">
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

            {/* Avatar + identity */}
            <div className="flex items-start gap-3 pr-8">
                <Avatar name={contact.name} size="md" />
                <div className="min-w-0">
                    <p className="font-semibold text-ink leading-tight truncate">
                        {contact.name}
                    </p>
                    {(contact.title || contact.company) && (
                        <p className="mt-0.5 text-sm text-ink-soft truncate">
                            {[contact.title, contact.company].filter(Boolean).join(" · ")}
                        </p>
                    )}
                </div>
            </div>

            {/* Tags */}
            {contact.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {contact.tags.slice(0, 3).map((tag) => (
                        <Badge
                            key={tag}
                            className="bg-brand-50 text-brand-700 text-[11px] px-2 py-0.5"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {contact.tags.length > 3 && (
                        <Badge className="bg-surface-muted text-ink-soft text-[11px] px-2 py-0.5">
                            +{contact.tags.length - 3}
                        </Badge>
                    )}
                </div>
            )}

            {/* Contact info rows */}
            <div className="mt-3 space-y-1.5">
                {contact.email && (
                    <div className="flex items-center gap-2 text-sm text-ink-soft min-w-0">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{contact.email}</span>
                    </div>
                )}
                {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-ink-soft">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{contact.phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
};