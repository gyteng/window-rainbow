import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const getSeedConfig = () => {
  const config = vscode.workspace.getConfiguration('window-rainbow');
  const seed = config.get('seed');
  return JSON.parse(JSON.stringify(seed));
};

const generateSeedString = () => {
  const seed = getSeedConfig();
  let seedString = '';
  if (seed.MachineId) {
    seedString += ('-' + vscode.env.machineId);
  }
  if (seed.ProjectPath) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      workspaceFolders.forEach((folder) => {
        seedString += ('-' + folder.uri.fsPath);
      });
    }
  }
  if (seed.ProjectName) {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      workspaceFolders.forEach((folder) => {
        seedString += ('-' + folder.name);
      });
    }
  }
  return seedString;
};

const setColors = (title: string, activity: string) => {
  let config = vscode.workspace.getConfiguration('workbench');
  config.update('colorCustomizations', {
    'titleBar.activeBackground': title,
    'activityBar.background': activity,
  }, vscode.ConfigurationTarget.Workspace);
};

const isWorkspaceEmpty = () => {
  let workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return true;
  }
  return false;
};

const isMultiRootWorkspace = () => {
  let workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 1) {
    return true;
  }
  return false;
};

const isGitRepository = () => {
  if (isWorkspaceEmpty()) {
    return false;
  }
  if (isMultiRootWorkspace()) {
    return false;
  }
  const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
  if (fs.existsSync(path.resolve(rootPath, '.git'))) {
    return true;
  }
  return false;
};

export { generateSeedString, setColors };