import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { HEADER_CONTENT,DEBUG_CONTENT,PYENV_CONTENT,VsCodeWorkspaceCreator} from './utils';

//FIXME: This should be in a config file or something like that.
const EXCLUDE_FOLDERS = ['bin', 'report', 'results', 'logs', 'build', '__pycache__']; // Folders to exclude from the workspace file


export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('vscode-pyenv.set_pyenv', () => {
		// Entry point for the extension
		vscode.window.showInformationMessage('Creating a new Python file with header and debug configuration...');
		const folders = vscode.workspace.workspaceFolders;
		if (!folders) {
			vscode.window.showErrorMessage('No workspace folder found.');
			return;
		}
		const file_content:string[] = [];
		const file_env_content:string[] = [];
		file_content.push(HEADER_CONTENT);
		// Create a new file with the header and debug configuration
		let vscodeWorkpace = new VsCodeWorkspaceCreator();
		const root_workspace_path = folders[0].uri.fsPath; // path like: 'c:\users\user\workspace'
		const target_folder_name = path.basename(root_workspace_path);
		const workspace_root_path = path.join(root_workspace_path, `${target_folder_name}.code-workspace`);
		// Gets the paths from the workspace
		vscodeWorkpace.target_paths.then((target_paths) => {
		if (target_paths.length > 0) {
			// store the paths in the content array to fill the workspace file.
			for(let i=0; i<target_paths.length; i++){
				const file_dir = path.dirname(target_paths[i]);
				let file_path = file_dir.toString().replace(/\\/g, '/');
				let file_path_name = '		"'+file_path+'",';
				let _workspace = root_workspace_path.replace(/\\/g, '/');
				let rel_path = file_path_name.replace(_workspace,"${workspaceFolder}");
				// Just add the path if it is not already in the file_content array
				if(!file_content.includes(rel_path) && !EXCLUDE_FOLDERS.some(folder => file_path.includes(folder))){
					// Check if the path is not in the exclude folders
					file_env_content.push(target_paths[i]);
					file_content.push(rel_path);
				}
			}
			file_content.push('		],'); // add the end of the configuration.
		} else {
			vscode.window.showErrorMessage('No Python files found in the workspace.');
		}
		    file_content.push(PYENV_CONTENT); // add the pyenv configuration into the array.
			file_content.push(DEBUG_CONTENT); // add the debug configuration into the array.
			// File creation.
			fs.writeFileSync(workspace_root_path, file_content.join("\n"), { flag: 'w', encoding: 'utf-8' });
			fs.writeFileSync(workspace_root_path, file_env_content, { flag: 'w', encoding: 'utf-8' });
			vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(workspace_root_path), true);
		});
		// Get the Python interpreter path and create the pyenv.py file.
		vscodeWorkpace.getCurrentPythonInterpreter().then((interpreterPath) => {
			if (interpreterPath) {
				const py_path = path.dirname(interpreterPath).toString()+'\\Lib';
				vscodeWorkpace.setPyenvFile(py_path);
			} else {
				vscode.window.showErrorMessage('No Python interpreter found.');
			}
		});
	});
	context.subscriptions.push(disposable);
}
export function deactivate() {}
