import { NextResponse } from 'next/server';
import { updateSubmissionStatus } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    const action = searchParams.get('action');

    if (!id || !action || !['approve', 'reject'].includes(action)) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    const success = updateSubmissionStatus(id, status);

    if (!success) {
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Redirect to a nice success page
    return NextResponse.redirect(new URL(`/dashboard?message=Submission ${status}`, request.url));
}
