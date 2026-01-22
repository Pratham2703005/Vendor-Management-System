import mammoth from 'mammoth';
import { parseTextInternal, ParsedDocument } from './text-parser';

export type { ParsedDocument };

export async function parseDocument(buffer: Buffer, mimeType: string, originalName: string): Promise<ParsedDocument> {
    const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || originalName.endsWith('.docx');
    const isMd = originalName.endsWith('.md');
    const isTxt = originalName.endsWith('.txt');

    if (isDocx) {
        return parseDocx(buffer);
    } else if (isMd || isTxt) {
        return parseTextInternal(buffer.toString('utf-8'));
    } else {
        throw new Error('Unsupported file type. Please upload .docx, .md, or .txt');
    }
}

async function parseDocx(buffer: Buffer): Promise<ParsedDocument> {
    // Extract raw text
    const { value: rawText } = await mammoth.extractRawText({ buffer });

    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) {
        const { value: html } = await mammoth.convertToHtml({ buffer });
        const imgRef = extractFirstImageFromHtml(html);
        return { title: 'Untitled', content: '', image_ref: imgRef };
    }

    let title = 'Untitled';
    let content = rawText;

    const firstLineWords = lines[0].split(/\s+/).length;

    if (firstLineWords <= 10) {
        title = lines[0];
        // Content is everything after the title line
        const titleIndex = rawText.indexOf(lines[0]);
        content = rawText.slice(titleIndex + lines[0].length).trim();
    }

    // Attempt to find images (getting the first one if exists)
    const { value: html } = await mammoth.convertToHtml({ buffer });
    const imageRef = extractFirstImageFromHtml(html);

    return { title, content, image_ref: imageRef };
}

function extractFirstImageFromHtml(html: string): string | undefined {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = html.match(imgRegex);
    return match ? match[1] : undefined;
}
