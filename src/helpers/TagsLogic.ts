import { window, commands, Disposable, StatusBarItem, StatusBarAlignment } from 'vscode';

import { TagsExplorer } from './TagsExplorer';
import { TagsDecorator } from './TagsDecorator';
import { TagsProvider } from './TagsProvider';


export class TagsLogic {
    private _statusBar: StatusBarItem;
    private _disposable: Disposable;
    readonly tagsProvider: TagsProvider;

    constructor(readonly tagsExplorer : TagsExplorer,
        readonly tagsDecorator : TagsDecorator) {

        let disposables: Disposable[] = [];

        this._statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
        this._statusBar.tooltip = 'Show tags in file';
        this._statusBar.command = "extension.fileTags";
        disposables.push(this._statusBar);

        this.tagsProvider = new TagsProvider();
        window.registerTreeDataProvider('fileTags', this.tagsProvider);

        let fileTagsCommand = commands.registerCommand('extension.fileTags', () => {
            this.editorChanged();
        });
        disposables.push(fileTagsCommand);

        let workspaceTagsCommand = commands.registerCommand('extension.workspaceTags', () => {
            this.workspaceChanged();
        });
        disposables.push(workspaceTagsCommand);

        let goToTagCommand = commands.registerCommand('extension.goToTag', (...args) => {
            this.tagsDecorator.highlightTags(args);
        });
        disposables.push(goToTagCommand);

        this._disposable = Disposable.from(...disposables);  
    }

    public editorChanged() {
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBar.hide();
            return;
        }

        var fileTags = this.tagsExplorer.reloadEditorTags(editor);
        this.tagsDecorator.decorateTags(editor, fileTags);
        this._statusBar.text = `$(tag) Tags count: ${fileTags.length}`;

        this._statusBar.show();
        
        this.tagsProvider.refresh(this.tagsExplorer.HashTags);
    }

    public workspaceChanged() {
        this.tagsExplorer.reloadWorkspaceTags().then((tags) => {
            this.tagsProvider.refresh(tags);
            if (window.activeTextEditor) {
                this.tagsDecorator.decorateTags(
                    window.activeTextEditor, 
                    tags.filter(tag => tag.FileName === window.activeTextEditor.document.fileName));
            }
        });
    }

    dispose() {
        this._disposable.dispose();
    }
}