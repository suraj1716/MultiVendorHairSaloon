import { useState, useEffect } from 'react';

interface StaffMember {
    id: number;
    name: string;
    position: string | null;
    photo_url: string | null;
}

interface StaffSelectStepProps {
    vendorId: number;
    categoryId?: number;
    selectedStaffId: number | null;
    onSelect: (staffId: number | null, staffName?: string | null) => void; // ← updated signature
}

export default function StaffSelectStep({ vendorId, categoryId, selectedStaffId, onSelect }: StaffSelectStepProps) {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({ vendor_id: String(vendorId) });
        if (categoryId) params.append('category_id', String(categoryId));

        fetch(`/staff-for-booking?${params.toString()}`)
            .then((res) => res.json())
            .then(setStaff)
            .finally(() => setLoading(false));
    }, [vendorId, categoryId]);

    if (loading) return <p>Loading staff...</p>;

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h3>Choose your staff member (optional)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                    type="button"
                    onClick={() => onSelect(null, null)}
                    style={{
                        border: selectedStaffId === null ? '2px solid var(--color-primary)' : '1px solid #ddd',
                        borderRadius: '8px', padding: '0.75rem 1rem', background: '#fff', cursor: 'pointer',
                    }}
                >
                    No preference
                </button>

                {staff.map((member) => (
                    <button
                        type="button"
                        key={member.id}
                        onClick={() => onSelect(member.id, member.name)}
                        style={{
                            border: selectedStaffId === member.id ? '2px solid var(--color-primary)' : '1px solid #ddd',
                            borderRadius: '8px', padding: '0.75rem 1rem', background: '#fff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}
                    >
                        {member.photo_url && (
                            <img src={member.photo_url} alt={member.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                        )}
                        <span>
                            {member.name}
                            {member.position && <small style={{ display: 'block', color: '#888' }}>{member.position}</small>}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
