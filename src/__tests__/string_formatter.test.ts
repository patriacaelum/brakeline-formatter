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
const HEADING: string = '# Cinderella or The Little Glass Slipper';


describe('StringFormatter.format single-line and under limit', () => {
    test('empty string', () => {
		const formatted: string = new StringFormatter(EMPTY).format();
        expect(formatted).toBe(EMPTY);
    });

    test('no spaces', () => {
		const formatted: string = new StringFormatter(URL).format();
        expect(formatted).toBe(URL);
    });

    test('with spaces', () => {
		const formatted: string = new StringFormatter(DISPLAY).format();
        expect(formatted).toBe(DISPLAY);
    });

    test('heading as first line', () => {
        const formatted: string = new StringFormatter(HEADING).format();
        expect(formatted).toBe(HEADING);
    });

	test('horizontal bar using "*"', () => {
		const text: string = '*'.repeat(3);
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	});

	test('horizontal bar using "-"', () => {
		const text: string = '-'.repeat(3);
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	});

	test('horizontal bar using "_"', () => {
		const text: string = '_'.repeat(3);
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	});
});


describe('StringFormatter.format single line over limit', () => {
    test('no spaces', () => {
		const formatted: string = new StringFormatter(URL3).format();
        expect(formatted).toBe(URL3);
    });

    test('with spaces', () => {
        const text: string = Array(3).fill(DISPLAY80).join(SPACE);
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

        expect(formatted.length).toBe(3);
        expect(formatted[0]).toBe(DISPLAY80);
        expect(formatted[1]).toBe(DISPLAY80);
        expect(formatted[2]).toBe(DISPLAY80);
    });

	test('heading as first line', () => {
		const text: string = `${HEADING}${DISPLAY80}`;
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	});

	test('list', () => {
		const text: string = `- ${DISPLAY80}`;
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(2);
		expect(formatted[0].startsWith('- ')).toBeTruthy();
		expect(formatted[1].startsWith('  ')).toBeTruthy();
	});

	test('comment', () => {
		const text: string = `%% ${DISPLAY80}`;
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(2);
		expect(formatted[0].startsWith('%% ')).toBeTruthy();
		expect(formatted[1].startsWith('%% ')).toBeTruthy();
	});
});


describe('StringFormatter.format multi-line strings', () => {
    test('empty string', () => {
        const text: string = NEWLINE.repeat(3);
        const formatted: string = new StringFormatter(text).format();

        expect(formatted).toBe(text);
    });

    test('no spaces and every line under character limit', () => {
        const text: string = Array(3).fill(URL).join(NEWLINE);
		const formatted: string = new StringFormatter(text).format();
        
        expect(formatted).toBe(text);
    });

    test('every line under character limit', () => {
        const text: string = Array(3).fill(DISPLAY).join(NEWLINE);
		const formatted: string = new StringFormatter(text).format();

        expect(formatted).toBe(text);
    });

    test('no spaces and every line over character limit', () => {
        const text: string = Array(3).fill(URL3).join(NEWLINE);
		const formatted: string = new StringFormatter(text).format();

        expect(formatted).toBe(text);
    });

    test('spaces and every line over character limit', () => {
        const text: string = Array(3).fill(DISPLAY80).join(NEWLINE);
		const formatted: string = new StringFormatter(text).format();

        expect(formatted).toBe(text);
    });

	test('codeblocks are ignored', () => {
		const code: string = Array(3).fill(URL3).join(NEWLINE);
		const text: string = [CODEBLOCK_PREFIX, code, CODEBLOCK_PREFIX]
			.join(NEWLINE);
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	});

    test('heading as second line', () => {
        const text: string = [DISPLAY, HEADING].join(NEWLINE);
        const formatted: string = new StringFormatter(text).format();

        expect(formatted).toBe(`${DISPLAY}\n\n${HEADING}`);
    });

	test('subheading as second line', () => {
		const subheading: string = `##${HEADING}`;
		const text: string = [DISPLAY, subheading].join(NEWLINE);
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(`${DISPLAY}\n\n${subheading}`);
	})

	test('nested list', () => {
		const text: string = [`- ${DISPLAY}`, `  - ${DISPLAY80}`].join(NEWLINE);
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(3);
		expect(formatted[0].startsWith('- ')).toBeTruthy();
		expect(formatted[1].startsWith('  - ')).toBeTruthy();
		expect(formatted[2].startsWith('    ')).toBeTruthy();
	});

	test('mixed nested list', () => {
		const text: string = [`- ${DISPLAY}`, `  1. ${DISPLAY80}`].join(NEWLINE);
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(3);
		expect(formatted[0].startsWith('- ')).toBeTruthy();
		expect(formatted[1].startsWith('  1. ')).toBeTruthy();
		expect(formatted[2].startsWith('     ')).toBeTruthy();
	});

	test('nested callout', () => {
		const text: string = [`> ${DISPLAY}`, `> > ${DISPLAY80}`].join(NEWLINE);
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(3);
		expect(formatted[0].startsWith('> ')).toBeTruthy();
		expect(formatted[1].startsWith('> > ')).toBeTruthy();
		expect(formatted[2].startsWith('> > ')).toBeTruthy();
	});
});


