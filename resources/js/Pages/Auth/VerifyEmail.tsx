import Button from '@/Components/App/ui/Button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div style={{ marginBottom: 16, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === 'verification-link-sent' && (
                <div style={{ marginBottom: 16, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-success)' }}>
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button variant="primary" disabled={processing}>
                        Resend Verification Email
                    </Button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'underline' }}
                    >
                        Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
