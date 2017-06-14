import { TextEditor } from 'vscode';

import { HashTag } from './hashtag';

export class TagsExplorer {
    private HashTags : HashTag[] = [];

    retrieveTags(editor: TextEditor) {
        let fileName = editor.document.fileName

        const hashtagRegex = /(^|[\s]|\/\/)(#[a-zA-Z0-9][\w-]*)\b/g;

        let doc = editor.document;
        let content = doc.getText();

        this.HashTags = this.HashTags.filter(x => x.FileName !== fileName);

        let regexResult;
        while ((regexResult = hashtagRegex.exec(content)) !== null) {
            if (regexResult.index === hashtagRegex.lastIndex) {
                hashtagRegex.lastIndex++;
            }
            
            var tagStart = regexResult.index;
            var tagEnd = tagStart + regexResult[0].length;
            tagStart += regexResult[1].length;

            let tagContent = regexResult[2];

            let hashTag = new HashTag();
            hashTag.FileName = fileName;
            hashTag.Start = tagStart;
            hashTag.End = tagEnd;
            hashTag.Content = tagContent;

            this.HashTags.push(hashTag); 
        }

        return this.HashTags.filter(x => x.FileName === fileName);
    }
}