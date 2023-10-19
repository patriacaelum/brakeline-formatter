import { inferIndent, inferLeadingSpaces } from '../infer_whitespace';


const text: string = 'this - here * is + a 42. list';
const empty: string = '';
const one_space: string = ' ';
const two_spaces: string = one_space.repeat(2);


describe('inferIndent', () => {
	test('empty string', () => {
		expect(inferIndent(empty)).toBe(empty);
	});

	test('non-list format', () => {
		expect(inferIndent(text)).toBe(empty);
	});

	test('list using "- "', () => {
		expect(inferIndent(`- ${text}`)).toBe(two_spaces);
	});

	test('list using "* "', () => {
		expect(inferIndent(`* ${text}`)).toBe(two_spaces);
	});

	test('list using "+ "', () => {
		expect(inferIndent(`+ ${text}`)).toBe(two_spaces);
	});

	test('numbered list with one digit', () => {
		expect(inferIndent(`1. ${text}`)).toBe(one_space.repeat(3));
	});

	test('numbered list with multiple digits', () => {
		expect(inferIndent(`1234. ${text}`)).toBe(one_space.repeat(6));
	})
});


describe('inferLeadingSpace', () => {
	test('empty string', () => {
		expect(inferLeadingSpaces('')).toBe(empty);
	});

	test('no leading spaces', () => {
		expect(inferLeadingSpaces(text)).toBe(empty);
	});

	test('with only spaces', () => {
		expect(inferLeadingSpaces(two_spaces)).toBe(two_spaces);
	});

	test('with leading spaces and text', () => {
		expect(inferLeadingSpaces(`${two_spaces}${text}`)).toBe(two_spaces);
	});
});
