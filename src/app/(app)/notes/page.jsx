"use client";
import { ConfirmDialog, EmptyState, PageHeader, StatTile } from "@/components/common";
import { FilterChip, NoteCard, NoteFormDialog } from "@/components/pages/notes";
import { Button, Card, Spinner } from "@/components/ui";
import { leadsApi, notesApi } from "@/lib/services";
import { FileText, Link2, Pin, Plus, Search, StickyNote, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

export default function Notes() {
    // ── Data ─────────────────────────────────────────────────────────────────
    const [notes, setNotes] = useState(null);  // null = loading
    const [leads, setLeads] = useState([]);    // lead picker options

    // ── UI state ──────────────────────────────────────────────────────────────
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // "all" | "pinned" | "linked" | "unlinked"
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const load = () => {
        setNotes(null);
        notesApi.list().then((res) => setNotes(res.notes)).catch(() => setNotes([]));
    };

    useEffect(() => {
        load();
        leadsApi.list().then((res) => setLeads(res.leads ?? [])).catch(() => { });
    }, []);

    // ── KPI counts (stable — independent of active filter) ───────────────────
    const kpis = useMemo(() => {
        const list = notes || [];
        return {
            total: list.length,
            pinned: list.filter((n) => n.pinned).length,
            linked: list.filter((n) => n.lead || n.contact).length,
            unlinked: list.filter((n) => !n.lead && !n.contact).length,
        };
    }, [notes]);

    // ── Quick-filter chip counts ──────────────────────────────────────────────
    const chipCounts = useMemo(() => ({
        all: kpis.total,
        pinned: kpis.pinned,
        linked: kpis.linked,
        unlinked: kpis.unlinked,
    }), [kpis]);

    // ── Client-side filtering (search + quick-filter chip) ───────────────────
    const filtered = useMemo(() => {
        if (!notes) return [];
        let list = notes;

        // Quick-filter chip
        if (filter === "pinned") list = list.filter((n) => n.pinned);
        else if (filter === "linked") list = list.filter((n) => n.lead || n.contact);
        else if (filter === "unlinked") list = list.filter((n) => !n.lead && !n.contact);

        // Content search
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((n) => n.content?.toLowerCase().includes(q));
        }

        return list;
    }, [notes, filter, search]);

    const isActive = search.trim() || filter !== "all";

    // ── Handlers ──────────────────────────────────────────────────────────────
    const openNew = () => { setEditing(null); setFormOpen(true); };
    const openEdit = (note) => { setEditing(note); setFormOpen(true); };
    const handleSaved = () => { setFormOpen(false); load(); };

    const handleTogglePin = async (note) => {
        try {
            await notesApi.update(note._id, { pinned: !note.pinned });
            toast.success(note.pinned ? "Note unpinned" : "Note pinned");
            load();
        } catch (err) {
            toast.error(err.message ?? "Could not update note");
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        try {
            await notesApi.remove(toDelete._id);
            toast.success("Note deleted");
            setToDelete(null);
            load();
        } catch (err) {
            toast.error(err.message ?? "Could not delete note");
        } finally {
            setDeleting(false);
        }
    };

    const clearAll = () => { setSearch(""); setFilter("all"); };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Page header */}
            <PageHeader title="Notes" subtitle="Capture context across your deals and contacts.">
                <Button onClick={openNew}>
                    <Plus className="h-4 w-4" /> New note
                </Button>
            </PageHeader>

            {/* KPI strip */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile
                    icon={StickyNote}
                    tint="bg-brand-50 text-brand-600"
                    label="Total notes"
                    value={kpis.total}
                />
                <StatTile
                    icon={Pin}
                    tint="bg-amber-50 text-amber-600"
                    label="Pinned"
                    value={kpis.pinned}
                />
                <StatTile
                    icon={Link2}
                    tint="bg-sky-50 text-sky-600"
                    label="Linked"
                    value={kpis.linked}
                />
                <StatTile
                    icon={FileText}
                    tint="bg-slate-50 text-slate-500"
                    label="Unlinked"
                    value={kpis.unlinked}
                />
            </div>

            {/* Toolbar */}
            <Card className="space-y-4 p-4">
                {/* Search row */}
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notes…"
                        className="h-10 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/60 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                </div>

                {/* Quick-filter chips + result count */}
                <div className="flex flex-wrap items-center gap-2">
                    <FilterChip
                        label="All"
                        count={chipCounts.all}
                        active={filter === "all"}
                        onClick={() => setFilter("all")}
                    />
                    <FilterChip
                        label="Pinned"
                        count={chipCounts.pinned}
                        active={filter === "pinned"}
                        onClick={() => setFilter("pinned")}
                    />
                    <FilterChip
                        label="Linked"
                        count={chipCounts.linked}
                        active={filter === "linked"}
                        onClick={() => setFilter("linked")}
                    />
                    <FilterChip
                        label="Unlinked"
                        count={chipCounts.unlinked}
                        active={filter === "unlinked"}
                        onClick={() => setFilter("unlinked")}
                    />

                    <div className="ml-auto flex items-center gap-3">
                        {isActive && (
                            <button
                                onClick={clearAll}
                                className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft transition hover:text-ink"
                            >
                                <X className="h-3.5 w-3.5" /> Clear
                            </button>
                        )}
                        <span className="text-sm text-ink-soft">
                            <span className="font-semibold text-ink">{filtered.length}</span> of{" "}
                            {notes?.length ?? 0}
                        </span>
                    </div>
                </div>
            </Card>

            {/* Masonry grid / loading / empty */}
            {notes === null ? (
                <div className="flex justify-center py-16">
                    <Spinner />
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={StickyNote}
                    title={isActive ? "No notes match" : "No notes yet"}
                    description={
                        isActive
                            ? "Try adjusting your search or filters."
                            : "Start capturing context for your leads and deals."
                    }
                    action={
                        !isActive ? (
                            <Button onClick={openNew}>
                                <Plus className="h-4 w-4" /> New note
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                /* Masonry via CSS columns */
                <div className="columns-1 sm:columns-2 xl:columns-3 gap-4 *:mb-4">
                    {filtered.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            onEdit={openEdit}
                            onDelete={setToDelete}
                            onTogglePin={handleTogglePin}
                        />
                    ))}
                </div>
            )}

            {/* New / Edit dialog */}
            <NoteFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                note={editing}
                leads={leads}
                onSaved={handleSaved}
            />

            {/* Delete confirmation */}
            <ConfirmDialog
                open={Boolean(toDelete)}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                title="Delete this note?"
                description="This note will be permanently removed and cannot be recovered."
                confirmLabel="Delete note"
            />
        </div>
    );
};