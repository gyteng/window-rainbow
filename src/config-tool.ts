import * as vscode from 'vscode';

interface SeedConfig {
  MachineId: boolean;
  ProjectPath: boolean;
  ProjectName: boolean;
  CustomSeed: string;
}

interface ControlsConfig {
  mode: 'auto' | 'manual';
  color: Array<'titleBar' | 'activityBar' | 'sideBar'>;
}

const getSeedConfig = (): SeedConfig => {
  const config = vscode.workspace.getConfiguration('window-rainbow');
  const seed = config.get<SeedConfig>('seed');
  return JSON.parse(JSON.stringify(seed));
};

const getControlsConfig = (): ControlsConfig => {
  const config = vscode.workspace.getConfiguration('window-rainbow');
  const controls = config.get<ControlsConfig>('controls');
  return JSON.parse(JSON.stringify(controls));
};

const isAutoMode = (): boolean => {
  const config = getControlsConfig();
  return config.mode === 'auto';
};

const generateCustomSeed = (): string => {
  const seed = getSeedConfig();
  let seedString: string = seed.CustomSeed;
  const matches = seedString.match(/\$\{([a-zA-Z]{1,20})\}/);
  const uniqueMatches = [...new Set(matches)];
  uniqueMatches.forEach(match => {
    const key = match.substring(2, match.length - 1);
    const vscodeEnv = vscode.env as any;
    if (vscodeEnv[key]) {
      seedString = seedString.replaceAll(match, vscodeEnv[key]);
    }
  });
  return seedString;
};

const generateSeedString = (): string => {
  const seed = getSeedConfig();
  let seedString = generateCustomSeed();
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

const setColors = (colors: Array<string>) => {
  let config = vscode.workspace.getConfiguration('workbench');
  const controlsConfig = getControlsConfig();
  const colorCustomizations = JSON.parse(JSON.stringify(config.get('colorCustomizations')));
  config.update('colorCustomizations', {
    ...colorCustomizations,
    'titleBar.activeBackground': controlsConfig.color.includes('titleBar') ? colors[0] : undefined,
    'activityBar.background': controlsConfig.color.includes('activityBar') ? colors[1] : undefined,
    'sideBar.background': controlsConfig.color.includes('sideBar') ? colors[2] : undefined,
  }, vscode.ConfigurationTarget.Workspace);
};

export { generateSeedString, setColors, isAutoMode };