'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let tagsCounter = new TagsCounter();

    let tagsController = new TagsController(tagsCounter);

    context.subscriptions.push(tagsCounter);
    context.subscriptions.push(tagsController);
}

const tagDecorator = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'green',
    color: 'white',
    textDecoration: 'font-weight: bolc;'
});

class TagsCounter {
    private _statusBar: vscode.StatusBarItem;

    public countTags() {
        if (!this._statusBar) {
            this._statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBar.hide();
            return;
        }


        let tagsCount = this.decorateTags(editor);
        this._statusBar.text = `$(tag) Tags count: ${tagsCount}`;

        this._statusBar.show();
    }

    private decorateTags(editor: vscode.TextEditor) : number {
        const hashtagRegex = /(^|[\s]|\/\/)(#[a-zA-Z0-9][\w-]*)\b/g;
        const tagsPositions: vscode.DecorationOptions[] = [];
        let tagsCount = 0;

        let doc = editor.document;
        let content = doc.getText();

        let regexResult;
        while ((regexResult = hashtagRegex.exec(content)) !== null) {
            if (regexResult.index === hashtagRegex.lastIndex) {
                hashtagRegex.lastIndex++;
            }
            
            var tagStart = regexResult.index;
            var tagEnd = tagStart + regexResult[0].length;
            tagStart += regexResult[1].length;

            let tagContent = regexResult[2];

            let startPositon = doc.positionAt(tagStart);
            let endPositon = doc.positionAt(tagEnd);
            const decoration = { range: new vscode.Range(startPositon, endPositon) };
            tagsPositions.push(decoration);

            tagsCount++;
        }
        
        editor.setDecorations(tagDecorator, tagsPositions);   

        return tagsCount;
    }

    private isTag(tag) : boolean {
        return tag.startsWith("#") && tag.replace(/#/g, "").length > 0;
    }

    dispose() {
        this._statusBar.dispose();
    }
}

class TagsController {
    private _disposable: vscode.Disposable;

    constructor(private tagsCounter: TagsCounter) {

        let subscriptions: vscode.Disposable[] = [];

        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this.tagsCounter.countTags();

        this._disposable = vscode.Disposable.from(...subscriptions);                
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this.tagsCounter.countTags();
    }
}