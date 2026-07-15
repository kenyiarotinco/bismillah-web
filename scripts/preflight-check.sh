#!/bin/bash
# Pre-flight check: confirms the current shell is inside the canonical
# BISMILLAH web repo (the one deployed to bismillah.com.pe) before any
# file gets edited.
#
# Deliberately NOT checked: a "reject Downloads/Desktop/etc in the path"
# heuristic. The real canonical repo for this project happens to live
# under Downloads, so a path-name blocklist would false-positive on the
# correct project. The git remote is the only trustworthy signal here.

set -uo pipefail

EXPECTED_REMOTE="github.com/kenyiarotinco/bismillah-web.git"
EXPECTED_DOMAIN="bismillah.com.pe"

echo "Verificando proyecto BISMILLAH..."
echo

if [ ! -d ".git" ]; then
  echo "ERROR: no hay repositorio Git en $(pwd)."
  exit 1
fi

if [ ! -f "package.json" ]; then
  echo "ERROR: falta package.json. Este no parece ser el proyecto bismillah-web."
  exit 1
fi

if ! ls next.config.* >/dev/null 2>&1; then
  echo "ERROR: falta next.config.*. Este no parece ser el proyecto bismillah-web (Next.js)."
  exit 1
fi

remote_url=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$remote_url" ]; then
  echo "ERROR: no hay remoto 'origin' configurado."
  exit 1
fi

# Normalize both https://host/path.git and git@host:path.git forms so the
# comparison works regardless of which protocol is configured locally.
normalized=${remote_url#*://}   # strip "https://"
normalized=${normalized#*@}     # strip "git@"
normalized=${normalized/://}    # ssh "host:path" -> "host/path"
normalized=${normalized%.git}.git

fail=0

if [[ "$normalized" != *"$EXPECTED_REMOTE" ]]; then
  echo "ERROR: remoto 'origin' es '$remote_url', se esperaba '$EXPECTED_REMOTE'."
  echo "       Este directorio NO es el repo oficial de bismillah.com.pe."
  fail=1
fi

if [ -n "${VERCEL_PROJECT_PRODUCTION_URL:-}" ] && [ "${VERCEL_PROJECT_PRODUCTION_URL,,}" != "$EXPECTED_DOMAIN" ]; then
  echo "ERROR: VERCEL_PROJECT_PRODUCTION_URL='$VERCEL_PROJECT_PRODUCTION_URL', se esperaba '$EXPECTED_DOMAIN'."
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "PROJECT VERIFICATION FAILED — no continues sin confirmar con el usuario."
  exit 1
fi

branch=$(git rev-parse --abbrev-ref HEAD)
commit=$(git log -1 --pretty="%h: %s" 2>/dev/null || echo "(sin commits)")
dirty=""
if [ -n "$(git status --porcelain)" ]; then
  dirty=" (hay cambios sin commitear)"
fi

echo "PROJECT VERIFIED"
echo "  Ruta:       $(pwd)"
echo "  Remote:     $remote_url"
echo "  Branch:     $branch$dirty"
echo "  Commit:     $commit"
echo "  Producción: https://$EXPECTED_DOMAIN"
exit 0
