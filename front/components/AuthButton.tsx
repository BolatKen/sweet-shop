import { cookies } from 'next/headers'
import Link from 'next/link'
import { logoutUser } from '@/lib/actions/auth'

export default async function AuthButton() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value

    if (token) {
        return(
            <form action={logoutUser}>
                <button type="submit" className="text-black px-6 py-2 rounded-md hover:text-gray-500">
                Log out
                </button>
            </form>
        );
    }
    return(
            <Link href='/auth/login'>
                <button className="bg-red-600 text-white px-8 py-2 rounded-md hover:bg-red-500">
                      Login
                </button>
            </Link>
        );
}