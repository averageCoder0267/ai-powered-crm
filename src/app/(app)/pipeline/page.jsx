"use client";
import { PageHeader, StatTile } from "@/components/common";
import { Column, LeadCard } from "@/components/pages/pipeline";
import { Spinner } from "@/components/ui";
import { PIPELINE_STAGES } from "@/lib/constants";
import { currency } from "@/lib/format";
import { leadsApi } from "@/lib/services";
import { closestCorners, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DollarSign, Layers, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

/* Group a flat lead list into { stage: Lead[] } buckets. */
const toBoard = (leads) => {
    const board = Object.fromEntries(PIPELINE_STAGES.map((s) => [s, []]));
    for (const l of leads) (board[l.status] || board.New).push(l);
    return board;
};

export default function Pipeline() {
    const [board, setBoard] = useState(null);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    useEffect(() => {
        leadsApi
            .list()
            .then((res) => setBoard(toBoard(res.leads)))
            .catch(() => setBoard(toBoard([])));
    }, []);

    if (!board) return <Spinner />;

    const findContainer = (id) => {
        if (id in board) return id;
        return PIPELINE_STAGES.find((s) => board[s].some((l) => l._id === id));
    };

    const activeLead = activeId
        ? Object.values(board).flat().find((l) => l._id === activeId)
        : null;

    /* Move cards between columns live as the user drags over them. */
    const handleDragOver = ({ active, over }) => {
        if (!over) return;
        const from = findContainer(active.id);
        const to = findContainer(over.id);
        if (!from || !to || from === to) return;

        setBoard((prev) => {
            const fromItems = [...prev[from]];
            const toItems = [...prev[to]];
            const idx = fromItems.findIndex((l) => l._id === active.id);
            if (idx === -1) return prev;
            const [moved] = fromItems.splice(idx, 1);
            moved.status = to;
            // Insert near the hovered card (or append if hovering the column).
            const overIdx = toItems.findIndex((l) => l._id === over.id);
            toItems.splice(overIdx === -1 ? toItems.length : overIdx, 0, moved);
            return { ...prev, [from]: fromItems, [to]: toItems };
        });
    };

    /* Persist the final ordering + stage to the backend. */
    const handleDragEnd = ({ active, over }) => {
        setActiveId(null);
        if (!over) return;
        const container = findContainer(over.id);
        if (!container) return;

        setBoard((prev) => {
            const items = [...prev[container]];
            const oldIdx = items.findIndex((l) => l._id === active.id);
            const newIdx = items.findIndex((l) => l._id === over.id);
            const reordered =
                oldIdx !== -1 && newIdx !== -1 ? arrayMove(items, oldIdx, newIdx) : items;
            const next = { ...prev, [container]: reordered };

            // Build the persistence payload across all affected columns.
            const updates = [];
            PIPELINE_STAGES.forEach((stage) => {
                next[stage].forEach((l, order) =>
                    updates.push({ id: l._id, status: stage, order })
                );
            });
            leadsApi.reorder(updates).catch(() => toast.error("Could not save pipeline"));
            return next;
        });
    };

    /* ── KPI computations ─────────────────────────────────────────────── */
    const allLeads = Object.values(board).flat();
    const totalValue = allLeads.reduce((s, l) => s + (l.value || 0), 0);
    const openDeals = allLeads.filter((l) => l.status !== "Won" && l.status !== "Lost");
    const wonLeads = allLeads.filter((l) => l.status === "Won");
    const wonValue = wonLeads.reduce((s, l) => s + (l.value || 0), 0);
    const closedCount = wonLeads.length + (board.Lost?.length || 0);
    const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pipeline"
                subtitle={`${allLeads.length} leads · ${currency(totalValue, { compact: true })} in play`}
            />

            {/* KPI summary strip */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatTile
                    icon={DollarSign}
                    tint="bg-brand-50 text-brand-600"
                    label="Total pipeline"
                    value={currency(totalValue, { compact: true })}
                />
                <StatTile
                    icon={Layers}
                    tint="bg-sky-50 text-sky-600"
                    label="Open deals"
                    value={openDeals.length}
                />
                <StatTile
                    icon={Target}
                    tint="bg-emerald-50 text-emerald-600"
                    label="Won value"
                    value={currency(wonValue, { compact: true })}
                />
                <StatTile
                    icon={TrendingUp}
                    tint="bg-violet-50 text-violet-600"
                    label="Win rate"
                    value={`${winRate}%`}
                />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={({ active }) => setActiveId(active.id)}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
            >
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {PIPELINE_STAGES.map((stage) => (
                        <Column key={stage} stage={stage} leads={board[stage]} />
                    ))}
                </div>

                <DragOverlay>
                    {activeLead ? <LeadCard lead={activeLead} overlay /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}