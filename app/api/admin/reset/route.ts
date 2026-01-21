import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST() {
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
    }

    try {
        db.prepare('DELETE FROM submissions').run();
        // Reset sequence if desired, but not strictly necessary for simple clean
        db.prepare('DELETE FROM sqlite_sequence WHERE name="submissions"').run();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to reset' }, { status: 500 });
    }
}
