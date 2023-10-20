import {
	MatchGroup,
	StringGroup,
	CaptureGroup,
	ExternalLinkGroup,
	InternalLinkGroup,
	InlineMathJaxGroup,
} from './matchgroup';


const CAPTURE_GROUPS = new Map<number, typeof CaptureGroup>();
CAPTURE_GROUPS.set(0, ExternalLinkGroup);
CAPTURE_GROUPS.set(1, InternalLinkGroup);
CAPTURE_GROUPS.set(2, InlineMathJaxGroup);


/**
 * Splits a string into an array of StringGroups over spaces.
 */
export function splitStringGroups(text: string): MatchGroup[] {
	const words: string[] = text.split(' ');
	let groups: StringGroup[] = [];

	for (const word of words) {
		groups.push(new StringGroup(word));
	}

	return groups;
}


/**
 * Splits an array of MatchGroups into an array with equal or more MatchGroups
 * by splitting the StringGroups into smaller StringGroups.
 */
export function splitAllStringGroups(groups: MatchGroup[]): MatchGroup[] {
	let result: MatchGroup[] = [];

	for (const group of groups) {
		if (group instanceof StringGroup) {
			result.push(...splitStringGroups(group.text));
		}
		else {
			result.push(group);
		}
	}

	return result;
}


/**
 * Splits a string into an array of MatchGroups using a regular expression
 * associated with the specified CaptureGroup while maintaining order.
 */
export function splitCaptureGroups(
	text: string,
	group_class: typeof CaptureGroup
): MatchGroup[] {
	const non_matches: string[] = text.split(group_class.regexp);
	let matches: string[] = [];
	let match = text.match(group_class.regexp);

	if (match) {
		matches = match;
	}

	const i_max: number = Math.max(non_matches.length, matches.length);
	let result: MatchGroup[] = [];

	for (let i = 0; i < i_max; i++) {
		if (i < non_matches.length && non_matches[i] !== '') {
			result.push(new StringGroup(non_matches[i]));
		}

		if (i < matches.length && matches[i] !== '') {
			result.push(new group_class(matches[i]));
		}
	}

	return result;
}


/**
 * Splits an array of MatchGroup into an array of equal or more MatchGroups
 * by splitting on all CaptureGroups and spaces while maintaining order.
 *
 * The CAPTURE_GROUPS indicate all different types of CaptureGroups,
 * decrementing the index so that every CaptureGroup is used as a split unless
 * the group has already been identified as another CaptureGroup.
 */
export function splitAllMatchGroups(
	groups: MatchGroup[],
	index: number = CAPTURE_GROUPS.size - 1
): MatchGroup[] {
	const group_class: typeof CaptureGroup | undefined = CAPTURE_GROUPS.get(index);

	if (!group_class) {
		return splitAllStringGroups(groups);
	}

	let result: MatchGroup[] = [];

	for (const group of groups) {
		if (group instanceof StringGroup) {
			const subgroup: MatchGroup[] = splitCaptureGroups(
				group.text,
				group_class
			);
			result.push(...splitAllMatchGroups(subgroup, index - 1));
		}
		else {
			result.push(group);
		}
	}

	return result;
}
