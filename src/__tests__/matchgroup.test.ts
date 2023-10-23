import { DISPLAY, URL, ANCHOR, MATHJAX } from './global_strings';
import { EMPTY } from '../global_strings';
import {
	MatchGroupError,
	StringGroup,
	ExternalLinkGroup,
	InternalLinkGroup,
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
		const text: string = `_${URL}_`;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(URL.length);
	});

	test('bold text', () => {
		const text: string = `**${URL}**`;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(URL.length);
	});

	test('strikethrough text', () => {
		const text: string = `~~${URL}~~`;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(URL.length);
	});

	test('highlight text', () => {
		const text: string = `==${URL}==`;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(URL.length);
	});
});


describe('ExternalLinkGroup', () => {
	test('empty string', () => {
		expect(() => new ExternalLinkGroup(EMPTY)).toThrow(MatchGroupError);
	});

	test('empty text and empty link', () => {
		const text: string = '[]()';
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('empty text and with link', () => {
		const text: string = `[](${URL})`;
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('with text and empty link', () => {
		const text: string = `[${DISPLAY}]()`;
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
		const text: string = '[[]]';
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(4);
	});

	test('empty text and empty link with pipe', () => {
		const text: string = '[[|]]';
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(1);
	});

	test('empty text and with link', () => {
		const text: string = `[[${ANCHOR}]]`;
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(ANCHOR.length)
	});

	test('with text and empty link', () => {
		const text: string = `[[|${DISPLAY}]]`;
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(DISPLAY.length);
	});

	test('with text and with link', () => {
		const text: string = `[[${ANCHOR}|${DISPLAY}]]`
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(DISPLAY.length);
	});
});


describe('InlineMathJaxGroup', () => {
	test('empty string', () => {
		expect(() => new InlineMathJaxGroup(EMPTY)).toThrow(MatchGroupError);
	});

	test('empty expression', () => {
		const text: string = '$$';
		const group: InlineMathJaxGroup = new InlineMathJaxGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(0);
	});

	test('expression with no spaces', () => {
		const group: InlineMathJaxGroup = new InlineMathJaxGroup(MATHJAX);

		expect(group.text).toBe(MATHJAX);
		expect(group.length).toBe(MATHJAX.length - 2);
	});

	test('expression with spaces', () => {
		const text: string = '$e^{2 i \\pi} = 1$';
		const group: InlineMathJaxGroup = new InlineMathJaxGroup(text);
 
		expect(group.text).toBe(text);
		expect(group.length).toBe(11);
	});
});
