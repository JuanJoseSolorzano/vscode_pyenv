import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';


export const header_content = `//Date: 2023-10-01
//Author: Your Name
//Description: This file contains the implementation of the function to be tested.
{
    "folders": [{"path": "."}],
    "settings": {"python.analysis.extraPaths": [`;

export const pyenv_content = `  "python.terminal.launchArgs": [
        "-m"    ,
        "pyenv"
    ]},`;

export const debug_content = `    "launch": {
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

export const pytenv_script = `import sys

if __name__ == "__main__":
    target = sys.argv[1]
    exec(open(target).read(), globals())`;

export async function getCurrentPythonInterpreter(): Promise<string | undefined> {
    const pythonExt = vscode.extensions.getExtension('ms-python.python');

    if (!pythonExt) {
        vscode.window.showErrorMessage('Python extension not found.');
        return;
    }
    // Wait for the extension to activate
    if (!pythonExt.isActive) {
        await pythonExt.activate();
    }
    const pythonApi = pythonExt.exports;
    const interpreterDetails = await pythonApi.environments.getActiveEnvironmentPath();

    if (!interpreterDetails) {
        vscode.window.showErrorMessage('No Python interpreter found.');
        return;
    }
    if (!interpreterDetails.path) {
        vscode.window.showErrorMessage('No Python interpreter path found.');
        return;
    }
    return interpreterDetails?.path;
}

export function setPyenvFile(file_path: string): void {
    if(fs.existsSync(file_path) && fs.lstatSync(file_path).isDirectory()){
        let file_root_path = path.join(file_path, 'pyenv.py');
        fs.writeFileSync(file_root_path, pytenv_script, { flag: 'w', encoding: 'utf-8' });
    }
    const pyenv_file = file_path.replace(/\\/g, '/').replace(/\.py$/, '.pyenv.py');
}
export class FillCodeFile {
    public target_paths: Promise<string[]>;
    private tst: string;
    constructor(public file_name: string) {
        this.file_name = file_name;
        this.target_paths = this.getContent();
        this.tst = "";
    }
    private async getContent(): Promise<string[]> {
        // Using vscode.workspace.findFiles to search for Python files (.py)
        const files = await vscode.workspace.findFiles('**/*.py', '**/node_modules/**');
        // Returning the absolute path of each file found
        return files.map(file => file.fsPath);
    }
}