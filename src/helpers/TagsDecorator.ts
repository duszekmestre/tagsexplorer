import { window, workspace, commands, Uri, TextDocument, TextEditor, Range } from 'vscode';

import { HashTag } from './hashtag';

const defaultTagDecorator = window.createTextEditorDecorationType({
    backgroundColor: 'green',
    color: 'white',
    textDecoration: 'font-weight: bold;'
});

const selectedTagDecorator = window.createTextEditorDecorationType({
    backgroundColor: 'orange',
    color: 'white',
    textDecoration: 'font-weight: bold;'
});

export class TagsDecorator {
    decorateTags(editor: TextEditor, fileTags: HashTag[]) {
        let doc = editor.document;

        let tagsPositions = fileTags.map(tag => {
            let startPositon = doc.positionAt(tag.Start);
            let endPositon = doc.positionAt(tag.End);

            const decoration = { range: new Range(startPositon, endPositon) };

            return decoration;
        });

        editor.setDecorations(defaultTagDecorator, tagsPositions);
        editor.setDecorations(selectedTagDecorator, []);
    }

    highlightTags(highlightedTags: HashTag[]) {
        let editor = window.activeTextEditor;

        if (editor) {
            this.highlightTagsInActiveDocument(editor, highlightedTags);
        }

        if (highlightedTags.length === 1) {
            this.goToTag(editor, highlightedTags[0]);
        }
    }

    private goToTag(editor: TextEditor, tag: HashTag) {
        if (!editor || editor.document.fileName !== tag.FileName) {
            let openedDocs = workspace.textDocuments;

            var openedDoc = openedDocs.find(odoc => odoc.fileName === tag.FileName);

            if (openedDoc) {
                this.openAndGoToTag(openedDoc, tag);
            } else {
                workspace.openTextDocument(tag.FileName).then(document => {
                    this.openAndGoToTag(document, tag);
                }, (error: Error) => {
                });
            }            
        } else {
            this.goToTagPosition(editor, tag);
        }
    }

    private openAndGoToTag(document: TextDocument, tag: HashTag) {
        window.showTextDocument(document).then(openedEditor => {
            if (openedEditor && openedEditor.document.fileName === tag.FileName) {
                this.goToTagPosition(openedEditor, tag);
                this.highlightTagsInActiveDocument(openedEditor, [tag]);
            }
        });
    }

    private goToTagPosition(editor: TextEditor, tag: HashTag) {
        let startPositon = editor.document.positionAt(tag.Start);
        let endPositon = editor.document.positionAt(tag.End);

        editor.revealRange(new Range(startPositon, endPositon));
    }

    private highlightTagsInActiveDocument(editor: TextEditor, highlightedTags: HashTag[]) {
        let doc = editor.document;
        let tagsPositions = highlightedTags
            .filter(tag => tag.FileName === doc.fileName)
            .map(tag => {
                let startPositon = doc.positionAt(tag.Start);
                let endPositon = doc.positionAt(tag.End);

                const decoration = { range: new Range(startPositon, endPositon) };

                return decoration;
            });

        editor.setDecorations(selectedTagDecorator, tagsPositions);
    }
}