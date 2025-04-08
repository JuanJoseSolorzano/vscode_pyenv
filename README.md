# 🚀 VSCode PyEnv Extension

The **VSCode PyEnv** extension automates the creation of a Visual Studio Code workspace file for Python projects. It simplifies the process of configuring Python paths, debugging settings, and environment variables for your workspace.

## ✨ Features

- 🔍 Automatically scans the workspace for Python files and adds their paths to the workspace configuration.
- 🚫 Excludes specific folders (e.g., `__pycache__`, `logs`, `build`) from the workspace.
- 📄 Generates a `.env` file with the `PYTHONPATH` variable for easy environment configuration.
- 🛠️ Creates a `pyenv.py` script to manage Python environment paths and execute scripts.
- 🐞 Configures debugging settings for Python files.
- 🧠 Automatically detects the active Python interpreter.

## 📥 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/vscode_pyenv.git
   ```
2. Open the repository in Visual Studio Code.
3. Run `npm install` to install dependencies.
4. Press `F5` to launch the extension in a new Extension Development Host window.

## 🛡️ Usage

1. Open a Python project in Visual Studio Code.
2. Run the command **`vscode-pyenv.set_pyenv`** from the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3. The extension will:
   - 📂 Create a `.code-workspace` file in the root of your workspace.
   - 🌐 Generate a `.env` file with the `PYTHONPATH` variable.
   - 📝 Create a `pyenv.py` script in the Python interpreter's `Lib` directory.
4. The workspace file will be opened automatically in Visual Studio Code.

## ⚙️ Configuration

### 🗂️ Excluded Folders

The following folders are excluded from the workspace configuration by default:
- `bin`
- `report`
- `results`
- `logs`
- `build`
- `__pycache__`

You can modify the `EXCLUDE_FOLDERS` array in `src/extension.ts` to customize this behavior.

### 🐍 Python Interpreter

The extension automatically detects the active Python interpreter using the Python extension (`ms-python.python`). Ensure the Python extension is installed and activated in your Visual Studio Code.

## 📂 File Structure

- **`src/utils/create_code_file.ts`**: Contains utility functions and classes for creating workspace files and managing Python paths.
- **`src/extension.ts`**: Entry point for the extension. Handles the command registration and main logic.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Juan Jose Solorzano**  
Copyright (c) 2023

