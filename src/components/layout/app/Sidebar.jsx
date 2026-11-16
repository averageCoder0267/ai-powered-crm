"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Contact2,
  KanbanSquare,
  StickyNote,
  CalendarCheck,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

import { cn } from "../../../lib/utils";
import { useAuth } from "../../../context/AuthContext";

/* Primary navigation — icon + label rail, matching the reference sidebar. */
const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/contacts", label: "Contacts", icon: Contact2 },
  { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/tasks", label: "Follow-ups", icon: CalendarCheck },
];

export function Sidebar({ onNavigate }) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    router.push("/login");
  };

  const isActive = (to, end) => {
    if (end)
      return pathname === to;
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const linkClass = (active) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
      active
        ? "bg-brand-50 text-brand-700"
        : "text-ink-soft hover:bg-surface-muted hover:text-ink"
    );

  return (
    <aside className="flex h-full w-64 flex-col bg-surface border-r border-line">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="font-display text-lg font-bold text-ink">
          AI-Powered CRM
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => {
          const active = isActive(to, end);

          return (
            <Link
              key={to}
              href={to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={linkClass(active)}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="space-y-1 border-t border-line p-3">
        <Link
          href="/settings"
          onClick={onNavigate}
          aria-current={
            isActive("/settings") ? "page" : undefined
          }
          className={linkClass(isActive("/settings"))}
        >
          <Settings className="h-4.5 w-4.5" />
          Settings
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </div>
    </aside>
  );
};