# Change Log
All notable changes to the "tagsexplorer" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to to [Semantic Versioning](http://semver.org).

## [Unreleased]
- Initial release

## [0.0.3] - 2017-06-14
### Added
- File tags explorer
- Possibility to select tag (or tags) and move to selected tag
- Refreshing tags in current file by pressing tags counter or using command "Refresh file tags"

### Changed
- Tags counter move to the right side of status bar
- Several code improvements

## [0.0.4] - 2017-06-15
### Added
- Refreshing tags on every workspace and file change
- Loading tags from all workspace (files in opened folder)
- Add command "Refresh workspace tags"
- Go to tag even to closed file

### Changed
- File tags explorer changed to workspace explorer

### Known bugs
- On bug workspaces VSCode can freeze or even crash :(

## [0.0.5] - 2017-06-15
### Added
- List of text files extensions

### Changed
- Now check only text files (based on extension) for tags

### Known bugs
- On bug workspaces VSCode can freeze or even crash :( - Please don't use this version on every day work