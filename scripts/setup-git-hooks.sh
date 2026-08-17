#!/bin/sh
# One-time setup: use project git hooks (strips Cursor co-author from commit messages).
set -e
cd "$(dirname "$0")/.."
chmod +x .githooks/prepare-commit-msg
git config core.hooksPath .githooks
echo "Git hooks enabled at .githooks (Cursor co-author lines will be stripped on commit)."
