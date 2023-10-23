import { EMPTY, SPACE } from '../global_strings';
import { inferIndent, inferLeadingSpaces } from '../infer_whitespace';


const TEXT: string = 'this - here * is + a 42. list';
const SPACE2: string = SPACE.repeat(2);


describe('inferIndent', () => {
	test('empty string', () => {
		expect(inferIndent(EMPTY)).toBe(EMPTY);
	});

	test('non-list format', () => {
		expect(inferIndent(TEXT)).toBe(EMPTY);
	});

	test('list using "- "', () => {
		expect(inferIndent(`- ${TEXT}`)).toBe(SPACE2);
	});

	test('list using "* "', () => {
		expect(inferIndent(`* ${TEXT}`)).toBe(SPACE2);
	});

	test('list using "+ "', () => {
		expect(inferIndent(`+ ${TEXT}`)).toBe(SPACE2);
	});

	test('numbered list with one digit', () => {
		expect(inferIndent(`1. ${TEXT}`)).toBe(SPACE.repeat(3));
	});

	test('numbered list with multiple digits', () => {
		expect(inferIndent(`1234. ${TEXT}`)).toBe(SPACE.repeat(6));
	})
});


describe('inferLeadingSpace', () => {
	test('empty string', () => {
		expect(inferLeadingSpaces('')).toBe(EMPTY);
	});

	test('no leading spaces', () => {
		expect(inferLeadingSpaces(TEXT)).toBe(EMPTY);
	});

	test('with only spaces', () => {
		expect(inferLeadingSpaces(SPACE2)).toBe(SPACE2);
	});

	test('with leading spaces and text', () => {
		expect(inferLeadingSpaces(`${SPACE2}${TEXT}`)).toBe(SPACE2);
	});
});
