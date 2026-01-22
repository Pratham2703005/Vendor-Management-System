export interface ParsedDocument {
    title: string;
    content: string;
    image_ref?: string;
}

export function parseTextInternal(text: string): ParsedDocument {
    const trimmedText = text.trim();
    if (!trimmedText) {
        return { title: 'Untitled', content: '', image_ref: undefined };
    }

    const lines = trimmedText.split(/\r?\n/);
    const nonEmptyLines = lines.map(l => l.trim()).filter(l => l.length > 0);

    if (nonEmptyLines.length === 0) {
        return { title: 'Untitled', content: '', image_ref: undefined };
    }

    let firstLine = nonEmptyLines[0];
    let imageRef: string | undefined = undefined;
    let titleLineIndex = 0;

    // Check if first line is an image (Markdown or URL)
    const mdImageRegex = /^!\[.*?\]\((.*?)\)$/;
    const urlRegex = /^(https?:\/\/[^\s]+)$/;

    const mdMatch = firstLine.match(mdImageRegex);
    const urlMatch = firstLine.match(urlRegex);

    if (mdMatch) {
        imageRef = mdMatch[1];
        titleLineIndex = 1;
    } else if (urlMatch) {
        imageRef = urlMatch[1];
        titleLineIndex = 1;
    }

    // Determine Title
    let title = 'Untitled';
    if (nonEmptyLines.length > titleLineIndex) {
        title = nonEmptyLines[titleLineIndex];
        // Clean up title (remove markdown headers)
        title = title.replace(/^#+\s*/, '');
    }

    // Determine Content (everything after the title line in the ORIGINAL text, to preserve formatting if possible, or just join the rest)
    // To be robust, let's just join the remaining non-empty lines with double newlines or similar, 
    // OR try to find the title in the text.
    // Given the previous logic used `text.indexOf(title)`, let's try to be smart.

    // Easier approach: Join the rest of the lines.
    // The requirement says "the rest as the content".

    const contentLines = nonEmptyLines.slice(titleLineIndex + 1);
    const content = contentLines.join('\n\n');

    if (!imageRef) {
        imageRef = extractImageRef(trimmedText);
    }

    return { title: title || 'Untitled', content, image_ref: imageRef };
}

// Helper kept for backward compatibility if needed, but the main logic is now in parseTextInternal
export function splitTitleFromContent(text: string): { title: string, content: string } {
    // This function was flawed as it didn't account for the image line. 
    // We will reimplement it to wrap parseTextInternal but ignore image_ref
    const parsed = parseTextInternal(text);
    return { title: parsed.title, content: parsed.content };
}

function extractImageRef(text: string): string | undefined {
    const mdImageRegex = /!\[.*?\]\((.*?)\)/;
    const mdMatch = text.match(mdImageRegex);
    if (mdMatch) return mdMatch[1];

    // Look for raw URL in first few lines
    // ... logic ...
    // To match previous implementation exactly we can duplicate logic or assume it's fine.
    // The previous extractImageRef was simple regex.

    // Look for raw URL in first few lines
    const urlRegex = /(https?:\/\/[^\s]+)/;
    // Check first 500 chars for a URL if it looks like a header image
    const intro = text.slice(0, 500);
    const urlMatch = intro.match(urlRegex);
    if (urlMatch) return urlMatch[0];

    return undefined;
}

