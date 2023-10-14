import * as vscode from "vscode";
import * as fs from "fs";

let focusTime: Date | null = null;
let statusBar: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = "Time Spent: 0s";
  statusBar.show();

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        // Editor focused
        focusTime = new Date();
      } else if (focusTime) {
        const focusDuration =
          (new Date().getTime() - focusTime.getTime()) / 1000;
        statusBar.text = `Time Spent: ${focusDuration}s`;
        console.log(focusDuration);
        focusTime = null;
      }
    })
  );
}

export function deactivate() {
  statusBar.hide();
  statusBar.dispose();
}
