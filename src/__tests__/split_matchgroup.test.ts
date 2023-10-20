import {
	splitStringGroups,
	splitAllStringGroups,
	splitCaptureGroups,
	splitAllMatchGroups,
} from '../split_matchgroup';
import {
	MatchGroup,
	StringGroup,
	ExternalLinkGroup,
	InternalLinkGroup,
	InlineMathJaxGroup,
} from '../matchgroup';


const empty: string = '';
const pre_text: string = 'cinderella sings';
const display: string = 'a dream is a wish your heart makes';
const url: string = 'https://cinderellasonglyrics.com';
const wikilink: string = 'songs#from cinderella';
const mathjax: string = '$e^{2i\\pi} = 1$';
const post_text: string = 'in the movie';

const external_link: string = `[${display}](${url})`;
const internal_link: string = `[[${wikilink}|${display}]]`


describe('splitStringGroups', () => {
	test('empty string', () => {
		const groups: MatchGroup[] = splitStringGroups(empty)

		expect(groups.length).toBe(1);
		expect(groups[0].text).toBe(empty);
	});

	test('string with no spaces', () => {
		const groups: MatchGroup[] = splitStringGroups(url);

		expect(groups.length).toBe(1);
		expect(groups[0].text).toBe(url);
	});

	test('string with spaces', () => {
		const groups: MatchGroup[] = splitStringGroups(display);

		expect(groups.length).toBe(8);
		expect(groups[0].text).toBe('a');
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
		const groups: MatchGroup[] = [new StringGroup(empty)];
		const splits: MatchGroup[] = splitAllStringGroups(groups);

		expect(splits.length).toBe(1);
		expect(splits[0].text).toBe(empty);
	});

	test('group with StringGroup with spaces', () => {
		const groups: MatchGroup[] = [new StringGroup(display)];
		const splits: MatchGroup[] = splitAllStringGroups(groups);

		expect(splits.length).toBe(8);
		expect(splits[0].text).toBe('a');
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
			new ExternalLinkGroup(external_link),
			new InternalLinkGroup(internal_link),
		];
		const splits: MatchGroup[] = splitAllStringGroups(groups);

		expect(splits.length).toBe(2);
		expect(splits[0]).toBeInstanceOf(ExternalLinkGroup);
		expect(splits[0].text).toBe(external_link);
		expect(splits[1]).toBeInstanceOf(InternalLinkGroup);
		expect(splits[1].text).toBe(internal_link);
	});
});


describe('splitCaptureGroups', () => {
	test('empty string', () => {
		const groups: MatchGroup[] = splitCaptureGroups(empty, ExternalLinkGroup);
		
		expect(groups.length).toBe(0);
	});

	test('split on string', () => {
		const groups: MatchGroup[] = splitCaptureGroups(display, ExternalLinkGroup);

		expect(groups.length).toBe(1);
		expect(groups[0].text).toBe(display);
	});

	test('split on external links', () => {
		const text: string = `${pre_text}${external_link}${post_text}`;
		const groups: MatchGroup[] = splitCaptureGroups(text, ExternalLinkGroup);

		expect(groups.length).toBe(3);
		expect(groups[0]).toBeInstanceOf(StringGroup);
		expect(groups[1]).toBeInstanceOf(ExternalLinkGroup);
		expect(groups[2]).toBeInstanceOf(StringGroup);
	});

	test('split on internal links', () => {
		const text: string = `${pre_text}${internal_link}${post_text}`;
		const groups: MatchGroup[] = splitCaptureGroups(text, InternalLinkGroup);

		expect(groups.length).toBe(3);
		expect(groups[0]).toBeInstanceOf(StringGroup);
		expect(groups[1]).toBeInstanceOf(InternalLinkGroup);
		expect(groups[2]).toBeInstanceOf(StringGroup);
	});

	test('split on MathJax expressions', () => {
		const text: string = `${pre_text}${mathjax}${post_text}`;
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
		const text: string = `${pre_text}${external_link}${internal_link}${post_text}`;
		const groups: MatchGroup[] = [new StringGroup(text)];
		const splits: MatchGroup[] = splitAllMatchGroups(groups);

		expect(splits.length).toBe(7);
		expect(splits[0]).toBeInstanceOf(StringGroup);
		expect(splits[1]).toBeInstanceOf(StringGroup);
		expect(splits[2]).toBeInstanceOf(ExternalLinkGroup);
		expect(splits[3]).toBeInstanceOf(InternalLinkGroup);
		expect(splits[4]).toBeInstanceOf(StringGroup);
		expect(splits[5]).toBeInstanceOf(StringGroup);
		expect(splits[6]).toBeInstanceOf(StringGroup);
	});
});