describe('StringFormatter.formatParagraph under limit', () => {
    test('empty string', () => {
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(EMPTY);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(EMPTY);
    });

    test('no spaces', () => {
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(URL);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(URL);
    });

    test('with spaces', () => {
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(DISPLAY);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(DISPLAY);
    });

	test('callout and under character limit', () => {
		const text: string = `${CALLOUT_PREFIX}${DISPLAY}`;
		let formatter: StringFormatter = new StringFormatter(EMPTY);
		formatter.formatParagraph(text);

		expect(formatter.result.length).toBe(1);
		expect(formatter.result[0]).toBe(text);
	});
});


describe('StringFormatter.formatParagraph over limit', () => {
    test('no spaces', () => {
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(URL3);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(URL3);
    });

    test('with spaces', () => {
        const text: string = Array(3).fill(DISPLAY80).join(SPACE);
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(text);

        expect(formatter.result.length).toBe(3);
        expect(formatter.result[0]).toBe(DISPLAY80);
        expect(formatter.result[1]).toBe(DISPLAY80);
        expect(formatter.result[2]).toBe(DISPLAY80);
    });

	test('callout', () => {
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
		const before: number = formatter.inferNewlinesBeforeLine(newlines, false);

        expect(before).toBe(newlines);
    });

    test('not header and prior result', () => {
        const newlines: number = 42;
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.result = Array(3).fill(NEWLINE);
		const before: number = formatter.inferNewlinesBeforeLine(newlines, false);

        expect(before).toBe(newlines);
    });

    test('is header and no prior result', () => {
        const newlines: number = 42;
        let formatter: StringFormatter = new StringFormatter(EMPTY);
		const before: number = formatter.inferNewlinesBeforeLine(newlines, true);

        expect(before).toBe(newlines);
    });

    test('is header and prior result', () => {
        const newlines: number = 42;
        let formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.newlines_before_header = newlines;
        formatter.result = [DISPLAY, NEWLINE, NEWLINE, NEWLINE];
		const before: number = formatter.inferNewlinesBeforeLine(newlines, true);

        expect(before).toBe(newlines - 3);
    });
});


describe('StringFormatter.inferNewlinesAfterLine', () => {
	test('not header', () => {
		let formatter: StringFormatter = new StringFormatter(EMPTY);
		const after: number = formatter.inferNewlinesAfterLine(false);

		expect(after).toBe(0);
	});

	test('is header', () => {
		let formatter: StringFormatter = new StringFormatter(EMPTY);
		const after: number = formatter.inferNewlinesAfterLine(true);

		expect(after).toBe(1);
	});
});
