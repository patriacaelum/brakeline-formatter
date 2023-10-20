import { formatString } from '../format_string';


const EMPTY: string = '';
const SPACE: string = ' ';
const NEWLINE: string = '\n';
const NEWLINE2: string = '\n\n';
const URL: string = 'https://cinderellalyrics.com';
const DISPLAY: string = 'a dream is a wish your heart makes';
const CHARACTER_LIMIT: number = 80;


describe('formatString', () => {
    test('format empty string', () => {
        expect(formatString(EMPTY)).toBe(EMPTY);
    });

    test('format string with no spaces under character limit', () => {
        expect(formatString(URL)).toBe(URL);
    });

    test('format string with spaces under character limit', () => {
        expect(formatString(DISPLAY)).toBe(DISPLAY);
    });

    test('format string with newlines under character limit', () => {
        const text: string = [DISPLAY, DISPLAY, DISPLAY].join(NEWLINE);

        expect(formatString(text)).toBe(text);
    });

    test('format paragraphs with no spaces under character limit', () => {
        const text: string = [URL, URL].join(NEWLINE2);
        
        expect(formatString(text)).toBe(text);
    });

    test('format string with no spaces over character limit', () => {
        const text: string = [URL, URL, URL].join(EMPTY);

        expect(formatString(text)).toBe(text);
    });

    test('format string with spaces over character limit', () => {
        const text: string = [DISPLAY, DISPLAY, DISPLAY].join(SPACE);
        const formatted: string = formatString(text);
        const splits: string[] = formatted.split(NEWLINE);

        expect(splits.length).toBe(2);
        expect(splits[0].length).toBeLessThanOrEqual(CHARACTER_LIMIT);
        expect(splits[1].length).toBeLessThanOrEqual(CHARACTER_LIMIT);
    });
});