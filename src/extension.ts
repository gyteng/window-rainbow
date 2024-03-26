import * as vscode from 'vscode';
import { generateRandomColor, toDarkColor, toLightColor } from './color';
import { generateSeedString, setColors } from './config-tool';

export function activate(context: vscode.ExtensionContext) {

	const changeColor = (random: string = '') => {
		const seed = generateSeedString() + random;
		const randomColor = generateRandomColor(seed);
		const colorTheme = vscode.window.activeColorTheme;
		let colors: any;
		if (colorTheme.kind === vscode.ColorThemeKind.Dark) {
			colors = toDarkColor(randomColor);
		} else {
			colors = toLightColor(randomColor);
		}
		setColors(colors.title, colors.activity);
	};

	let disposable = vscode.commands.registerCommand('window-rainbow.random', () => {
		changeColor(Math.random().toString());
	});

	vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
		if (event.affectsConfiguration('window-rainbow')) {
			changeColor();
		} else if (event.affectsConfiguration('workbench.colorTheme')) {
			changeColor();
		}
	});

	changeColor();

	context.subscriptions.push(disposable);
}

export function deactivate() { }
