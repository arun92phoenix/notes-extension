'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('notes.createNote', () => {
        var notes = vscode.workspace.getConfiguration("notes");

        if(notes.get("base") == null) {
            vscode.window.showErrorMessage("The notes.base property must be configured with the base folder path for all the notes");
            return;
        }

        let options: vscode.InputBoxOptions = {
            prompt: "Enter the name for your notes"
        };

        vscode.window.showInputBox(options).then(filename => {
            filename = filename.replace(/\s/g, '_');
            filename = filename.replace(/\\|\/|\<|\>|\:|\n|\||\?|\*/g, '-');
            filename = encodeURIComponent(filename);
            var uri = vscode.Uri.file(notes.get("base") + "/" + filename);
            vscode.workspace.openTextDocument(uri).then(response => {
                //vscode.window.showInformationMessage('Existing note found.');
                vscode.window.showTextDocument(response, 1, false).then(
                    view => {
                        console.log("Opened file successfully", response);
                    }, failed => {
                        console.error("Error opening file", response);
                    });
            }, response => {
                uri = vscode.Uri.parse('untitled:'.concat(uri.fsPath));
                vscode.workspace.openTextDocument(uri).then(response => {
                    //vscode.window.showInformationMessage('Created a new note.');
                    vscode.window.showTextDocument(response, 1, false).then(
                        view => {
                            console.log("Opened file successfully", response);
                        }, failed => {
                            console.error("Error opening file", response);
                        });
                });
            });
        });
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {

}