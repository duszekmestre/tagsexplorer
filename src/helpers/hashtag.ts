import * as vscode from 'vscode';

export class HashTag {
    FileName: string;
    Content: string;
    Start: number;
    End: number; 

    toString() {
      return `${this.FileName}:${this.Start}-${this.End}`;
    }
}

export class HashTagTreeItem extends vscode.TreeItem {
    Content: string;
    HashTags: HashTag[];

    constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
        super.command = command;

        this.HashTags = [];
	}
}