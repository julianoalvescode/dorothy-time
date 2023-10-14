import * as vscode from "vscode";

let statusBar: vscode.StatusBarItem;
let projectStartTime: Date | null = null;
let intervalId: NodeJS.Timeout | null = null;

export function activate(context: vscode.ExtensionContext) {
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.show();

  if (vscode.workspace.workspaceFolders) {
    projectStartTime = new Date();
    startUpdatingStatusBar();
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders((event) => {
      if (event.added.length > 0) {
        projectStartTime = new Date();
        startUpdatingStatusBar();
      } else if (
        event.removed.length > 0 &&
        !vscode.workspace.workspaceFolders
      ) {
        stopUpdatingStatusBar();
        projectStartTime = null;
        statusBar.text = "Time Spent: 0s";
      }
    })
  );
}

function startUpdatingStatusBar() {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(updateStatusBar, 1000);
}

function stopUpdatingStatusBar() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function updateStatusBar() {
  if (projectStartTime) {
    const elapsedTime = new Date().getTime() - projectStartTime.getTime();
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    statusBar.text = `Time Spent: ${hours}h ${minutes}m ${seconds}s`;
  }
}

export function deactivate() {
  stopUpdatingStatusBar();
  statusBar.dispose();
}
