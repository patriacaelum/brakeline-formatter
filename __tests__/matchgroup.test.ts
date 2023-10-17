import { StringGroup, MarkdownLinkGroup, WikilinkGroup } from '../matchgroup';


test('fields are stored', () => {
    const text: string = 'a dream is a wish your heart makes';
    const group: StringGroup = new StringGroup(text);

    expect(group.text).toBe(text);
    expect(group.length).toBe(text.length);
});


test('fields are stored and text length is parsed', () => {
    const text: string = 'a dream is a wish your heart makes';
    const link: string = `[${text}](https://pinocchiomovie.come)`;
    const group: MarkdownLinkGroup = new MarkdownLinkGroup(link);

    expect(group.text).toBe(link);
    expect(group.length).toBe(text.length);
});


test('fields are stored and text length is parsed', () => {
    const text: string = 'a dream is a wish your heart makes';
    const link: string = `[[https://pinocchiomovie.com|${text}]]`;
    const group: WikilinkGroup = new WikilinkGroup(link);

    expect(group.text).toBe(link);
    expect(group.length).toBe(text.length);
});