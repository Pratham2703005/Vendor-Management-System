export interface ParsedDocument {
    title: string;
    content: string;
    image_ref?: string;
}

export function parseTextInternal(text: string): ParsedDocument {
    const lines = text.split(/\r?\n/);
    const nonEmptyLines = lines.map(l => l.trim()).filter(l => l.length > 0);

    if (nonEmptyLines.length === 0) {
        return { title: 'Untitled', content: '', image_ref: undefined };
    }

    let title = nonEmptyLines[0];
    let content = '';

    // Edge Case: Single line content
    if (nonEmptyLines.length === 1) {
        if (title.length > 200) {
            content = title;
            title = 'Untitled';
        } else {
            content = '';
        }
    } else {
        // Standard case: First line is title, rest is content
        const contentStartIndex = lines.indexOf(nonEmptyLines[0]) + 1;
        content = lines.slice(contentStartIndex).join('\n').trim();
    }

    const imageRef = extractImageRef(text);

    return { title, content, image_ref: imageRef };
}

function extractImageRef(text: string): string | undefined {
    const mdImageRegex = /!\[.*?\]\((.*?)\)/;
    const mdMatch = text.match(mdImageRegex);
    if (mdMatch) return mdMatch[1];

    // Look for raw URL in first few lines
    const urlRegex = /(https?:\/\/[^\s]+)/;
    // Check first 500 chars for a URL if it looks like a header image
    const intro = text.slice(0, 500);
    const urlMatch = intro.match(urlRegex);
    if (urlMatch) return urlMatch[0];

    return undefined;
}
