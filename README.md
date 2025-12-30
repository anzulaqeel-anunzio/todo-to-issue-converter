# TODO to Issue Converter

Turn your code comments into actionable tasks! This GitHub Action parses your codebase for `TODO` comments and automatically converts them into GitHub Issues.

## Features

-   **Auto-Creation**: Detects new `// TODO: Title` comments and makes issues.
-   **Duplicate Prevention**: Smartly checks if an issue already exists.
-   **Close on Removal**: Optionally closes the issue when the TODO is removed from the code.
-   **Customizable**: Configure labels and keywords (e.g., `FIXME`, `BUG`).

## Usage

Create a workflow file (e.g., `.github/workflows/todo-to-issue.yml`):

```yaml
name: TODO to Issue
on:
  push:
    branches:
      - main

jobs:
  todo-to-issue:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    steps:
      - uses: actions/checkout@v3
      - name: Run TODO to Issue
        uses: ./
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          close_on_resolve: true
```

## Inputs

| Input | Description | Default |
| :--- | :--- | :--- |
| `token` | GITHUB_TOKEN or PAT | `${{ github.token }}` |
| `keyword` | Keyword to search for | `TODO` |
| `close_on_resolve` | Close issue if TODO is removed | `true` |

## Contact

Developed for Anunzio International by Anzul Aqeel.
Contact +971545822608 or +971585515742.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
### 🔗 Part of the "Ultimate Utility Toolkit"
This tool is part of the **[Anunzio International Utility Toolkit](https://github.com/anzulaqeel-anunzio/ultimate-utility-toolkit)**.
Check out the full collection of **180+ developer tools, scripts, and templates** in the master repository.

Developed for Anunzio International by Anzul Aqeel.
