import { window, commands, Disposable, StatusBarItem, StatusBarAlignment } from 'vscode';

import { TagsExplorer } from './TagsExplorer';
import { TagsDecorator } from './TagsDecorator';
import { TagsProvider } from './TagsProvider';


export class TagsLogic {
    private _statusBar: StatusBarItem;
    private _disposable: Disposable;

    constructor(private tagsExplorer : TagsExplorer,
        private tagsDecorator : TagsDecorator) {

        let disposables: Disposable[] = [];

        this._statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
        this._statusBar.tooltip = 'Show tags in file';
        this._statusBar.command = "extension.fileTags";
        disposables.push(this._statusBar);

        let fileTagsCommand = commands.registerCommand('extension.fileTags', () => {
            window.showInformationMessage('Hello World!');
        });
        disposables.push(fileTagsCommand);

        let tagsProvider = new TagsProvider();
        //window.registerTreeDataProvider('fileTags', tagsProvider);

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
    }

    private isTag(tag) : boolean {
        return tag.startsWith("#") && tag.replace(/#/g, "").length > 0;
    }

    dispose() {
        this._disposable.dispose();
    }
}