import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function AuthButton() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value

    if (token) {
        return (
            <Link href="/profile" className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-black px-4 py-2 rounded-full font-extrabold text-xs uppercase tracking-wider transition">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
            </Link>
        );
    }

    return (
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 bg-black hover:bg-neutral-800 text-white px-5 py-2 rounded-full font-extrabold text-xs uppercase tracking-wider transition shadow-sm">
            Sign In
        </Link>
    );
}