'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { start } from 'repl'; 
import * as requester from './routs/routs';

const gitDiff = require('git-diff');
const date = new Date();
const timestamp = Math.round(date.getTime() / 1000);
var starterCode = null;

export function activate(context: vscode.ExtensionContext) {
    starterCode = window.activeTextEditor.lines();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    let disposable = vscode.commands.registerCommand('extension.type', (args) => {
        requester.postNewkeyCount(args.text);
        vscode.commands.executeCommand('default:type', {
            text: args.text
        });
    });

    let deleteDisposable = vscode.commands.registerCommand('extension.deleteKey', () => {
        vscode.commands.executeCommand("deleteLeft");
        requester.postNewkeyCount("Delete");
    });

    let pasteDisposable = vscode.commands.registerCommand('extension.paste', () => {
        vscode.commands.executeCommand('editor.action.clipboardPasteAction');
        requester.postNewkeyCount("past");
    });

    let copyDisposable = vscode.commands.registerCommand('extension.copy', () => {
        vscode.commands.executeCommand('editor.action.clipboardCopyAction');
        requester.postNewkeyCount("copy");
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(deleteDisposable);
    context.subscriptions.push(pasteDisposable);
    context.subscriptions.push(copyDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
    const sessionTime = Math.round(date.getTime() / 1000) - timestamp;
    requester.timeUpdate(date.getTime() - timestamp);
    const diff = gitDiff(starterCode, window.activeTextEditor.lines())
    requester.updateCode(diff);
    

    
}
