# Brakeline Formatter

![Build](https://github.com/patriacaelum/brakeline-formatter/actions/workflows/build.yml/badge.svg)
![Lint](https://github.com/patriacaelum/brakeline-formatter/actions/workflows/lint_test_coverage.yml/badge.svg)

## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`,
  and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with
  `"new-plugin-version": "minimum-obsidian-version"` so older versions of
  Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version".
  Use the exact version number, don't include a prefix `v`.
  `git tag -a 1.0.1 -m '1.0.1' && git push origin 1.0.1`
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary
  attachments. Note: The manifest.json file must be in two places, first the
  root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`,
  `npm version minor` or `npm version major` after updating `minAppVersion`
  manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add
  the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add
  your plugin.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault
  `VaultFolder/.obsidian/plugins/your-plugin-id/`.
