import { useState, useEffect } from 'react';

interface StaffMember {
    id: number;
    name: string;
    position: string | null;
    photo_url: string | null;
    available: boolean;
}

interface StaffSelectStepProps {
    vendorId: number;
    categoryId?: number;
    selectedStaffId: number | null;
    onSelect: (staffId: number | null, staffName?: string | null) => void;
    date: string;
    timeSlot: string;
}

export default function StaffSelectStep({
    vendorId,
    date,
    timeSlot,
    categoryId,
    selectedStaffId,
    onSelect,
}: StaffSelectStepProps) {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams({ vendor_id: String(vendorId) });
        if (categoryId) params.append('category_id', String(categoryId));
        if (date) params.append('date', date);
        if (timeSlot) params.append('time_slot', timeSlot);

        fetch(`/staff-for-booking?${params.toString()}`, {
            headers: { Accept: 'application/json' },
        })
            .then((res) => res.json())
            .then((data) => {
                setStaff(data);

                const stillAvailable = data.find(
                    (s: StaffMember) => s.id === selectedStaffId && s.available
                );
                if (selectedStaffId !== null && !stillAvailable) {
                    onSelect(null, null);
                }
            })
            .finally(() => setLoading(false));
    }, [vendorId, categoryId, date, timeSlot]);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            width: '100px',
                            height: '90px',
                            borderRadius: '8px',
                            background: '#f0f0f0',
                            animation: 'pulse 1.2s ease-in-out infinite',
                        }}
                    />
                ))}
                <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h3>Choose your staff member (optional)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                    type="button"
                    onClick={() => onSelect(null, null)}
                    style={{
                        border: selectedStaffId === null ? '2px solid var(--color-primary)' : '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        background: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    No preference
                </button>

                {staff.map((member) => {
                    const isBooked = !member.available;
                    const isSelected = selectedStaffId === member.id;

                    return (
                        <button
                            key={member.id}
                            type="button"
                            disabled={isBooked}
                            onClick={() => !isBooked && onSelect(member.id, member.name)}
                            style={{
                                border: isSelected ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '0.75rem 1rem',
                                background: isBooked ? '#f5f5f5' : '#fff',
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                color: isBooked ? '#999' : 'inherit',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                minWidth: '100px',
                            }}
                        >
                            {member.photo_url && (
                                <img
                                    src={member.photo_url}
                                    alt={member.name}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        opacity: isBooked ? 0.5 : 1,
                                    }}
                                />
                            )}
                            <span>{member.name}</span>
                            {member.position && (
                                <span style={{ fontSize: '0.75rem', color: '#888' }}>{member.position}</span>
                            )}
                            {isBooked && (
                                <span style={{ fontSize: '0.7rem', color: '#e53e3e' }}>Unavailable at Selected Time</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
