import { workspace, Uri, TextEditor, TextDocument } from 'vscode';

import { HashTag } from './hashtag';

export class TagsExplorer {
    HashTags: HashTag[] = [];

    removeUriTags(uri: Uri) : HashTag[] {
        this.HashTags = this.HashTags
            .filter(tag => tag.FileName !== uri.fsPath);

        return this.HashTags;
    }

    reloadFileTags(path: string) : Thenable<HashTag[]> {
        var uri = Uri.parse(path);
        return this.reloadUriTags(uri);
    }

    reloadUriTags(uri: Uri) : Thenable<HashTag[]> {
        return new Promise<HashTag[]>(resolve => {
            workspace.openTextDocument(uri).then(doc => {
                if (doc) {
                    this.HashTags = this.HashTags.filter(x => x.FileName !== doc.fileName);
                    let docTags = this.getTagsFromDocument(doc);
                    this.HashTags.push(...docTags);
                }

                resolve(this.HashTags);
            }, (error: Error) => {
                resolve(this.HashTags);
            });
        });
    }

    reloadEditorTags(editor: TextEditor) {
        let fileName = editor.document.fileName
        let doc = editor.document;

        this.HashTags = this.HashTags.filter(x => x.FileName !== fileName);
        let documentTags = this.getTagsFromDocument(editor.document);
        this.HashTags.push(...documentTags);

        return this.HashTags.filter(x => x.FileName === fileName);
    }

    reloadWorkspaceTags(): Promise<HashTag[]> {
        return new Promise(resolve => {
            this.HashTags = [];

            if (workspace.rootPath) {
                workspace.findFiles('**/*').then(workspaceFiles => {
                    let filesCount = workspaceFiles.length;
                    let filesProcessed = 0;
                    workspaceFiles.forEach(file => {
                        workspace.openTextDocument(file).then(doc => {
                            if (doc) {
                                let docTags = this.getTagsFromDocument(doc);
                                this.HashTags.push(...docTags);
                            }
                            filesProcessed++;

                            if (filesProcessed === filesCount) {
                                resolve(this.HashTags);
                            }
                        }, (error: Error) => {
                            filesProcessed++;

                            if (filesProcessed === filesCount) {
                                resolve(this.HashTags);
                            }
                        });
                    });
                });
            } else {
                resolve(this.HashTags);
            }
        });
    }

    private getTagsFromDocument(doc: TextDocument): HashTag[] {
        const hashtagRegex = /(^|[\s]|\/\/)(#[a-zA-Z0-9][\w-]*)\b/g;

        let fileName = doc.fileName;
        let content = doc.getText();

        let hashTags: HashTag[] = [];

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

            hashTags.push(hashTag);
        }

        return hashTags;
    }
}