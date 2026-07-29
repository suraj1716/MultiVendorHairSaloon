import Button from '@/Components/App/ui/Button';
import { label, input, err } from '@/Components/App/formStyles';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div style={{ marginBottom: 16, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div style={{ marginBottom: 16, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-success)' }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <label style={label} htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        style={input}
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p style={err}>{errors.email}</p>}
                </div>

                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button variant="primary" disabled={processing}>
                        Email Password Reset Link
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
