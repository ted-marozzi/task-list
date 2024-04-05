# Contributing

## Development

1. Install [Hot reload](https://github.com/pjeby/hot-reload#installation)
1. Clone this repo to `./vault/.obsidian/plugins`
1. Make sure your NodeJS is at least v18 (`node --version`)
1. `npm i` to install dependencies
1. `npm run dev` to start compilation in watch mode

## API Documentation

See https://github.com/obsidianmd/obsidian-api

## Releasing new releases

1. Update the `manifest.json` with the new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
1. Update the `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of the plugin that's compatible if the minimum-obsidian-version changes
1. Update the `package.json` with the new version number.
1. Create a git tag such as `git tag -a 1.0.1 -m "1.0.1" && git push origin 1.0.1`
1. Upload the files `manifest.json`, `main.js` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
1. Publish the release.

## Adding your plugin to the community plugin list

1. Check https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md
1. Publish an initial version.
1. Make sure you have a `README.md` file in the root of your repo.
1. Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.
