import {
	App,
	Editor,
	MarkdownView,
	Plugin,
	PluginManifest,
	PluginSettingTab,
	Setting
} from 'obsidian';

import { formatString } from './format_string';


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
				const is_markdown = this.app.workspace
					.getActiveViewOfType(MarkdownView);

				if (!is_markdown) {
					return;
				}

				// Retrieve, format, then replace text in editor
				const text: string = editor.getValue();
				const formatted: string = formatString(text, this.settings.characterLimit);
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
