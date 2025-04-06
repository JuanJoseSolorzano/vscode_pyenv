import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export const HEADER_CONTENT = `
//******************************************************************************************************************
// Author: Juan Jose Solorzano
// Date: 2023-10-03 
// Copyright (c) 2023 Juan Jose Solorzano.
// MIT License
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// -----------------------------------------------------------------------------------------------------------------
// Description: 
// This script automates the creation of a Visual Studio Code workspace file for a given directory. 
// It scans the directory structure, identifies Python files, and configures the workspace with appropriate 
// folder paths and debugging settings. The script also excludes specific folders from the workspace and 
// ensures the workspace file is opened in Visual Studio Code if installed.
//******************************************************************************************************************
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

const PYENV_SCRIPT = `# -*- coding: UTF-8 -*-
# ************************************************************************************************************
# License:    MIT                                                                                             
#                                                                                                             
# Permission is hereby granted, free of charge, to any person obtaining a copy                                
# of this software and associated documentation files (the "Software"), to deal                               
# in the Software without restriction, including without limitation the rights                                
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell                                   
# copies of the Software, and to permit persons to whom the Software is                                       
# furnished to do so, subject to the following conditions:                                                    
#                                                                                                             
# The above copyright notice and this permission notice shall be included in all                              
# copies or substantial portions of the Software.                                                             
#                                                                                                             
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR                                  
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,                                    
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE                                 
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                                      
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,                               
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE                               
# SOFTWARE.                                                                                                   
# Copyright (c) 2023 Juan Jose Solorzano.                                                                     
# ************************************************************************************************************
# Python:     >3.9                                                                                            
# Depencies:  os, sys, fnmatch, runpy                                                                         
# Author:     $Author:    Solorzano, Juan Jose                                                                
# Date:       $Date:      18/03/24                                                                            
# ************************************************************************************************************
# Module information:                                                                                         
# ------------------------------------------------------------------------------------------------------------
# This module provides utilities for managing Python environment paths and executing scripts.                 
#                                                                                                             
# Functions:                                                                                                  
# - getAllPaths(targetPath): Retrieves all paths containing Python files starting from the target path.       
# - getSuiteRootPath(start_dir): Identifies the root path of the suite by searching for a .code-workspace     
#   file.                                                                                                      
# - setSysPath(pathList): Adds specified paths to the Python sys.path for module resolution.                  
#                                                                                                             
# Usage:                                                                                                      
# Run this script with a target Python script as an argument to execute it within the configured environment. 
# Example: python pyenv.py <target_script>                                                                    
# ************************************************************************************************************

import sys
import os
import fnmatch #type: ignore
import runpy #type: ignore

def getAllPaths(targetPath):
    """
    Returns all paths starting from the mainPath as a list of strings
    Returns [] if mainPath was not found
    Returns [mainPath] if mainPath has no sub-paths
    """
    pathList = []
    for path, _, files in os.walk(targetPath): 
        # add only folders that contains a .py source file
        for fileName in files:
            if fnmatch.fnmatch(fileName, "*.py"):
                if path.__contains__("__pycache__"):
                    continue
                pathList.append(path)
                break
    return pathList

def getSuiteRootPath(start_dir=os.getcwd()):
    """
    Returns the root path of the suite
    """
    current_dir = start_dir
    levels = 50  # Number of levels to go up
    root_path = None
    for _ in range(levels):
        current_dir = os.path.dirname(current_dir)
        for file in os.listdir(current_dir):
            if fnmatch.fnmatch(file, "*.code-workspace"):
                root_path = current_dir
                break
    return root_path 

def setSysPath(pathList):
    """
    Adds the paths in pathList to sys.path
    """
    for path in pathList:
        if path not in sys.path:
            sys.path.append(path)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pyenv.py <target_script>")
        sys.exit(1)
    target = sys.argv[1]
    if not os.path.isfile(target):
        print("Error: The file %s does not exist."%target)
        sys.exit(1)
    setSysPath((getAllPaths(getSuiteRootPath())))
    # Execute the external script using runpy for better safety and efficiency
    try:
        runpy.run_path(target, run_name="__main__")
    except Exception as e:
        print(f"Error while executing the script: {e}")`;

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