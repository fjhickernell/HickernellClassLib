#!/usr/bin/env zsh
set -euo pipefail

# --------------------------------------------------------------------
#   Shared submodule updater (for course repos using HickernellClassLib)
#
#   Usage (from course repo root):
#       ./classlib/bin/update-submodules.sh
#       ./classlib/bin/update-submodules.sh --commit
#       ./classlib/bin/update-submodules.sh --push
#
#   Usage (from inside the classlib submodule):
#       bin/update-submodules.sh
#
#   Flags:
#       --commit   auto-commit updated submodule pointers
#       --push     auto-commit + push
#
#   Behavior:
#     • Detects the "real" superproject root.
#     • Fast-forwards the superproject (`git pull --ff-only`).
#     • Initializes submodules.
#     • Fast-forwards each submodule to its upstream branch:
#         - classlib → main
#         - qmcsoftware → develop
#     • Commits pointer updates if requested.
# --------------------------------------------------------------------

AUTO_COMMIT=0
AUTO_PUSH=0

case "${1:-}" in
  --commit)
    AUTO_COMMIT=1
    ;;
  --push)
    AUTO_COMMIT=1
    AUTO_PUSH=1
    ;;
  "")
    ;;
  *)
    echo "Usage: $(basename "$0") [--commit | --push]"
    exit 1
    ;;
esac

log() {
  local ts
  ts=$(/bin/date '+%Y-%m-%d %H:%M:%S')
  echo "[$ts] $*"
}

# Detect superproject root (if any)
SUPER_ROOT="$(git rev-parse --show-superproject-working-tree 2>/dev/null || true)"
if [[ -n "$SUPER_ROOT" ]]; then
  REPO_ROOT="$SUPER_ROOT"
else
  REPO_ROOT="$(git rev-parse --show-toplevel)"
fi

if [[ -z "$REPO_ROOT" ]]; then
  echo "Error: could not determine repository root (are you in a Git repo?)."
  exit 1
fi

cd "$REPO_ROOT"

SCRIPT_PATH="$0"
SCRIPT_NAME="$(basename "$0")"
EXTRA_FLAGS=""
if [[ "$AUTO_PUSH" -eq 1 ]]; then
  EXTRA_FLAGS=" --push"
elif [[ "$AUTO_COMMIT" -eq 1 ]]; then
  EXTRA_FLAGS=" --commit"
fi

ensure_clean_worktree() {
  local ws
  ws="$(git status --porcelain)"

  # Completely clean — good to go
  if [[ -z "${ws}" ]]; then
    return 0
  fi

  # Check if only submodule pointers are dirty
  local only_submodules=1
  local line path
  while IFS= read -r line; do
    path="${line##* }"
    if [[ "${path}" != "classlib" && "${path}" != "qmcsoftware" ]]; then
      only_submodules=0
      break
    fi
  done <<< "${ws}"

  if (( only_submodules == 1 )); then
    if [[ "$AUTO_COMMIT" -eq 1 ]]; then
      log "Submodule pointers modified; will include in auto-commit."
      return 0
    fi

    log "Uncommitted submodule pointer changes detected."
    echo
    echo "git status --short:"
    echo "${ws}"
    echo
    echo "Run this script again with --commit or --push, or commit manually."
    exit 1
  else
    log "Uncommitted non-submodule changes detected."
    echo "Please commit, stash, or discard them before running:"
    echo "  ${SCRIPT_PATH}${EXTRA_FLAGS}"
    exit 1
  fi
}

ensure_clean_worktree

# ----------------------------------------------------
# NEW: Fast-forward the superproject itself
# ----------------------------------------------------
log "Fast-forwarding superproject at $REPO_ROOT ..."
git pull --ff-only || {
  echo "Error: superproject cannot fast-forward. Resolve manually."
  exit 1
}

# ----------------------------------------------------
# Submodule update + upstream fast-forward
# ----------------------------------------------------

SUBMODULES=(
  "classlib"
  "qmcsoftware"
)

for sm in "${SUBMODULES[@]}"; do
  if ! grep -q "path = ${sm}" .gitmodules 2>/dev/null; then
    log "Skipping: no submodule '${sm}' in this repo."
    continue
  fi

  log "Updating submodule at path: ${sm} ..."

  # Initialize to recorded pointer
  git submodule update --init --no-fetch "$sm"

  (
    cd "$sm"

    # Determine branch
    branch="main"
    if [[ "$sm" == "qmcsoftware" ]]; then
      branch="develop"
    fi

    # NEW: Fast-forward submodule to its upstream branch
    log "  Fast-forwarding $sm to origin/$branch ..."
    git fetch origin "$branch"
    git checkout "$branch" 2>/dev/null || true
    git pull --ff-only origin "$branch" || {
      echo "Error: submodule $sm cannot fast-forward. Resolve manually."
      exit 1
    }
  )
done

# ----------------------------------------------------
# Determine whether anything changed and commit if needed
# ----------------------------------------------------

if [[ -z "$(git status --porcelain)" ]]; then
  log "All submodules already up to date for repo at ${REPO_ROOT}."
  exit 0
fi

git status --short

if [[ "$AUTO_COMMIT" -eq 1 ]]; then
  log "Committing updated submodule pointers..."
  git add classlib qmcsoftware
  git commit -m "Update submodules (classlib + qmcsoftware)"

  if [[ "$AUTO_PUSH" -eq 1 ]]; then
    log "Pushing commit..."
    git push
  else
    log "Commit created; remember to push if needed."
  fi
else
  log "Review changes above; commit manually if desired."
fi

log "Done."