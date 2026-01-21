import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { username } = await request.json();

        // Simple query to find user
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as { role: string } | undefined;

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        // Set cookie for simple auth
        (await cookies()).set('user_role', user.role, { httpOnly: true, path: '/' });
        (await cookies()).set('user_id', username, { httpOnly: true, path: '/' }); // Simplified ID as username for this task

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
