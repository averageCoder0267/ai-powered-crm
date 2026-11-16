import { Select } from "@/components/ui";

export function Filter({ value, onChange, all, options }) {
    return (
        <Select value={value} onChange={(e) => onChange(e.target.value)} className="lg:w-40">
            <option value="">{all}</option>
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </Select>
    );
};