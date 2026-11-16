import { AppLayout } from "@/components/layout/app";

export default function ApplicationLayout({ children }) {
    return (
        <AppLayout>
            {children}
        </AppLayout>
    );
};