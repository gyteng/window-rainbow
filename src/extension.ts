import * as vscode from 'vscode';
import { generateRandomColor, toDarkColor, toLightColor } from './color';
import { generateSeedString, setColors, setCustomSeed } from './config-tool';

export function activate(context: vscode.ExtensionContext) {

	const changeColor = () => {
		const seed = generateSeedString();
		const randomColor = generateRandomColor(seed);
		const colorTheme = vscode.window.activeColorTheme;
		let colors: any;
		if (colorTheme.kind === vscode.ColorThemeKind.Dark) {
			colors = toDarkColor(randomColor);
		} else {
			colors = toLightColor(randomColor);
		}
		setColors(colors);
	};

	let disposable = vscode.commands.registerCommand('window-rainbow.random', () => {
		setCustomSeed(Math.random().toString().substring(2, 10));
		changeColor();
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
