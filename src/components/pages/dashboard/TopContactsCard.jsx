import { Link } from "lucide-react";
import { Avatar, Card, SectionHeading } from "../../ui";

/* ── Top contacts (avatar stack — the "Mandatory Payments" slot) ─────── */
export function TopContactsCard({ contacts }) {
    const top = contacts.slice(0, 4);
    const overflow = Math.max(contacts.length - top.length, 0);

    return (
        <Card className="p-6">
            <SectionHeading title="Top Contacts" subtitle="Your key relationships" to="/contacts" />
            {contacts.length === 0 ? (
                <p className="mt-4 text-sm text-ink-soft">No contacts yet.</p>
            ) : (
                <div className="mt-5 flex items-center justify-between">
                    <div className="flex -space-x-3">
                        {top.map((c) => (
                            <Avatar
                                key={c._id}
                                name={c.name}
                                src={c.avatar}
                                size="md"
                                className="ring-2 ring-surface"
                            />
                        ))}
                        {overflow > 0 && (
                            <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-surface">
                                +{overflow}
                            </div>
                        )}
                    </div>
                    <Link
                        href="/contacts"
                        className="text-sm font-medium text-brand-700 hover:underline"
                    >
                        View all
                    </Link>
                </div>
            )}
        </Card>
    );
};