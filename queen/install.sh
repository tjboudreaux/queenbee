#!/usr/bin/env bash
#
# Queen CLI Installer (redirect to main install script)
# Usage: curl -fsSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.sh | bash
#
# This script redirects to the main install script in scripts/install.sh
# for backward compatibility with existing documentation.
#

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# If running from a local clone, use the local script
if [ -f "$SCRIPT_DIR/scripts/install.sh" ]; then
    exec "$SCRIPT_DIR/scripts/install.sh" "$@"
fi

# Otherwise, download and run the main install script
exec bash <(curl -fsSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/scripts/install.sh) "$@"
