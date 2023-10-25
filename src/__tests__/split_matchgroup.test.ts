import { EMPTY } from '../global_strings';
import { DISPLAY, URL, ANCHOR, MATHJAX } from './global_strings';
import {
	splitStringGroups,
	splitAllStringGroups,
	splitCaptureGroups,
	splitAllMatchGroups,
} from '../split_matchgroup';
import {
	MatchGroup,
	StringGroup,
	InlineCodeGroup,
	ExternalLinkGroup,
	InternalLinkGroup,
	InlineMathJaxGroup,
} from '../matchgroup';


const PRETEXT = 'cinderella sings';
const POSTTEXT = 'in the movie';

const INLINE_CODE = `\`${DISPLAY}\``;
const EXTERNAL_LINK = `[${DISPLAY}](${URL})`;
const INTERNAL_LINK = `[[${ANCHOR}|${DISPLAY}]]`


describe('splitStringGroups', () => {
	test('empty string', () => {
		const groups: MatchGroup[] = splitStringGroups(EMPTY)

		expect(groups.length).toBe(1);
		expect(groups[0].text).toBe(EMPTY);
	});

	test('string with no spaces', () => {
		const groups: MatchGroup[] = splitStringGroups(URL);

		expect(groups.length).toBe(1);
		expect(groups[0].text).toBe(URL);
	});

	test('string with spaces', () => {
		const groups: MatchGroup[] = splitStringGroups(DISPLAY);

		expect(groups.length).toBe(8);
		expect(groups[0].text).toBe('A');
		expect(groups[1].text).toBe('dream');
		expect(groups[2].text).toBe('is');
		expect(groups[3].text).toBe('a');
		expect(groups[4].text).toBe('wish');
		expect(groups[5].text).toBe('your');
		expect(groups[6].text).toBe('heart');
		expect(groups[7].text).toBe('makes');
	});
});


describe('splitAllStringGroups', () => {
	test('empty array', () => {
		const groups: MatchGroup[] = [];
		const splits: MatchGroup[] = splitAllStringGroups(groups);

		expect(splits.length).toBe(0);
	});

	test('group with empty StringGroup', () => {
		const groups: MatchGroup[] = [new StringGroup(EMPTY)];
		const splits: MatchGroup[] = splitAllStringGroups(groups);

		expect(splits.length).toBe(1);
		expect(splits[0].text).toBe(EMPTY);
	});

	test('group with StringGroup with spaces', () => {
		const groups: MatchGroup[] = [new StringGroup(DISPLAY)];
		const splits: MatchGroup[] = splitAllStringGroups(groups);

		expect(splits.length).toBe(8);
		expect(splits[0].text).toBe('A');
		expect(splits[1].text).toBe('dream');
		expect(splits[2].text).toBe('is');
		expect(splits[3].text).toBe('a');
		expect(splits[4].text).toBe('wish');
		expect(splits[5].text).toBe('your');
		expect(splits[6].text).toBe('heart');
		expect(splits[7].text).toBe('makes');
	});

	test('group with non-StringGroups', () => {
		const groups: MatchGroup[] = [
			new ExternalLinkGroup(EXTERNAL_LINK),
			new InternalLinkGroup(INTERNAL_LINK),
		];
		const splits: MatchGroup[] = splitAllStringGroups(groups);

		expect(splits.length).toBe(2);
		expect(splits[0]).toBeInstanceOf(ExternalLinkGroup);
		expect(splits[0].text).toBe(EXTERNAL_LINK);
		expect(splits[1]).toBeInstanceOf(InternalLinkGroup);
		expect(splits[1].text).toBe(INTERNAL_LINK);
	});
});


describe('splitCaptureGroups', () => {
	test('empty string', () => {
		const groups: MatchGroup[] = splitCaptureGroups(EMPTY, ExternalLinkGroup);
		
		expect(groups.length).toBe(0);
	});

	test('split on string', () => {
		const groups: MatchGroup[] = splitCaptureGroups(DISPLAY, ExternalLinkGroup);

		expect(groups.length).toBe(1);
		expect(groups[0].text).toBe(DISPLAY);
	});

	test('split on inline code', () => {
		const text = `${PRETEXT}${INLINE_CODE}${POSTTEXT}`;
		const groups: MatchGroup[] = splitCaptureGroups(text, InlineCodeGroup);

		expect(groups.length).toBe(3);
		expect(groups[0]).toBeInstanceOf(StringGroup);
		expect(groups[1]).toBeInstanceOf(InlineCodeGroup);
		expect(groups[2]).toBeInstanceOf(StringGroup);
	});

	test('split on external links', () => {
		const text = `${PRETEXT}${EXTERNAL_LINK}${POSTTEXT}`;
		const groups: MatchGroup[] = splitCaptureGroups(text, ExternalLinkGroup);

		expect(groups.length).toBe(3);
		expect(groups[0]).toBeInstanceOf(StringGroup);
		expect(groups[1]).toBeInstanceOf(ExternalLinkGroup);
		expect(groups[2]).toBeInstanceOf(StringGroup);
	});

	test('split on internal links', () => {
		const text = `${PRETEXT}${INTERNAL_LINK}${POSTTEXT}`;
		const groups: MatchGroup[] = splitCaptureGroups(text, InternalLinkGroup);

		expect(groups.length).toBe(3);
		expect(groups[0]).toBeInstanceOf(StringGroup);
		expect(groups[1]).toBeInstanceOf(InternalLinkGroup);
		expect(groups[2]).toBeInstanceOf(StringGroup);
	});

	test('split on MathJax expressions', () => {
		const text = `${PRETEXT}${MATHJAX}${POSTTEXT}`;
		const groups: MatchGroup[] = splitCaptureGroups(text, InlineMathJaxGroup);

		expect(groups.length).toBe(3);
		expect(groups[0]).toBeInstanceOf(StringGroup);
		expect(groups[1]).toBeInstanceOf(InlineMathJaxGroup);
		expect(groups[2]).toBeInstanceOf(StringGroup);
	});
});


describe('splitAllMatchGroups', () => {
	test('empty array', () => {
		const groups: MatchGroup[] = splitAllMatchGroups([]);

		expect(groups.length).toBe(0);
	});

	test('split on all match groups', () => {
		const text: string =
			`${PRETEXT}${INLINE_CODE}${EXTERNAL_LINK}${INTERNAL_LINK}`
			+ `${MATHJAX}${POSTTEXT}`;
		const groups: MatchGroup[] = [new StringGroup(text)];
		const splits: MatchGroup[] = splitAllMatchGroups(groups);

		expect(splits.length).toBe(9);
		expect(splits[0]).toBeInstanceOf(StringGroup);
		expect(splits[1]).toBeInstanceOf(StringGroup);
		expect(splits[2]).toBeInstanceOf(InlineCodeGroup);
		expect(splits[3]).toBeInstanceOf(ExternalLinkGroup);
		expect(splits[4]).toBeInstanceOf(InternalLinkGroup);
		expect(splits[5]).toBeInstanceOf(InlineMathJaxGroup);
		expect(splits[6]).toBeInstanceOf(StringGroup);
		expect(splits[7]).toBeInstanceOf(StringGroup);
		expect(splits[8]).toBeInstanceOf(StringGroup);
	});
});
