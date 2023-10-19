import {
	MatchGroupError,
	StringGroup,
	MarkdownLinkGroup,
	WikilinkGroup,
} from '../matchgroup';


const display: string = 'a dream is a wish your heart makes';
const outgoing_link: string = 'https://cinderellasonglyrics.com';
const internal_link: string = 'songs#from cinderella';


describe('StringGroup', () => {
	test('empty string', () => {
		const text: string = '';
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(text.length);
	});

	test('fields are stored', () => {
		const text: string = display;
		const group: StringGroup = new StringGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(text.length);
	});
});


describe('MarkdownLinkGroup', () => {
	test('empty string', () => {
		const text: string = '';
		expect(() => new MarkdownLinkGroup(text)).toThrow(MatchGroupError);
	});

	test('empty text and empty link', () => {
		const text: string = '[]()';
		const group: MarkdownLinkGroup = new MarkdownLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('empty text and with link', () => {
		const text: string = `[](${outgoing_link})`;
		const group: MarkdownLinkGroup = new MarkdownLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('with text and empty link', () => {
		const text: string = `[${display}]()`;
		const group: MarkdownLinkGroup = new MarkdownLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(display.length);
	});

	test('with text and with link', () => {
		const text = `[${display}](${outgoing_link})`
		const group: MarkdownLinkGroup = new MarkdownLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(display.length);
	});
});


describe('WikilinkGroup', () => {
	test('empty string', () => {
		const text: string = '';
		expect(() => new WikilinkGroup(text)).toThrow(MatchGroupError);
	});

	test('empty text and empty link', () => {
		const text: string = '[[]]';
		const group: WikilinkGroup = new WikilinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(4);
	});

	test('empty text and with link', () => {
		const text: string = `[[${internal_link}]]`;
		const group: WikilinkGroup = new WikilinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(internal_link.length)
	});

	test('with text and empty link', () => {
		const text: string = `[[|${display}]]`;
		const group: WikilinkGroup = new WikilinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(display.length);
	});

	test('with text and with link', () => {
		const text: string = `[[${internal_link}|${display}]]`
		const group: WikilinkGroup = new WikilinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(display.length);
	});
});
