
import { parseTextInternal } from './lib/text-parser';

const text1 = 'My Title\n\nThis is the content.';
console.log('Test 1:', parseTextInternal(text1));

const text2 = 'My Blog\n![test image](https://example.com/img.png)\nSome content';
console.log('Test 2:', parseTextInternal(text2));
