import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Simple query to find user
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // Set cookie for simple auth
        (await cookies()).set('user_role', user.role, { httpOnly: true, path: '/' });
        (await cookies()).set('user_id', user.username, { httpOnly: true, path: '/' });

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
