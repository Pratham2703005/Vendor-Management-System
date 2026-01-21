import { NextResponse } from 'next/server';
import { parseDocument } from '@/lib/parser';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = await parseDocument(buffer, file.type, file.name);

        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error('Parse error:', error);
        return NextResponse.json({ error: error.message || 'Failed to parse file' }, { status: 500 });
    }
}
