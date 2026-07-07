# 🚀 VSCode Python Environment Manager

The **VSCode Python Environment Manager** extension automates the creation of a Visual Studio Code workspace file for Python projects. It simplifies the process of configuring Python paths, debugging settings, and environment variables for your workspace.
The extension also creates an AI AGENT specific for the Python projects, which can be used to assist with Python development tasks.

## ✨ Features

- 🧠 Incorporate a AI AGENT for projects.
- 🔍 Automatically scans the workspace for Python files and adds their paths to the workspace configuration.
- 🚫 Excludes specific folders (e.g., `__pycache__`, `out`, `.git`) from the workspace.
- 📄 Generates a `.env` file with the `PYTHONPATH` variable for easy environment configuration to be able to debug any Python script.
- 🛠️ Creates a `pyenv.py` script to manage Python environment paths and execute scripts.
- 📝 Generates a `TA` code snippet to automate the Copyright and the `TA` Python scripts.
- 🐞 Configures debugging settings for Python files.
- 🧠 Automatically detects the active Python interpreter.

## 🛡️ Usage

1. Open a Python project in Visual Studio Code.
2. Run the **`Create Python Environment`** command from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), or `right-click` within the Explorer view and select **`Create Python Environment`** from the context menu.
3. Run the command  from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) Or right-click on the Explorer view and select the option `Create Python Environment`
4. The extension will:
   - 📂 Create a `<folder name>.code-workspace` file in the root of your workspace.
   - 🌐 Generate a `.env` file with the `PYTHONPATH` variable.
   - 📝 Create a `pyenv.py` script in the Python interpreter's `Lib` directory.
5. The workspace file will be opened automatically in Visual Studio Code.
6. In the chat, look for the TA AGENT as `TA` select it and start asking questions about your Python project.

## 🛠️ AGENT Configuration:

- The agent incorporates the caveman AI specifications, you can select the caveman by typing in the chat: 
```bash
/caveman full ->  (dafault) fragments ok, drop articles, short words. Classic caveman
/caveman lite ->  short sentences, no filler, keep grammar
/caveman ultra ->  Abbreviate (DB/auth/config/req/res/fn/impl), fragments, abbrev (db/api/req/res/fn), arrows (→), minimal words
```

## 📝 Code snipet for Python and C projects:

   - At the top of your file, type: `copyt` for Python or `copyc` for C files.
   - By taping `libinit` the code snippet will create a template for the `Python` script, which will include the copyright and the `Python` class examples.

## How to install:
Run the following command: 

**PowerShell**
```bash
git clone --depth=1 https://github.com/JuanJoseSolorzano/vscode_pyenv.git; C:\LegacyApp\VSCode\bin\code.cmd --install-extension vscode_pyenv/python-environment.vsix; rm -Recurse -Force vscode_pyenv
```
**Git Bash**
```bash
git clone --depth=1 https://github.com/JuanJoseSolorzano/vscode_pyenv.git && C:\LegacyApp\VSCode\bin\code.cmd --install-extension vscode_pyenv/python-environment.vsix && rm -rf vscode_pyenv
```

**Manual Installation**
1. Download the latest release of the extension from the [Releases](https://github.com/JuanJoseSolorzano/vscode_pyenv/releases) page.
2. Open Visual Studio Code.
3. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
4. Click on the three-dot menu in the top-right corner of the Extensions view and select "Install from VSIX..."
5. Navigate to the downloaded `.vsix` file and click "Open" to install the extension.

## ⚙️ Configuration

### 🗂️ Excluded Folders

The following folders are excluded from the workspace configuration by default:
- `out`
- `.git`
- `.vscode`
- `.github`
- `__pycache__`

You can modify the `python-environment.excludedFolders` array in the extension settings to customize this behavior:

### 🐍 Python Interpreter

The extension automatically detects the active Python interpreter using the Python extension (`ms-python.python`). Ensure the Python extension is installed and activated in your Visual Studio Code.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## 👨‍💻 Author

**Juan Jose Solorzano Carrillo**  
Copyright (c) 2026

