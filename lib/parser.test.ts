import { parseTextInternal } from './text-parser';

describe('Parser Logic', () => {
    test('should parse text file correctly', () => {
        const text = 'My Title\n\nThis is the content.';
        const result = parseTextInternal(text);

        expect(result.title).toBe('My Title');
        expect(result.content).toBe('This is the content.');
        expect(result.image_ref).toBeUndefined();
    });

    test('should extract markdown image ref', () => {
        const text = 'My Blog\n![test image](https://example.com/img.png)\nSome content';
        const result = parseTextInternal(text);

        expect(result.title).toBe('My Blog');
        expect(result.image_ref).toBe('https://example.com/img.png');
    });
});
