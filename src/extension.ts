import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { header_content,debug_content,FillCodeFile,pyenv_content,getCurrentPythonInterpreter,setPyenvFile} from './utils';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('vscode-pyenv.set_pyenv', () => {
		vscode.window.showInformationMessage('Creating a new Python file with header and debug configuration...');
		const folders = vscode.workspace.workspaceFolders;
		if (!folders) {
			vscode.window.showErrorMessage('No workspace folder found.');
			return;
		}
		const content:string[] = [];
		content.push(header_content);
		// Create a new file with the header and debug configuration
		let workspace = new FillCodeFile('test.py');
		const workspaceFolder = folders[0].uri.fsPath;
		const main_folder_name = path.basename(workspaceFolder);
		const workspace_root_path = path.join(workspaceFolder, `${main_folder_name}.code-workspace`);
		workspace.target_paths.then((target_paths) => {
		if (target_paths.length > 0) {
			for(let i=0; i<target_paths.length; i++){
				const file_dir = path.dirname(target_paths[i]);
				let file_path = file_dir.toString().replace(/\\/g, '/');
				let file_path_name = '		"'+file_path+'",';
				let _workspace = workspaceFolder.replace(/\\/g, '/');
				let rel_path = file_path_name.replace(_workspace,"${workspace}");
				if(!content.includes(rel_path)){
					content.push(rel_path);
				}
			}
			content.push('		],');
		} else {
			vscode.window.showErrorMessage('No Python files found in the workspace.');
		}
		    content.push(pyenv_content);
			content.push(debug_content);
			fs.writeFileSync(workspace_root_path, content.join("\n"), { flag: 'w', encoding: 'utf-8' });
			vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(workspace_root_path), true);
		});
		getCurrentPythonInterpreter().then((interpreterPath) => {
			if (interpreterPath) {
				const py_path = path.dirname(interpreterPath).toString()+'\\Lib';
				setPyenvFile(py_path);
			} else {
				vscode.window.showErrorMessage('No Python interpreter found.');
			}
		});

	});
	context.subscriptions.push(disposable);
}
export function deactivate() {}
