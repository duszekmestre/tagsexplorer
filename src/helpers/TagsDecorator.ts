import { window, TextEditor, Range } from 'vscode';

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
    }
}