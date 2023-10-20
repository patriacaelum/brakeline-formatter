import {
	MatchGroupError,
	StringGroup,
	ExternalLinkGroup,
	InternalLinkGroup,
} from '../matchgroup';


const display: string = 'a dream is a wish your heart makes';
const external_link: string = 'https://cinderellasonglyrics.com';
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


describe('ExternalLinkGroup', () => {
	test('empty string', () => {
		const text: string = '';
		expect(() => new ExternalLinkGroup(text)).toThrow(MatchGroupError);
	});

	test('empty text and empty link', () => {
		const text: string = '[]()';
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('empty text and with link', () => {
		const text: string = `[](${external_link})`;
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(2);
	});

	test('with text and empty link', () => {
		const text: string = `[${display}]()`;
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(display.length);
	});

	test('with text and with link', () => {
		const text = `[${display}](${external_link})`
		const group: ExternalLinkGroup = new ExternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(display.length);
	});
});


describe('InternalLinkGroup', () => {
	test('empty string', () => {
		const text: string = '';
		expect(() => new InternalLinkGroup(text)).toThrow(MatchGroupError);
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
		const text: string = `[[${internal_link}]]`;
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(internal_link.length)
	});

	test('with text and empty link', () => {
		const text: string = `[[|${display}]]`;
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(display.length);
	});

	test('with text and with link', () => {
		const text: string = `[[${internal_link}|${display}]]`
		const group: InternalLinkGroup = new InternalLinkGroup(text);

		expect(group.text).toBe(text);
		expect(group.length).toBe(display.length);
	});
});
