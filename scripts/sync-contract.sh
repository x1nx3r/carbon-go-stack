#!/bin/sh
# The backend owns proto/. Copy its pinned contract here before generating.
# Override the source when the repositories are not siblings:
#   CONTRACT_DIR=/path/to/backend/proto npm run api:sync
set -eu

src=${CONTRACT_DIR:-../backend-monolithrepo/proto}
dest=proto

[ -d "$src" ] || {
  echo "contract: $src not found; set CONTRACT_DIR" >&2
  exit 1
}

rsync -a --delete "$src/" "$dest/"
echo "contract synced from $src"
