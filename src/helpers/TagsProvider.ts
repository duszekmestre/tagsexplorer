import * as vscode from 'vscode';

import { HashTag, HashTagTreeItem } from './hashtag';

export class TagsProvider implements vscode.TreeDataProvider<HashTagTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<HashTagTreeItem | undefined> = new vscode.EventEmitter<HashTagTreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<HashTagTreeItem | undefined> = this._onDidChangeTreeData.event;
	private currentEditorFileTags: HashTag[];

	refresh(fileTags: HashTag[]) : void {
		this.currentEditorFileTags = fileTags;
		this._onDidChangeTreeData.fire();
	}

    getTreeItem(element: HashTagTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: HashTagTreeItem): Thenable<HashTagTreeItem[]> {
		return new Promise(resolve => {
			if (this.currentEditorFileTags === null || this.currentEditorFileTags.length === 0) {
				resolve([]);
				return;
			}

			let result : HashTagTreeItem[] = [];
			
			if (element) {
				element.HashTags.forEach(tag => {
					let cmd : vscode.Command = {
						command: 'extension.goToTag', 
						title: '',
						arguments: [tag]
					};

					let tagTreeItem = new HashTagTreeItem(tag.toString(), vscode.TreeItemCollapsibleState.None, cmd);					

					result.push(tagTreeItem);
				});
			} else {
				this.currentEditorFileTags.forEach(tag => {
					let tagTreeItem = result.find(item => item.Content === tag.Content);
					if (!tagTreeItem) {
						let cmd : vscode.Command = {
							command: 'extension.goToTag', 
							title: '',
							arguments: [tag]
						};

						tagTreeItem = new HashTagTreeItem(tag.Content, vscode.TreeItemCollapsibleState.Collapsed, cmd);
						tagTreeItem.Content = tag.Content;
						result.push(tagTreeItem);
					}

					tagTreeItem.command.arguments.push(tag);
					tagTreeItem.HashTags.push(tag);
				});
			}

			return resolve(result);
		});
	}
}