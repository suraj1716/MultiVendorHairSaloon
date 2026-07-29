import Button from '@/Components/App/ui/Button';
import { label, input, err } from '@/Components/App/formStyles';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                    <label style={label} htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        style={input}
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p style={err}>{errors.email}</p>}
                </div>

                <div>
                    <label style={label} htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        style={input}
                        value={data.password}
                        autoComplete="new-password"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <p style={err}>{errors.password}</p>}
                </div>

                <div>
                    <label style={label} htmlFor="password_confirmation">Confirm Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        style={input}
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    {errors.password_confirmation && <p style={err}>{errors.password_confirmation}</p>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button variant="primary" disabled={processing}>
                        Reset Password
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
