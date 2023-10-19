import { splitMatchGroups, splitAllMatchGroups } from '../split_matchgroup';
import {
	MatchGroup,
	StringGroup,
	ExternalLinkGroup,
	InternalLinkGroup,
} from '../matchgroup';


const pre_text: string = 'cinderella sings';
const display: string = 'a dream is a wish your heart makes';
const outgoing_link: string = 'https://cinderellasonglyrics.com';
const internal_link: string = 'songs#from cinderella';
const post_text: string = 'in the movie';

const markdown_link: string = `[${display}](${outgoing_link})`;
const wikilink: string = `[[${internal_link}|${display}]]`


describe('splitMatchGroups', () => {
	test('split on external links', () => {
		const text: string = `${pre_text}${markdown_link}${post_text}`;
		const groups: MatchGroup[] = splitMatchGroups(text, ExternalLinkGroup);

		expect(groups.length).toBe(3);
		expect(groups[0]).toBeInstanceOf(StringGroup);
		expect(groups[1]).toBeInstanceOf(ExternalLinkGroup);
		expect(groups[2]).toBeInstanceOf(StringGroup);
	});

	test('split on internal links', () => {
		const text: string = `${pre_text}${wikilink}${post_text}`;
		const groups: MatchGroup[] = splitMatchGroups(text, InternalLinkGroup);

		expect(groups.length).toBe(3);
		expect(groups[0]).toBeInstanceOf(StringGroup);
		expect(groups[1]).toBeInstanceOf(InternalLinkGroup);
		expect(groups[2]).toBeInstanceOf(StringGroup);
	});
});


describe('splitAllMatchGroups', () => {
	test('split on all groups', () => {
		const text: string = `${pre_text}${markdown_link}${wikilink}${post_text}`;
		const groups: MatchGroup[] = [new StringGroup(text)];
		const splits: MatchGroup[] = splitAllMatchGroups(groups);

		expect(splits.length).toBe(4);
		expect(splits[0]).toBeInstanceOf(StringGroup);
		expect(splits[1]).toBeInstanceOf(ExternalLinkGroup);
		expect(splits[2]).toBeInstanceOf(InternalLinkGroup);
		expect(splits[3]).toBeInstanceOf(StringGroup);
	});
});
