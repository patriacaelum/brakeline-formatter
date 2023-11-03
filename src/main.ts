import {
	App,
	Editor,
	MarkdownView,
	Plugin,
	PluginManifest,
	PluginSettingTab,
	Setting
} from 'obsidian';

import { StringFormatter } from './string_formatter';


interface BrakelineFormatterSettings {
	characterLimit: number;
	newlinesBeforeHeader: number;
	newlinesAfterHeader: number;
}


const DEFAULT_SETTINGS: BrakelineFormatterSettings = {
	characterLimit: 80,
	newlinesBeforeHeader: 1,
	newlinesAfterHeader: 1,
}


export default class BrakelineFormatter extends Plugin {
	settings: BrakelineFormatterSettings;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);

		this.settings = DEFAULT_SETTINGS;
	}

	override async onload() {
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
				const formatter: StringFormatter = new StringFormatter(
					text,
					this.settings.characterLimit,
					this.settings.newlinesBeforeHeader,
					this.settings.newlinesAfterHeader,
				);
				const formatted: string = formatter.format();
				editor.setValue(formatted);
			}
		});

		// This adds a settings tab so the user can configure various aspects
		// of the plugin
		this.addSettingTab(new BrakelineFormatterSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear
		// the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000)
		);
	}

	override onunload() {}

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
			.setName('Character Limit')
			.setDesc('The maximum number of characters per line')
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
			.setName('Newlines before header')
			.setDesc('The minimum number of newlines before a header')
			.addSlider(val => val
				.setLimits(0, 5, 1)
				.setValue(this.plugin.settings.newlinesBeforeHeader)
				.setDynamicTooltip()
				.onChange(async (value: number) => {
					this.plugin.settings.newlinesBeforeHeader = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Newlines after header')
			.setDesc('The minimum number of newlines after a header')
			.addSlider(val => val
				.setLimits(0, 5, 1)
				.setValue(this.plugin.settings.newlinesAfterHeader)
				.setDynamicTooltip()
				.onChange(async (value: number) => {
					this.plugin.settings.newlinesAfterHeader = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
