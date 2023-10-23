import {
	EMPTY,
	SPACE,
	NEWLINE,
	CALLOUT_PREFIX,
	CODEBLOCK_PREFIX,
} from '../global_strings';
import { DISPLAY, URL } from './global_strings';
import { StringFormatter } from '../string_formatter';


const URL3: string = URL.repeat(3);
const DISPLAY80: string = 'A dream is a wish your heart makes, '
	+ 'When you\'re fast asleep, '
	+ 'in dreams you will';
const HEADER: string = '# Cinderella or The Little Glass Slipper';


describe('StringFormatter.format single-line strings', () => {
    test('empty string', () => {
		let formatter: StringFormatter = new StringFormatter(EMPTY);
        expect(formatter.format()).toBe(EMPTY);
    });

    test('no spaces and under character limit', () => {
		let formatter: StringFormatter = new StringFormatter(URL);
        expect(formatter.format()).toBe(URL);
    });

    test('spaces and under character limit', () => {
		let formatter: StringFormatter = new StringFormatter(DISPLAY);
        expect(formatter.format()).toBe(DISPLAY);
    });

    test('no spaces and over character limit', () => {
		let formatter: StringFormatter = new StringFormatter(URL3);
        expect(formatter.format()).toBe(URL3);
    });

    test('spaces and over character limit', () => {
        const text: string = Array(3).fill(DISPLAY80).join(SPACE);
		let formatter: StringFormatter = new StringFormatter(text);
        const formatted: string = formatter.format();
        const splits: string[] = formatted.split(NEWLINE);

        expect(splits.length).toBe(3);
        expect(splits[0]).toBe(DISPLAY80);
        expect(splits[1]).toBe(DISPLAY80);
        expect(splits[2]).toBe(DISPLAY80);
    });

    test('header as first line', () => {
        let formatter: StringFormatter = new StringFormatter(HEADER);

        expect(formatter.format()).toBe(`${HEADER}`);
    });
});


describe('StringFormatter.format multi-line strings', () => {
    test('empty string', () => {
        const text: string = NEWLINE.repeat(3);
        let formatter: StringFormatter = new StringFormatter(text);

        expect(formatter.format()).toBe(text);
    });

    test('no spaces and every line under character limit', () => {
        const text: string = Array(3).fill(URL).join(NEWLINE);
		let formatter: StringFormatter = new StringFormatter(text);
        
        expect(formatter.format()).toBe(text);
    });

    test('every line under character limit', () => {
        const text: string = Array(3).fill(DISPLAY).join(NEWLINE);
		let formatter: StringFormatter = new StringFormatter(text);

        expect(formatter.format()).toBe(text);
    });

    test('no spaces and every line over character limit', () => {
        const text: string = Array(3).fill(URL3).join(NEWLINE);
        let formatter: StringFormatter = new StringFormatter(text);
        let formatted: string = formatter.format();

        expect(formatted).toBe(text);
    });

    test('spaces and every line over character limit', () => {
        const text: string = Array(3).fill(DISPLAY80).join(NEWLINE);
        let formatter: StringFormatter = new StringFormatter(text);
        let formatted: string = formatter.format();

        expect(formatted).toBe(text);
    });

	test('codeblocks are ignored', () => {
		const code: string = Array(3).fill(URL3).join(NEWLINE);
		const text: string = [CODEBLOCK_PREFIX, code, CODEBLOCK_PREFIX]
			.join(NEWLINE);
		let formatter: StringFormatter = new StringFormatter(text);
		let formatted: string = formatter.format();

		console.log(formatted);
		expect(formatted).toBe(text);
	});

    test('header as second line', () => {
        const text: string = [DISPLAY, HEADER].join(NEWLINE);
        let formatter: StringFormatter = new StringFormatter(text);

        expect(formatter.format()).toBe(`${DISPLAY}\n\n${HEADER}`);
    });
});


describe('StringFormatter.formatParagraph', () => {
    test('empty string', () => {
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(EMPTY);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(EMPTY);
    });

    test('no spaces and under character limit', () => {
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(URL);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(URL);
    });

    test('spaces and under character limit', () => {
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(DISPLAY);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(DISPLAY);
    });

    test('no spaces and over character limit', () => {
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(URL3);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(URL3);
    });

    test('spaces and over character limit', () => {
        const text: string = Array(3).fill(DISPLAY80).join(SPACE);
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(text);

        expect(formatter.result.length).toBe(3);
        expect(formatter.result[0]).toBe(DISPLAY80);
        expect(formatter.result[1]).toBe(DISPLAY80);
        expect(formatter.result[2]).toBe(DISPLAY80);
    });

	test('callout and under character limit', () => {
		const text: string = `${CALLOUT_PREFIX}${DISPLAY}`;
		let formatter: StringFormatter = new StringFormatter(EMPTY);
		formatter.formatParagraph(text);

		expect(formatter.result.length).toBe(1);
		expect(formatter.result[0]).toBe(text);
	});

	test('callout and over character limit', () => {
		const text: string = `${CALLOUT_PREFIX}${DISPLAY80}`
		let formatter: StringFormatter = new StringFormatter(EMPTY);
		formatter.formatParagraph(text);

		expect(formatter.result.length).toBe(2);
		expect(formatter.result[0].startsWith(CALLOUT_PREFIX)).toBeTruthy();
		expect(formatter.result[1].startsWith(CALLOUT_PREFIX)).toBeTruthy();
	});
});


describe('StringFormatter.inferNewlinesBeforeLine', () => {
    test('not header and no prior result', () => {
        const newlines: number = 42;
        let formatter: StringFormatter = new StringFormatter(EMPTY);

        expect(formatter.inferNewlinesBeforeLine(newlines, false))
            .toBe(newlines);
    });

    test('not header and prior result', () => {
        const newlines: number = 42;
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.result = Array(3).fill(NEWLINE);

        expect(formatter.inferNewlinesBeforeLine(newlines, false))
            .toBe(newlines);
    });

    test('is header and no prior result', () => {
        const newlines: number = 42;
        let formatter: StringFormatter = new StringFormatter(EMPTY);

        expect(formatter.inferNewlinesBeforeLine(newlines, true))
            .toBe(newlines);
    });

    test('is header and prior result', () => {
        const newlines: number = 42;
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.newlines_before_header = newlines;
        formatter.result = [DISPLAY, NEWLINE, NEWLINE, NEWLINE];

        expect(formatter.inferNewlinesBeforeLine(newlines, true))
            .toBe(newlines - 3);
    });
});


describe('StringFormatter.inferNewlinesAfterLine', () => {
	test('not header', () => {
		let formatter: StringFormatter = new StringFormatter(EMPTY);
		expect(formatter.inferNewlinesAfterLine(false)).toBe(0);
	});

	test('is header', () => {
		let formatter: StringFormatter = new StringFormatter(EMPTY);
		expect(formatter.inferNewlinesAfterLine(true)).toBe(1);
	});
});
