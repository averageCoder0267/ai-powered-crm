
"use client";
import {
    LayoutGrid,
    Users,
    Contact2,
    KanbanSquare,
    StickyNote,
    CalendarCheck,
    Settings,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const NAV = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { to: "/leads", label: "Leads", icon: Users },
    { to: "/contacts", label: "Contacts", icon: Contact2 },
    { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
    { to: "/notes", label: "Notes", icon: StickyNote },
    { to: "/tasks", label: "Follow-ups", icon: CalendarCheck },
];

function RailLink({ to, label, icon: Icon }) {
    const pathname = usePathname();

    // Exact match for Dashboard; prefix match for nested routes.
    const isActive =
        to === "/"
            ? pathname === "/"
            : pathname === to || pathname.startsWith(`${to}/`);

    return (
        <Link
            href={to}
            title={label}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-2xl transition",
                isActive
                    ? "brand-gradient text-white shadow-sm"
                    : "text-ink-soft hover:bg-surface-muted hover:text-ink"
            )}
        >
            <Icon className="h-5 w-5" />

            {/* Tooltip on hover */}
            <span className="pointer-events-none z-1000 absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 lg:block">
                {label}
            </span>
        </Link>
    );
}

export function IconRail() {
    const { logout } = useAuth();
    const router = useRouter();

    function handleLogout() {
        logout();
        router.push("/login");
    };

    return (
        <aside className="flex h-full flex-col items-center justify-center gap-2 py-4">
            {/* Primary navigation */}
            <nav
                aria-label="Main navigation"
                className="flex flex-col items-center gap-2"
            >
                {NAV.map((item) => (
                    <RailLink key={item.to} {...item} />
                ))}
            </nav>

            {/* Divider */}
            <div className="my-1 h-px w-6 bg-line" />

            {/* Settings */}
            <RailLink
                to="/settings"
                label="Settings"
                icon={Settings}
            />

            {/* Logout */}
            <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="group relative flex h-11 w-11 items-center justify-center rounded-2xl text-ink-soft transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
            >
                <LogOut className="h-5 w-5" />

                {/* Tooltip on hover */}
                <span className="pointer-events-none z-1000 absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 lg:block">
                    Log Out
                </span>
            </button>
        </aside>
    );
};