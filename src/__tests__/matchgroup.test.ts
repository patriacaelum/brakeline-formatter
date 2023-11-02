import { DISPLAY, URL, ANCHOR, INLINE_MATHJAX, MATHJAX } from './global_strings';
import { EMPTY } from '../global_strings';
import {
	MatchGroupError,
	StringGroup,
	InlineCodeGroup,
	ExternalLinkGroup,
	InternalLinkGroup,
	MathJaxGroup,
	InlineMathJaxGroup,
} from '../matchgroup';


describe('StringGroup', () => {
	test('empty string', () => {
		const group: StringGroup = new StringGroup(EMPTY);

		expect(group.text).toBe(EMPTY);
		expect(group.length).toBe(EMPTY.length);
	});

	test('fields are stored', () => {
		const group: StringGroup = new StringGroup(DISPLAY);

		expect(group.text).toBe(DISPLAY);
		expect(group.length).toBe(DISPLAY.length);
	});

	test('italic text', () => {
		const text = `_${URL}_`;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(URL.length);
	});

	test('bold text', () => {
		const text = `**${URL}**`;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(URL.length);
	});

	test('strikethrough text', () => {
		const text = `~~${URL}~~`;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(URL.length);
	});

	test('highlight text', () => {
		const text = `==${URL}==`;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(URL.length);
	});
});


describe('InlineCodeGroup', () => {
	test('empty string', () => {
		expect(() => new InlineCodeGroup(EMPTY)).toThrow(MatchGroupError);
	});

	test('empty text', () => {
		const text = '``';
		const group: InlineCodeGroup = new InlineCodeGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('with text', () => {
		const text = `\`${DISPLAY}\``;
		const group: InlineCodeGroup = new InlineCodeGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(DISPLAY.length);
	});
});


describe('ExternalLinkGroup', () => {
	test('empty string', () => {
		expect(() => new ExternalLinkGroup(EMPTY)).toThrow(MatchGroupError);
	});

	test('empty text and empty link', () => {
		const text = '[]()';
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('empty text and with link', () => {
		const text = `[](${URL})`;
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('with text and empty link', () => {
		const text = `[${DISPLAY}]()`;
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(DISPLAY.length);
	});

	test('with text and with link', () => {
		const text = `[${DISPLAY}](${URL})`
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(DISPLAY.length);
	});
});


describe('InternalLinkGroup', () => {
	test('empty string', () => {
		expect(() => new InternalLinkGroup(EMPTY)).toThrow(MatchGroupError);
	});

	test('empty text and empty link', () => {
		const text = '[[]]';
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(4);
	});

	test('empty text and empty link with pipe', () => {
		const text = '[[|]]';
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(1);
	});

	test('empty text and with link', () => {
		const text = `[[${ANCHOR}]]`;
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(ANCHOR.length)
	});

	test('with text and empty link', () => {
		const text = `[[|${DISPLAY}]]`;
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(DISPLAY.length);
	});

	test('with text and with link', () => {
		const text = `[[${ANCHOR}|${DISPLAY}]]`
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(DISPLAY.length);
	});
});


describe('MathJaxGroup', () => {
	test('empty string', () => {
		expect(() => new MathJaxGroup(EMPTY)).toThrow(MatchGroupError);
	});

	test('empty expression', () => {
		const text = '$$$$';
		const group: MathJaxGroup = new MathJaxGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(0);
	});

	test('expression with no spaces', () => {
		const group: MathJaxGroup = new MathJaxGroup(MATHJAX);

		expect(group.text).toBe(MATHJAX);
		expect(group.length).toBe(MATHJAX.length - 4);
	});

	test('expression with spaces', () => {
		const text = '$$e^{2 i \\pi} = 1$$';
		const group: MathJaxGroup = new MathJaxGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(11);
	});
});


describe('InlineMathJaxGroup', () => {
	test('empty string', () => {
		expect(() => new InlineMathJaxGroup(EMPTY)).toThrow(MatchGroupError);
	});

	test('empty expression', () => {
		const text = '$$';
		const group: InlineMathJaxGroup = new InlineMathJaxGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(0);
	});

	test('expression with no spaces', () => {
		const group: InlineMathJaxGroup = new InlineMathJaxGroup(INLINE_MATHJAX);

		expect(group.text).toBe(INLINE_MATHJAX);
		expect(group.length).toBe(INLINE_MATHJAX.length - 2);
	});

	test('expression with spaces', () => {
		const text = '$e^{2 i \\pi} = 1$';
		const group: InlineMathJaxGroup = new InlineMathJaxGroup(text);
 
		expect(group.text).toBe(text);
		expect(group.length).toBe(11);
	});
});
