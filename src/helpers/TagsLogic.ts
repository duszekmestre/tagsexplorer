import { window, commands, Disposable, StatusBarItem, StatusBarAlignment } from 'vscode';

import { TagsExplorer } from './TagsExplorer';
import { TagsDecorator } from './TagsDecorator';
import { TagsProvider } from './TagsProvider';


export class TagsLogic {
    private _statusBar: StatusBarItem;
    private _disposable: Disposable;
    private tagsProvider: TagsProvider;

    constructor(private tagsExplorer : TagsExplorer,
        private tagsDecorator : TagsDecorator) {

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

        var fileTags = this.tagsExplorer.retrieveTags(editor);
        this.tagsDecorator.decorateTags(editor, fileTags);
        this._statusBar.text = `$(tag) Tags count: ${fileTags.length}`;

        this._statusBar.show();
        
        this.tagsProvider.refresh(fileTags);
    }

    private isTag(tag) : boolean {
        return tag.startsWith("#") && tag.replace(/#/g, "").length > 0;
    }

    dispose() {
        this._disposable.dispose();
    }
}