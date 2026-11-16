import { Button, Dialog, Field, Input, Textarea } from "@/components/ui";
import { contactsApi } from "@/lib/services";
import { Star, Tag } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

/* ─── ContactFormDialog ──────────────────────────────────────────────────────
   Add / Edit dialog backed by react-hook-form.
   Tags are entered as a comma-separated string and split on submit.
   ──────────────────────────────────────────────────────────────────────────── */

export function ContactFormDialog({ open, contact, onClose, onSaved }) {
    const isEdit = Boolean(contact);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    // Reset form defaults when dialog opens or the editing target changes
    useEffect(() => {
        if (open) {
            reset(
                contact
                    ? {
                        name: contact.name || "",
                        title: contact.title || "",
                        company: contact.company || "",
                        email: contact.email || "",
                        phone: contact.phone || "",
                        tags: (contact.tags || []).join(", "),
                        notes: contact.notes || "",
                        favorite: contact.favorite || false,
                    }
                    : {
                        name: "",
                        title: "",
                        company: "",
                        email: "",
                        phone: "",
                        tags: "",
                        notes: "",
                        favorite: false,
                    }
            );
        }
    }, [open, contact, reset]);

    const onSubmit = async (values) => {
        // Parse comma-separated tags into a clean array
        const tags = values.tags
            ? values.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];

        const payload = { ...values, tags };

        try {
            if (isEdit) {
                await contactsApi.update(contact._id, payload);
                toast.success("Contact updated");
            } else {
                await contactsApi.create(payload);
                toast.success("Contact added");
            }
            onSaved();
            onClose();
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={isEdit ? "Edit contact" : "New contact"}
            description={
                isEdit
                    ? "Update the details below."
                    : "Fill in the details to add a new contact."
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                {/* Name (required) */}
                <Field label="Full name" error={errors.name?.message}>
                    <Input
                        {...register("name", { required: "Name is required" })}
                        placeholder="Jane Doe"
                        autoFocus
                    />
                </Field>

                {/* Title + Company in a two-column row */}
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Title">
                        <Input {...register("title")} placeholder="Head of Design" />
                    </Field>
                    <Field label="Company">
                        <Input {...register("company")} placeholder="Acme Inc." />
                    </Field>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Email">
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder="jane@acme.com"
                        />
                    </Field>
                    <Field label="Phone">
                        <Input
                            {...register("phone")}
                            type="tel"
                            placeholder="+1 555 000 0000"
                        />
                    </Field>
                </div>

                {/* Tags — comma-separated */}
                <Field label="Tags" error={errors.tags?.message}>
                    <div className="relative">
                        <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                        <Input
                            {...register("tags")}
                            placeholder="e.g. client, vip, partner"
                            className="pl-10"
                        />
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">
                        Separate multiple tags with commas.
                    </p>
                </Field>

                {/* Notes */}
                <Field label="Notes">
                    <Textarea
                        {...register("notes")}
                        placeholder="Any relevant context, history, or reminders…"
                        rows={3}
                    />
                </Field>

                {/* Favorite toggle */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 transition hover:bg-surface-muted select-none">
                    <input
                        type="checkbox"
                        {...register("favorite")}
                        className="h-4 w-4 rounded accent-brand-600"
                    />
                    <div>
                        <p className="text-sm font-medium text-ink">Mark as favorite</p>
                        <p className="text-xs text-ink-soft">
                            Starred contacts appear highlighted in your grid.
                        </p>
                    </div>
                    <Star className="ml-auto h-4 w-4 text-amber-400" />
                </label>

                {/* Form actions */}
                <div className="flex gap-3 pt-1">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" loading={isSubmitting}>
                        {isEdit ? "Save changes" : "Add contact"}
                    </Button>
                </div>
            </form>
        </Dialog>
    );
};