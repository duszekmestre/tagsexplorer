import * as vscode from 'vscode';

import { HashTag, HashTagTreeItem } from './hashtag';

export class TagsProvider implements vscode.TreeDataProvider<HashTagTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<HashTagTreeItem | undefined> = new vscode.EventEmitter<HashTagTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<HashTagTreeItem | undefined> = this._onDidChangeTreeData.event;
	private currentEditorFileTags: HashTag[];

	private rootTree: HashTagTreeItem[] = [];

	refresh(fileTags: HashTag[]): void {
		this.currentEditorFileTags = fileTags;
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: HashTagTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: HashTagTreeItem): Thenable<HashTagTreeItem[]> {
		return new Promise(resolve => {
			if (!this.currentEditorFileTags || this.currentEditorFileTags.length === 0) {
				resolve([]);
				return;
			}

			if (element) {
				let subTree: HashTagTreeItem[] = [];				
				element.HashTags.forEach(tag => {
					let cmd: vscode.Command = {
						command: 'extension.goToTag',
						title: '',
						arguments: [tag]
					};

					let tagTreeItem = new HashTagTreeItem(tag.toString(), vscode.TreeItemCollapsibleState.None, cmd);

					subTree.push(tagTreeItem);
				});

				subTree = subTree.sort(this.sorter);
				resolve(subTree);
			} else {
				this.rootTree.forEach(x => {
					x.HashTags = [];
					x.command.arguments = [];
				});

				this.currentEditorFileTags.forEach(tag => {
					let tagTreeItem = this.rootTree.find(item => item.Content === tag.Content);
					if (!tagTreeItem) {
						let cmd: vscode.Command = {
							command: 'extension.goToTag',
							title: '',
							arguments: [tag]
						};

						tagTreeItem = new HashTagTreeItem(tag.Content, vscode.TreeItemCollapsibleState.Collapsed, cmd);
						tagTreeItem.Content = tag.Content;
						this.rootTree.push(tagTreeItem);
					}

					tagTreeItem.command.arguments.push(tag);
					tagTreeItem.HashTags.push(tag);
				});

				this.rootTree = this.rootTree
					.filter(item => item.HashTags.length > 0)
					.sort(this.sorter);

				resolve(this.rootTree);
			}
		});
	}

	private sorter(a, b) {
		if (a.label.toLocaleLowerCase() == b.label.toLocaleLowerCase()) {
			return 0;
		}

		return a.label.toLocaleLowerCase() < b.label.toLocaleLowerCase() ? -1 : 1;
	}
}