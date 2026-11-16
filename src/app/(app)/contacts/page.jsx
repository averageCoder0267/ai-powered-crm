"use client";
import {
    ConfirmDialog,
    EmptyState,
    PageHeader,
    StatTile
} from "@/components/common";
import {
    ContactCard,
    ContactDrawer,
    ContactFormDialog,
    ContactTableRow,
    TagChip,
    useFlip,
    ViewToggle
} from "@/components/pages/contacts";
import { Button, Card, Spinner } from "@/components/ui";
import { contactsApi } from "@/lib/services";
import { Building2, Contact2, Plus, Search, Star, Tag, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

/* ─── Contacts page ──────────────────────────────────────────────────────────
   Full CRUD management: KPI strip, tag chip filter bar, card/table views,
   drawer detail, add/edit dialog (react-hook-form), delete confirm.
   All filtering is client-side for instant response.
   ──────────────────────────────────────────────────────────────────────────── */

export default function Contacts() {
    // null = loading, [] = empty, [...] = loaded
    const [contacts, setContacts] = useState(null);
    const [filters, setFilters] = useState({ search: "", tag: "" });
    const [view, setView] = useState("grid"); // "grid" | "table"

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);   // contact being edited
    const [selected, setSelected] = useState(null); // contact open in drawer
    const [toDelete, setToDelete] = useState(null); // contact pending deletion
    const [deleting, setDeleting] = useState(false);
    const [favLoading, setFavLoading] = useState({}); // { [id]: bool }

    // Fetch all contacts and store them
    const load = () => {
        setContacts(null);
        contactsApi
            .list()
            .then((res) => setContacts(res.contacts))
            .catch(() => setContacts([]));
    };
    useEffect(load, []);

    // ── Derived data ────────────────────────────────────────────────────

    // Collect unique tags across all contacts for the chip filter row
    const allTags = useMemo(() => {
        if (!contacts) return [];
        const set = new Set();
        contacts.forEach((c) => (c.tags || []).forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, [contacts]);

    // Per-tag counts (from all contacts, not just filtered) for live chip counts
    const tagCounts = useMemo(() => {
        const c = { All: contacts?.length || 0 };
        allTags.forEach((t) => {
            c[t] = (contacts || []).filter((contact) =>
                (contact.tags || []).includes(t)
            ).length;
        });
        return c;
    }, [contacts, allTags]);

    // KPI numbers computed from the full (unfiltered) contacts list
    const kpis = useMemo(() => {
        const list = contacts || [];
        const favorites = list.filter((c) => c.favorite).length;
        const uniqueCompanies = new Set(list.map((c) => c.company).filter(Boolean)).size;
        const tagged = list.filter((c) => (c.tags || []).length > 0).length;
        return { total: list.length, favorites, companies: uniqueCompanies, tagged };
    }, [contacts]);

    // Client-side filtering: search by name/email/company and by tag
    const filtered = useMemo(() => {
        if (!contacts) return [];
        return contacts.filter((c) => {
            if (filters.tag && !(c.tags || []).includes(filters.tag)) return false;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                return (
                    c.name?.toLowerCase().includes(q) ||
                    c.email?.toLowerCase().includes(q) ||
                    c.company?.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [contacts, filters]);

    // Favorites float to the top; everything else keeps its relative order
    // (Array.prototype.sort is stable).
    const ordered = useMemo(
        () => [...filtered].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)),
        [filtered]
    );

    const filtersActive = filters.search || filters.tag;

    // FLIP refs — animate cards/rows sliding to their new position on reorder.
    const gridRef = useFlip(ordered);
    const tableRef = useFlip(ordered);

    // ── Handlers ──────────────────────────────────────────────────────

    const openNew = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (contact) => {
        setSelected(null);
        setEditing(contact);
        setFormOpen(true);
    };

    const handleSaved = () => load();

    // Toggle favorite star — optimistic in-place update (no full reload, so the
    // grid doesn't unmount and the scroll position is preserved).
    const toggleFavorite = async (e, contact) => {
        e.stopPropagation();
        if (favLoading[contact._id]) return;
        const next = !contact.favorite;
        setFavLoading((prev) => ({ ...prev, [contact._id]: true }));
        // Flip the star immediately in local state.
        setContacts((prev) =>
            (prev || []).map((c) => (c._id === contact._id ? { ...c, favorite: next } : c))
        );
        try {
            await contactsApi.update(contact._id, { favorite: next });
        } catch (err) {
            // Revert on failure.
            setContacts((prev) =>
                (prev || []).map((c) =>
                    c._id === contact._id ? { ...c, favorite: !next } : c
                )
            );
            toast.error(err?.message || "Could not update favorite");
        } finally {
            setFavLoading((prev) => ({ ...prev, [contact._id]: false }));
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await contactsApi.remove(toDelete._id);
            toast.success("Contact removed");
            setToDelete(null);
            setSelected(null);
            load();
        } catch (err) {
            toast.error(err?.message || "Delete failed");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* ── Page header ── */}
            <PageHeader
                title="Contacts"
                subtitle="Your people and professional relationships."
            >
                <Button onClick={openNew}>
                    <Plus className="h-4 w-4" /> Add contact
                </Button>
            </PageHeader>

            {/* ── KPI strip ── */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile
                    icon={Users}
                    tint="bg-brand-50 text-brand-600"
                    label="Total contacts"
                    value={kpis.total}
                />
                <StatTile
                    icon={Star}
                    tint="bg-amber-50 text-amber-500"
                    label="Favorites"
                    value={kpis.favorites}
                />
                <StatTile
                    icon={Building2}
                    tint="bg-sky-50 text-sky-600"
                    label="Companies"
                    value={kpis.companies}
                />
                <StatTile
                    icon={Tag}
                    tint="bg-violet-50 text-violet-600"
                    label="Tagged"
                    value={kpis.tagged}
                />
            </div>

            {/* ── Toolbar Card ── */}
            <Card className="space-y-4 p-4">
                {/* Search */}
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    <input
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        placeholder="Search by name, email, or company…"
                        className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
                    />
                </div>

                {/* Tag chips + meta row */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* "All" chip */}
                    <TagChip
                        label="All"
                        count={tagCounts.All}
                        active={!filters.tag}
                        onClick={() => setFilters({ ...filters, tag: "" })}
                    />
                    {/* One chip per unique tag */}
                    {allTags.map((t) => (
                        <TagChip
                            key={t}
                            label={t}
                            count={tagCounts[t] || 0}
                            active={filters.tag === t}
                            onClick={() =>
                                setFilters({ ...filters, tag: filters.tag === t ? "" : t })
                            }
                        />
                    ))}

                    {/* Right-aligned controls */}
                    <div className="ml-auto flex items-center gap-3">
                        {filtersActive && (
                            <button
                                onClick={() => setFilters({ search: "", tag: "" })}
                                className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink"
                            >
                                <X className="h-3.5 w-3.5" /> Clear
                            </button>
                        )}
                        <span className="text-sm text-ink-soft">
                            <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
                            {contacts?.length ?? 0}
                        </span>
                        <ViewToggle view={view} onChange={setView} />
                    </div>
                </div>
            </Card>

            {/* ── Results — loading / empty / grid / table ── */}
            {contacts === null ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={Contact2}
                    title={filtersActive ? "No contacts match" : "No contacts yet"}
                    description={
                        filtersActive
                            ? "Try different search terms or clear the tag filter."
                            : "Add your first contact to start building your network."
                    }
                    action={
                        !filtersActive ? (
                            <Button onClick={openNew}>
                                <Plus className="h-4 w-4" /> Add contact
                            </Button>
                        ) : null
                    }
                />
            ) : view === "grid" ? (
                /* ── Card grid view ── */
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {ordered.map((contact) => (
                        <ContactCard
                            key={contact._id}
                            contact={contact}
                            flipId={contact._id}
                            favLoading={!!favLoading[contact._id]}
                            onToggleFavorite={toggleFavorite}
                            onOpen={() => setSelected(contact)}
                            onEdit={() => openEdit(contact)}
                            onDelete={() => setToDelete(contact)}
                        />
                    ))}
                </div>
            ) : (
                /* ── Table view ── */
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-line bg-surface-muted/40">
                                <tr className="text-left text-xs uppercase tracking-wide text-ink-soft">
                                    <th className="px-6 py-3.5 font-medium">Contact</th>
                                    <th className="px-6 py-3.5 font-medium">Title</th>
                                    <th className="px-6 py-3.5 font-medium">Tags</th>
                                    <th className="px-6 py-3.5 font-medium">Email</th>
                                    <th className="px-6 py-3.5 font-medium">Phone</th>
                                    <th className="px-6 py-3.5 w-24" />
                                </tr>
                            </thead>
                            <tbody ref={tableRef}>
                                {ordered.map((contact) => (
                                    <ContactTableRow
                                        key={contact._id}
                                        contact={contact}
                                        flipId={contact._id}
                                        favLoading={!!favLoading[contact._id]}
                                        onToggleFavorite={toggleFavorite}
                                        onOpen={() => setSelected(contact)}
                                        onEdit={() => openEdit(contact)}
                                        onDelete={() => setToDelete(contact)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* ── Detail Drawer ── */}
            <ContactDrawer
                open={Boolean(selected)}
                contact={selected}
                onClose={() => setSelected(null)}
                onEdit={() => openEdit(selected)}
                onDelete={() => setToDelete(selected)}
            />

            {/* ── Add / Edit Dialog ── */}
            <ContactFormDialog
                open={formOpen}
                contact={editing}
                onClose={() => setFormOpen(false)}
                onSaved={handleSaved}
            />

            {/* ── Delete confirmation ── */}
            <ConfirmDialog
                open={Boolean(toDelete)}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                title="Remove this contact?"
                description={`"${toDelete?.name}" will be permanently deleted and cannot be recovered.`}
                confirmLabel="Remove contact"
            />
        </div>
    );
};