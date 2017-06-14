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

        this.tagsLogic.editorChanged();

        this._disposable = vscode.Disposable.from(...subscriptions);                
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this.tagsLogic.editorChanged();
    }
}