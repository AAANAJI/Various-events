#!/usr/bin/env bash
#
# One-time server setup for the VARIOUS staging deploy.
# Run this ONCE, on the staging server, as root or with sudo.
#
#   curl -fsSL <raw url> -o setup.sh && less setup.sh && sudo bash setup.sh
#
# It does three things:
#   1. creates /var/www/staging/various, owned by the deploy user
#   2. generates a dedicated CI keypair
#   3. authorises the public half and prints the private half ONCE
#
# The private half is printed as a single base64 line. Copy it straight into the
# GitHub secret SSH_PRIVATE_KEY. Do not send it anywhere else, do not paste it
# into a chat, and do not save it to a file — it is not stored on the server.
set -euo pipefail

PROJECT="${PROJECT:-various}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
WEB_ROOT="/var/www/staging/${PROJECT}"

SUDO=""
[ "$(id -u)" -ne 0 ] && SUDO="sudo"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

# ── Preconditions ───────────────────────────────────────────────────────────
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  echo "ERROR: there is no '$DEPLOY_USER' user on this server." >&2
  echo "       Re-run with the right name, e.g.  DEPLOY_USER=www-data sudo -E bash $0" >&2
  exit 1
fi
if [ ! -d /var/www/staging ]; then
  echo "ERROR: /var/www/staging does not exist — is this the right server?" >&2
  exit 1
fi

DEPLOY_HOME="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
[ -n "$DEPLOY_HOME" ] || { echo "ERROR: cannot find the home directory for $DEPLOY_USER" >&2; exit 1; }

# ── 1. The web root ─────────────────────────────────────────────────────────
say "1. Creating $WEB_ROOT"
$SUDO install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" -m 755 "$WEB_ROOT"
$SUDO test -w "$WEB_ROOT" || true
echo "   created, owned by $DEPLOY_USER"

# ── 2. A dedicated CI key ───────────────────────────────────────────────────
say "2. Generating a CI keypair"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
ssh-keygen -t ed25519 -C "github-actions@${PROJECT}" -f "$TMP/ci" -N "" -q
echo "   done (this key is new; it does not affect any existing deploy)"

# ── 3. Authorise it ─────────────────────────────────────────────────────────
say "3. Authorising it for $DEPLOY_USER"
$SUDO install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$DEPLOY_HOME/.ssh"
$SUDO touch "$DEPLOY_HOME/.ssh/authorized_keys"
# shellcheck disable=SC2024
$SUDO tee -a "$DEPLOY_HOME/.ssh/authorized_keys" < "$TMP/ci.pub" >/dev/null
$SUDO chown "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_HOME/.ssh/authorized_keys"
$SUDO chmod 600 "$DEPLOY_HOME/.ssh/authorized_keys"
echo "   appended to $DEPLOY_HOME/.ssh/authorized_keys"

# ── 4. The three secrets ────────────────────────────────────────────────────
cat <<EOF

════════════════════════════════════════════════════════════════════
 Add these three at
 github.com/AAANAJI/Various-events/settings/secrets/actions

   SSH_USER   = $DEPLOY_USER
   SSH_HOST   = the address you used to log in to this server
   SSH_PRIVATE_KEY = the single line between the markers below
════════════════════════════════════════════════════════════════════

----- COPY FROM THE NEXT LINE -----
EOF
base64 -w0 < "$TMP/ci" 2>/dev/null || base64 < "$TMP/ci" | tr -d '\n'
cat <<'EOF'

----- COPY TO THE LINE ABOVE -----

That line is a private key. It is not saved anywhere on this server —
if you lose it, re-run this script to issue a new one.
EOF
