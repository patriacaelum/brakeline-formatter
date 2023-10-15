import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';


interface BrakelineFormatterSettings {
	characterLimit: int;
	// formatOnEdit: bool
}


const DEFAULT_SETTINGS: BrakelineFormatterSettings = {
	characterLimit: 80,
	// formatOnEdit: false,
}


export default class BrakelineFormatter extends Plugin {
	settings: BrakelineFormatterSettings;

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

				// Retrieve lines from editor
				const text: string = editor.getValue();
				const formatted: string = this.formatText(text);

				// Replace text in editor
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
			let indent: string = current;
			const trimmed: string = paragraph.trimStart();

			// Add indent for notes
			if (trimmed.startsWith('- ')) {
				indent += ' '.repeat(2);
			}

			// Add indent for numbered lists
			let numbered_list = trimmed.match(/^(\d+)\.\s/)

			if (numbered_list) {
				indent += ' '.repeat(numbered_list[0].length);
			}

			// Format paragraph
			const words: string[] = trimmed.split(' ');

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

	getLeadingSpaces(text: string): string {
		const match = text.match(/^\s*/);

		if (match) {
			return match[0];
		}

		return '';
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
			.setDesc("The maximum number of characters per line.")
			.addSlider(val => val
				.setLimits(60, 150, 1)
				.setValue(this.plugin.settings.characterLimit)
				.setDynamicTooltip()
				.onChange(async (value: number) => {
					this.plugin.settings.characterLimit = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
