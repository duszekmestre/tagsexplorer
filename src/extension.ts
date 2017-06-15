'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { TagsExplorer } from './helpers/TagsExplorer';
import { TagsDecorator } from './helpers/TagsDecorator';
import { TagsLogic } from './helpers/TagsLogic';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let tagsExplorer = new TagsExplorer();
    let tagsDecorator = new TagsDecorator();
    let tagsLogic = new TagsLogic(tagsExplorer, tagsDecorator);

    let tagsController = new TagsController(tagsLogic);

    context.subscriptions.push(tagsLogic);
    context.subscriptions.push(tagsController);
}

class TagsController {
    private _disposable: vscode.Disposable;

    constructor(private tagsLogic: TagsLogic) {

        let subscriptions: vscode.Disposable[] = [];

        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        vscode.workspace.onDidCloseTextDocument(this.untitledRemoved, this, subscriptions);

        let watcher = vscode.workspace.createFileSystemWatcher("**/*", false, false, false);
        watcher.onDidCreate(this.fileChanged, this, subscriptions);
        watcher.onDidChange(this.fileChanged, this, subscriptions);
        watcher.onDidDelete(this.fileRemoved, this, subscriptions);

        this.tagsLogic.workspaceChanged();

        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this.tagsLogic.editorChanged();
    }

    private fileChanged(uri: vscode.Uri) {
        this.tagsLogic.tagsExplorer.reloadUriTags(uri).then(tags => {
            this.tagsLogic.tagsProvider.refresh(tags);
        });
    }

    private fileRemoved(uri: vscode.Uri) {
        let tags = this.tagsLogic.tagsExplorer.removeUriTags(uri);
        this.tagsLogic.tagsProvider.refresh(tags);
    }

    private untitledRemoved(file: vscode.TextDocument) {
        if (file.uri.scheme === "untitled") {
            let tags = this.tagsLogic.tagsExplorer.removeUriTags(file.uri);
            this.tagsLogic.tagsProvider.refresh(tags);
        }
    }
}