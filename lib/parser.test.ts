import { parseTextInternal } from './text-parser';

describe('Parser Logic', () => {
    test('should parse text file correctly', () => {
        const text = 'My Title\n\nThis is the content.';
        const result = parseTextInternal(text);

        expect(result.title).toBe('My Title');
        expect(result.content).toBe('This is the content.');
        expect(result.image_ref).toBeUndefined();
    });

    test('should extract markdown image ref (legacy logic - body)', () => {
        const text = 'My Blog\n![test image](https://example.com/img.png)\nSome content';
        const result = parseTextInternal(text);

        expect(result.title).toBe('My Blog');
        expect(result.image_ref).toBe('https://example.com/img.png');
    });

    test('should treat first line as image and second line as title', () => {
        const text = '![cover](https://example.com/cover.png)\nReal Title\nHere is content.';
        const result = parseTextInternal(text);

        expect(result.image_ref).toBe('https://example.com/cover.png');
        expect(result.title).toBe('Real Title');
        expect(result.content).toBe('Here is content.');
    });

    test('should treat first line as URL and second line as title', () => {
        const text = 'https://example.com/photo.jpg\nMy Story\nDeep text.';
        const result = parseTextInternal(text);

        expect(result.image_ref).toBe('https://example.com/photo.jpg');
        expect(result.title).toBe('My Story');
        expect(result.content).toBe('Deep text.');
    });
});
