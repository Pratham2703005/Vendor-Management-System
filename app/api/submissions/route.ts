import { NextResponse } from 'next/server';
import { createSubmission, getAllSubmissions } from '@/lib/db';
import { sendApprovalRequest } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, image_ref } = body;

        if (!title && !content) {
            return NextResponse.json({ error: 'Document appears empty. Please write something.' }, { status: 400 });
        }

        let finalTitle = title || 'Untitled';
        let finalContent = content || '(No meaningful content extracted)';

        const submission = createSubmission(finalTitle, finalContent, image_ref);

        // Trigger email notification (awaited for Serverless/Vercel)
        await sendApprovalRequest(submission);

        return NextResponse.json({ success: true, submission });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
    }
}


export async function GET() {
    try {
        const submissions = getAllSubmissions();
        return NextResponse.json({ submissions });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
