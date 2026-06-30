# 🚀 VSCode TDR Python Environment Manager

The **VSCode [TDR] Python Environment Manager** extension automates the creation of a Visual Studio Code workspace file for Python projects. It simplifies the process of configuring Python paths, debugging settings, and environment variables for your workspace.

## ✨ Features

- 🔍 Automatically scans the workspace for Python files and adds their paths to the workspace configuration.
- 🚫 Excludes specific folders (e.g., `__pycache__`, `out`, `.git`) from the workspace.
- 📄 Generates a `.env` file with the `PYTHONPATH` variable for easy environment configuration to be able to debug any Python script.
- 🛠️ Creates a `pyenv.py` script to manage Python environment paths and execute scripts.
- 🐞 Configures debugging settings for Python files.
- 🧠 Automatically detects the active Python interpreter.

## 🛡️ Usage

1. Open a Python project in Visual Studio Code.
2. Run the **`[TDR] Create Python Environment`** command from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), or `right-click` within the Explorer view and select **`[TDR] Create Python Environment`** from the context menu.
3. Run the command  from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) Or right-click on the Explorer view and select the option `[TDR] Create Python Environment`
4. The extension will:
   - 📂 Create a `<folder name>.code-workspace` file in the root of your workspace.
   - 🌐 Generate a `.env` file with the `PYTHONPATH` variable.
   - 📝 Create a `pyenv.py` script in the Python interpreter's `Lib` directory.
5. The workspace file will be opened automatically in Visual Studio Code.

### 🔍  To see how configure the extension, see the images from: [README.md](README.md)

## How to install:
Run the following command: 

**PowerShell**
```bash
git clone --depth=1 https://github.vitesco.io/sg922674/vscode_pyenvironment; code --install-extension vscode_pyenvironment/EXTENSION.vsix; rm -Recurse -Force vscode_pyenvironment
```
**Git Bash**
```bash
git clone --depth=1 https://github.vitesco.io/sg922674/vscode_pyenvironment && code --install-extension vscode_pyenvironment/EXTENSION.vsix && rm -rf vscode_pyenvironment
```

## ⚙️ Configuration

### 🗂️ Excluded Folders

The following folders are excluded from the workspace configuration by default:
- `out`
- `.git`
- `.vscode`
- `.github`
- `__pycache__`

You can modify the `tdr-python-environment.excludedFolders` array in the extension settings to customize this behavior:

### 🐍 Python Interpreter

The extension automatically detects the active Python interpreter using the Python extension (`ms-python.python`). Ensure the Python extension is installed and activated in your Visual Studio Code.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## 👨‍💻 Author

**Juan Jose Solorzano Carrillo**  
Copyright (c) 2026

