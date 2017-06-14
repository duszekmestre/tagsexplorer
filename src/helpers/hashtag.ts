import * as vscode from 'vscode';

export class HashTag {
    FileName: string;
    Content: string;
    Start: number;
    End: number; 
}

export class HashTagTreeItem /*extends vscode.TreeItem*/ {
    HashTag: HashTag;

    // constructor(
	// 	public readonly label: string,
	// 	public readonly collapsibleState: vscode.TreeItemCollapsibleState,
	// 	public readonly command?: vscode.Command
	// ) {
	// 	super(label, collapsibleState);
	// }
}