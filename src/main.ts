import * as code from 'vscode';

const EXCLUDE_DIRS = [".vscode", ".git", "out", "__pycache__",".github"];

async function setPythonEnvironment(): Promise<void> {
    const {PythonEnvironment} = await import('./set_python_env');
    const workspaceRoot = code.workspace.workspaceFolders?.[0].uri.fsPath || '';
    const excludeDirs = code.workspace.getConfiguration('tdr-python-environment').get<string[]>('excludedFolders') || EXCLUDE_DIRS; //FIXME: How to set this settins into the user settings vscode interface?
    const pythonEnv = new PythonEnvironment(workspaceRoot, excludeDirs);
    // Create the .env file with the Python file paths of the current workspace.
    pythonEnv.pythonFilesPaths.then((filesPaths)=>{pythonEnv.createDotEnvFile(filesPaths);});
    // Create the .code-workspace file based on the current suite directory.
    pythonEnv.createCodeWorkspaceFile();
    // Create the pyenv.py file with the current Python interpreter path.
    pythonEnv.getCurrentPythonInterpreter().then((interpreterPath)=>{
        if(interpreterPath){
            pythonEnv.createPyEnvFile(interpreterPath);
        }else{
            code.window.showErrorMessage("No Python interpreter found. Please ensure that Python is installed and added to your system PATH.");
        }
    });
}

// Main entry point for the extension
export function activate(context: code.ExtensionContext){
    let command = code.commands.registerCommand('tdr-python-environment.setPythonEnvironment',setPythonEnvironment);
    context.subscriptions.push(command);
}

export function deactivate() {
    /* Do nothing */
}