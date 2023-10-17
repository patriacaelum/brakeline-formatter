import { App, Editor, MarkdownView, Plugin, PluginManifest, PluginSettingTab, Setting } from 'obsidian';
import { MatchGroup, StringGroup, MarkdownLinkGroup, WikilinkGroup } from 'matchgroup';


interface BrakelineFormatterSettings {
	characterLimit: number;
	ignoreWikiLinks: boolean;
	ignoreMarkdownLinks: boolean;
	// formatOnEdit: bool
}


const DEFAULT_SETTINGS: BrakelineFormatterSettings = {
	characterLimit: 80,
	ignoreWikiLinks: true,
	ignoreMarkdownLinks: true,
	// formatOnEdit: false,
}


export default class BrakelineFormatter extends Plugin {
	settings: BrakelineFormatterSettings;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);

		this.settings = DEFAULT_SETTINGS;
	}

	async onload() {
		// Runs whenever the user starts using the plugin
		await this.loadSettings();

		this.addCommand({
			id: "format",
			name: "Run autoformatter",
			editorCallback: (editor: Editor) => {
				// Only run if in markdown
				const is_markdown = this.app.workspace.getActiveViewOfType(MarkdownView);

				if (!is_markdown) {
					return;
				}

				// Retrieve, format, then replace text in editor
				const text: string = editor.getValue();
				const formatted: string = this.formatText(text);
				editor.setValue(formatted);
			}
		})

		// This adds a settings tab so the user can configure various aspects
		// of the plugin
		this.addSettingTab(new BrakelineFormatterSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear
		// the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000)
		);
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	formatText(text: string): string {
		// Format text
		const paragraphs: string[] = text.split('\n');
		let result: string[] = [];

		for (let paragraph of paragraphs) {
			// Preserve existing indent
			let current: string = this.getLeadingSpaces(paragraph);
			const trimmed: string = paragraph.trimStart();
			let indent: string = current + this.getIndent(trimmed);

			// Split words over link formats
			// let words: MatchGroup[] = [StringGroup(trimmed)];
			// words = this.splitGroups(words, this.splitMarkDownLink);
			// words = this.splitGroups(words, this.splitWikilink);
			const words: string[] = trimmed.split(' ');

			// Format paragraph
			for (const word of words) {
				const length: number = current.length + word.length + 1;
				if (length <= this.settings.characterLimit) {
					if (current.length > 0 && !current.match(/\s$/)) {
						current += ' ';
					}

					current += word;
				}
				else {
					result.push(current);
					current = indent + word;
				}
			}

			result.push(current);
		}

		const formatted: string = result.join('\n');

		return formatted;
	}

	getIndent(text: string): string {
		let indent: number = 0;

		// Add indent for notes
		if (text.startsWith('- ')) {
			indent += 2;
		}

		// Add indent for numbered lists
		let numbered_list = text.match(/^(\d+)\.\s/)

		if (numbered_list) {
			indent += numbered_list[0].length;
		}

		return ' '.repeat(indent);
	}

	getLeadingSpaces(text: string): string {
		const match = text.match(/^\s*/);

		if (match) {
			return match[0];
		}

		return '';
	}

	splitGroups(
		groups: MatchGroup[],
		splitCallback: (text: string) => MatchGroup[]
	): MatchGroup[] {
		let result: MatchGroup[] = [];

		for (const group of groups) {
			if (group instanceof StringGroup) {
				result.push(...splitCallback(group.text));
			}
			else {
				result.push(group);
			}
		}

		return result;
	}

	splitMarkdownLink(text: string): MatchGroup[] {
		const re_markdown: RegExp = /\[.*?\]\(.*?\)/g;

		const not_links: string[] = text.split(re_markdown);
		let links: string[] = [];
		let matches = text.match(re_markdown);

		if (matches) {
			links = matches;
		}

		const i_max: number = Math.max(not_links.length, links.length);
		let result: MatchGroup[] = [];

		for (let i = 0; i < i_max; i++) {
			if (i < not_links.length) {
				result.push(new StringGroup(not_links[i]));
			}

			if (i < links.length) {
				result.push(new MarkdownLinkGroup(links[i]));
			}
		}

		return result;
	}

	splitWikilink(text: string): MatchGroup[] {
		const re_wikilink: RegExp = /\[\[.*?\]\]/g;

		const not_links: string[] = text.split(re_wikilink);
		let links: string[] = [];
		let matches = text.match(re_wikilink);

		if (matches) {
			links = matches;
		}

		const i_max: number = Math.max(not_links.length, links.length);
		let result: MatchGroup[] = [];

		for (let i = 0; i < i_max; i++) {
			if (i < not_links.length) {
				result.push(new StringGroup(not_links[i]));
			}

			if (i < links.length) {
				result.push(new WikilinkGroup(links[i]));
			}
		}

		return result;
	}
}


class BrakelineFormatterSettingTab extends PluginSettingTab {
	plugin: BrakelineFormatter;

	constructor(app: App, plugin: BrakelineFormatter) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Character Limit")
			.setDesc("The maximum number of characters per line")
			.addSlider(val => val
				.setLimits(60, 150, 1)
				.setValue(this.plugin.settings.characterLimit)
				.setDynamicTooltip()
				.onChange(async (value: number) => {
					this.plugin.settings.characterLimit = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Ignore wikilinks")
			.setDesc("If enabled, wikilink style links will not count toward the character limit")
			.addToggle(val => val
				.setValue(this.plugin.settings.ignoreWikiLinks)
				.onChange(async (value: boolean) => {
					this.plugin.settings.ignoreWikiLinks = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Ignore markdown links")
			.setDesc("If enabled, markdown style links will not count toward the character limit")
			.addToggle(val => val
				.setValue(this.plugin.settings.ignoreMarkdownLinks)
				.onChange(async (value: boolean) => {
					this.plugin.settings.ignoreMarkdownLinks = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
