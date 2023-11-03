import {
	EMPTY,
	SPACE,
	NEWLINE,
	DASH3,
	CALLOUT_PREFIX,
	CODEBLOCK_PREFIX,
} from '../global_strings';
import { DISPLAY, URL, MATHJAX } from './global_strings';
import { MatchGroup, StringGroup, CaptureGroup } from '../matchgroup';
import { StringFormatter } from '../string_formatter';


const URL3: string = URL.repeat(3);
const DISPLAY80: string = 'A dream is a wish your heart makes, '
	+ 'When you\'re fast asleep, '
	+ 'in dreams you will';
const HEADING = '# Cinderella or The Little Glass Slipper';


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

	test('no spaces between capture groups', () => {
		const text = 'this is non-$dx$; and $dy$ is that';
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	});

	test('MathJax expression', () => {
		const text = `first line ${MATHJAX} second line`;
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(3);
		expect(formatted[0]).toBe('first line');
		expect(formatted[1]).toBe(MATHJAX);
		expect(formatted[2]).toBe('second line');
	});

	test('MathJax expression at end of string', () => {
		const text = `first line ${MATHJAX}`;
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(3);
		expect(formatted[0]).toBe('first line');
		expect(formatted[1]).toBe(MATHJAX);
		expect(formatted[2]).toBe(EMPTY);
	});

	test('HTML', () => {
		const text = `<h1>${HEADING}</h1>`;
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
		const text = `${HEADING}${DISPLAY80}`;
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	});

	test('list', () => {
		const text = `- ${DISPLAY80}`;
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(2);
		expect(formatted[0].startsWith('- ')).toBeTruthy();
		expect(formatted[1].startsWith('  ')).toBeTruthy();
	});

	test('comment', () => {
		const text = `%% ${DISPLAY80}`;
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(2);
		expect(formatted[0].startsWith('%% ')).toBeTruthy();
		expect(formatted[1].startsWith('%% ')).toBeTruthy();
	});

	test('HTML', () => {
		const text = `<div color='red'>${DISPLAY80}</div>`
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	})
});


