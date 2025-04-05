import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export const HEADER_CONTENT = `//Date: 2023-10-01
//Author: Your Name
//Description: This file contains the implementation of the function to be tested.
{
    "folders": [{"path": "."}],
    "settings": {"python.analysis.extraPaths": [`;

export const PYENV_CONTENT = `  "python.terminal.launchArgs": [
        "-m"    ,
        "pyenv"
    ]},`;

export const DEBUG_CONTENT = `    "launch": {
        "version": "0.2.0",
        "configurations": [{
            "name": "Python: DebuggCurrentFile",
            "request": "launch",
            "type": "debugpy",
            "program": "\${file}",
            "console": "integratedTerminal",
            "justMyCode": false,
        }],
    }
}`;

const PYENV_SCRIPT = `import sys

if __name__ == "__main__":
    target = sys.argv[1]
    exec(open(target).read(), globals())`;

/**
 * Description: This class is used to create a new Python file with a header and debug configuration.
 * It retrieves the file paths of all Python files in the workspace and adds them to the configuration.
 * @class FillCodeFile
 * @param {string} file_name - The name of the file to be created.
 * @property {Promise<string[]>} target_paths - A promise that resolves to an array of file paths.
 * @method getFilePaths - A private method that retrieves the file paths of all Python files in the workspace.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file paths.
 */
export class VsCodeWorkspaceCreator {
    public target_paths: Promise<string[]>;

    /**
     * Description: This constructor initializes the FillCodeFile class with the file name and retrieves the file paths.
     * @param file_name - The name of the file to be created.
     * @property {string} file_name - The name of the file to be created.
     */
    constructor() {
        this.target_paths = this.getFilePaths();
    }

    /**
     * Description: This method retrieves the file paths of all Python files in the workspace.
     * @returns {Promise<string[]>} - A promise that resolves to an array of file paths.
     */
    private async getFilePaths(): Promise<string[]> {
        // Search for Python files (.py)
        const files = await vscode.workspace.findFiles('**/*.py', '**/node_modules/**');
        return files.map(file => file.fsPath);
    }

    /**
     * Description: This method creates a new Python file with the pytenv_script content.
     * @param file_path - The path to the directory where the pyenv.py file will be created.
     * @returns {void}
     * @throws {Error} - Throws an error if the file path is not a directory or if the file cannot be created.
     */
    public setPyenvFile(file_path: string): void {
        if(fs.existsSync(file_path) && fs.lstatSync(file_path).isDirectory()){
            let file_root_path = path.join(file_path, 'pyenv.py');
            fs.writeFileSync(file_root_path, PYENV_SCRIPT, { flag: 'w', encoding: 'utf-8' });
        }
    }

    /**
     * Description: This method retrieves the current Python interpreter path.
     * @returns {Promise<string | undefined>} - A promise that resolves to the Python interpreter path or undefined.
     * @throws {Error} - Throws an error if the Python extension is not found or if the interpreter path is not found.
     * @throws {Error} - Throws an error if the Python interpreter path is not found.
     */ 
    public async getCurrentPythonInterpreter(): Promise<string | undefined> {
        const python_ext = vscode.extensions.getExtension('ms-python.python'); // Python extension dependency.
        if(!python_ext) {
            vscode.window.showErrorMessage('Python extension not found.');
            return;
        }
        // Wait for the extension to activate
        if(!python_ext.isActive) {
            await python_ext.activate();
        }
        const pythonApi = python_ext.exports;
        const interpreterDetails = await pythonApi.environments.getActiveEnvironmentPath();
        if(!interpreterDetails) {
            vscode.window.showErrorMessage('No Python interpreter found.');
            return;
        }
        if(!interpreterDetails.path) {
            vscode.window.showErrorMessage('No Python interpreter path found.');
            return;
        }
        return interpreterDetails?.path;
    }
}