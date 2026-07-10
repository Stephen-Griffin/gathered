# Agent Notes

- Run shell commands with `login:false` in this environment so the configured `workdir` is preserved.
- Branch switching and other git mutations may require escalation if `.git/index.lock` hits `Operation not permitted`.
- `bun run build` may need network access because Next.js fetches Google Fonts during the build.
- GitHub CLI API calls and GitHub-backed pushes may fail inside the sandbox even when `gh auth status` is valid in an interactive terminal. Re-run the needed `gh` or `git push` command with approved unsandboxed access; verify first with `gh api user --jq '.login'`. Do not print tokens or credential files.