describe('StringFormatter.format multi-line strings', () => {
    test('empty string', () => {
        const text: string = NEWLINE.repeat(3);
        const formatted: string = new StringFormatter(text).format();

		expect(formatted.split(NEWLINE).length).toBe(4);
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
		const subheading = `##${HEADING}`;
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

	test('frontmatter', () => {
		const text: string = [DASH3, DISPLAY80 + DISPLAY80, DASH3]
			.join(NEWLINE);
		const formatted: string = new StringFormatter(text).format();

		expect(formatted).toBe(text);
	});

	test('table-like', () => {
		const row: string = Array(3).fill(DISPLAY).join(' | ');
		const text: string = Array(3).fill(row).join(NEWLINE);
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(6);
	});

	test('table', () => {
		const row: string = Array(3).fill(DISPLAY).join(' | ');
		const header = '|:--|:-:|--:|';
		const text: string = [row, header, row, row].join(NEWLINE);
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(4);
		expect(formatted[0]).toBe(row);
		expect(formatted[1]).toBe(header);
		expect(formatted[2]).toBe(row);
		expect(formatted[3]).toBe(row);
	});

	test('HTML', () => {
		const text = 
`<html>
  <h1>
    ${HEADING}
  </h1>
  <div style='color: red'>
    <p>${DISPLAY}</p>
    ${URL3}
  </div>
</html>`
		const formatted: string[] = new StringFormatter(text).format().split(NEWLINE);

		expect(formatted.length).toBe(9);
		expect(formatted[0]).toBe('<html>');
		expect(formatted[1]).toBe('  <h1>');
		expect(formatted[2]).toBe(`    ${HEADING}`);
		expect(formatted[3]).toBe('  </h1>');
		expect(formatted[4]).toBe('  <div style=\'color: red\'>');
		expect(formatted[5]).toBe(`    <p>${DISPLAY}</p>`);
		expect(formatted[6]).toBe(`    ${URL3}`);
		expect(formatted[7]).toBe('  </div>');
		expect(formatted[8]).toBe('</html>');
	});
});


describe('StringFormatter.formatParagraph under limit', () => {
    test('empty string', () => {
        const formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(EMPTY);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(EMPTY);
    });

    test('no spaces', () => {
        const formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(URL);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(URL);
    });

    test('with spaces', () => {
        const formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(DISPLAY);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(DISPLAY);
    });

	test('callout and under character limit', () => {
		const text = `${CALLOUT_PREFIX}${DISPLAY}`;
		const formatter: StringFormatter = new StringFormatter(EMPTY);
		formatter.formatParagraph(text);

		expect(formatter.result.length).toBe(1);
		expect(formatter.result[0]).toBe(text);
	});
});


describe('StringFormatter.formatParagraph over limit', () => {
    test('no spaces', () => {
        const formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(URL3);

        expect(formatter.result.length).toBe(1);
        expect(formatter.result[0]).toBe(URL3);
    });

    test('with spaces', () => {
        const text: string = Array(3).fill(DISPLAY80).join(SPACE);
        const formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.formatParagraph(text);

        expect(formatter.result.length).toBe(3);
        expect(formatter.result[0]).toBe(DISPLAY80);
        expect(formatter.result[1]).toBe(DISPLAY80);
        expect(formatter.result[2]).toBe(DISPLAY80);
    });

	test('callout', () => {
		const text = `${CALLOUT_PREFIX}${DISPLAY80}`
		const formatter: StringFormatter = new StringFormatter(EMPTY);
		formatter.formatParagraph(text);

		expect(formatter.result.length).toBe(2);
		expect(formatter.result[0].startsWith(CALLOUT_PREFIX)).toBeTruthy();
		expect(formatter.result[1].startsWith(CALLOUT_PREFIX)).toBeTruthy();
	});
});


describe('StringFormatter.requiresSpace', () => {
	test('string to string and prior empty', () => {
		const prior: MatchGroup = new StringGroup(EMPTY);
		const current: MatchGroup = new StringGroup(DISPLAY);
		const formatter: StringFormatter = new StringFormatter(EMPTY);

		expect(formatter.requiresSpace(prior, current)).toBeTruthy();
	});

	test('string to string and current empty', () => {
		const prior: MatchGroup = new StringGroup(DISPLAY);
		const current: MatchGroup = new StringGroup(EMPTY);
		const formatter: StringFormatter = new StringFormatter(EMPTY);

		expect(formatter.requiresSpace(prior, current)).toBeTruthy();
	})

	test('string to capture and prior empty', () => {
		const prior: MatchGroup = new StringGroup(EMPTY);
		const current: MatchGroup = new CaptureGroup(DISPLAY);
		const formatter: StringFormatter = new StringFormatter(EMPTY);

		expect(formatter.requiresSpace(prior, current)).toBeTruthy();
	});

	test('string to capture and current empty', () => {
		const prior: MatchGroup = new StringGroup(DISPLAY);
		const current: MatchGroup = new CaptureGroup(EMPTY);
		const formatter: StringFormatter = new StringFormatter(EMPTY);

		expect(formatter.requiresSpace(prior, current)).toBeFalsy();
	});

	test('capture to string and prior empty', () => {
		const prior: MatchGroup = new CaptureGroup(EMPTY);
		const current: MatchGroup = new StringGroup(DISPLAY);
		const formatter: StringFormatter = new StringFormatter(EMPTY);

		expect(formatter.requiresSpace(prior, current)).toBeFalsy();
	});

	test('capture to string and current empty', () => {
		const prior: MatchGroup = new CaptureGroup(DISPLAY);
		const current: MatchGroup = new StringGroup(EMPTY);
		const formatter: StringFormatter = new StringFormatter(EMPTY);

		expect(formatter.requiresSpace(prior, current)).toBeTruthy();
	})

	test('capture to capture and prior empty', () => {
		const prior: MatchGroup = new CaptureGroup(EMPTY);
		const current: MatchGroup = new CaptureGroup(DISPLAY);
		const formatter: StringFormatter = new StringFormatter(EMPTY);

		expect(formatter.requiresSpace(prior, current)).toBeTruthy();
	});

	test('capture to capture and current empty', () => {
		const prior: MatchGroup = new CaptureGroup(DISPLAY);
		const current: MatchGroup = new CaptureGroup(EMPTY);
		const formatter: StringFormatter = new StringFormatter(EMPTY);

		expect(formatter.requiresSpace(prior, current)).toBeTruthy();
	})
});


describe('StringFormatter.inferNewlinesBeforeLine', () => {
    test('not header and no prior result', () => {
        const newlines = 42;
        const formatter: StringFormatter = new StringFormatter(EMPTY);
		const before: number = formatter.inferNewlinesBeforeLine(newlines, false);

        expect(before).toBe(newlines);
    });

    test('not header and prior result', () => {
        const newlines = 42;
        const formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.result = Array(3).fill(NEWLINE);
		const before: number = formatter.inferNewlinesBeforeLine(newlines, false);

        expect(before).toBe(newlines);
    });

    test('is header and no prior result', () => {
        const newlines = 42;
        const formatter: StringFormatter = new StringFormatter(EMPTY);
		const before: number = formatter.inferNewlinesBeforeLine(newlines, true);

        expect(before).toBe(newlines);
    });

    test('is header and prior result', () => {
        const newlines = 42;
        const formatter: StringFormatter = new StringFormatter(EMPTY);
        formatter.newlines_before_header = newlines;
        formatter.result = [DISPLAY, NEWLINE, NEWLINE, NEWLINE];
		const before: number = formatter.inferNewlinesBeforeLine(newlines, true);

        expect(before).toBe(newlines - 3);
    });
});


describe('StringFormatter.inferNewlinesAfterLine', () => {
	test('not header', () => {
		const formatter: StringFormatter = new StringFormatter(EMPTY);
		const after: number = formatter.inferNewlinesAfterLine(false);

		expect(after).toBe(0);
	});

	test('is header', () => {
		const formatter: StringFormatter = new StringFormatter(EMPTY);
		const after: number = formatter.inferNewlinesAfterLine(true);

		expect(after).toBe(1);
	});
});
