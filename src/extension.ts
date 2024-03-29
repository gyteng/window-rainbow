import * as vscode from 'vscode';
import { generateRandomColor, toDarkColor, toLightColor } from './color';
import { generateSeedString, setColors, isAutoMode } from './config-tool';

export function activate(context: vscode.ExtensionContext) {

	const changeColor = () => {
		const seed = generateSeedString();
		const randomColor = generateRandomColor(seed);
		const colorTheme = vscode.window.activeColorTheme;
		let colors;
		if (colorTheme.kind === vscode.ColorThemeKind.Dark) {
			colors = toDarkColor(randomColor);
		} else {
			colors = toLightColor(randomColor);
		}
		setColors(colors);
	};

	let disposable = vscode.commands.registerCommand('window-rainbow.generate', () => {
		changeColor();
	});

	vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
		if (!isAutoMode()) {
			return;
		}
		if (event.affectsConfiguration('window-rainbow')) {
			changeColor();
		} else if (event.affectsConfiguration('workbench.colorTheme')) {
			changeColor();
		}
	});

	if (isAutoMode()) {
		changeColor();
	}

	context.subscriptions.push(disposable);
}

export function deactivate() { }
