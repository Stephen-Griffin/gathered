# Agent Notes

- Run shell commands with `login:false` in this environment so the configured `workdir` is preserved.
- Branch switching and other git mutations may require escalation if `.git/index.lock` hits `Operation not permitted`.
- `bun run build` may need network access because Next.js fetches Google Fonts during the build.
