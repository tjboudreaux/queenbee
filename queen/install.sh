#!/bin/bash
set -e

# Queen CLI Installer
# Usage: curl -sSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.sh | bash

REPO="tjboudreaux/queenbee"
BINARY_NAME="queen"
INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() { echo -e "${GREEN}==>${NC} $1"; }
warn() { echo -e "${YELLOW}WARNING:${NC} $1"; }
error() { echo -e "${RED}ERROR:${NC} $1" >&2; exit 1; }

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*) echo "Darwin" ;;
        Linux*)  echo "Linux" ;;
        MINGW*|MSYS*|CYGWIN*) echo "Windows" ;;
        *) error "Unsupported operating system: $(uname -s)" ;;
    esac
}

# Detect architecture
detect_arch() {
    case "$(uname -m)" in
        x86_64|amd64) echo "x86_64" ;;
        arm64|aarch64) echo "arm64" ;;
        *) error "Unsupported architecture: $(uname -m)" ;;
    esac
}

# Get latest release version
get_latest_version() {
    local version
    if command -v curl &> /dev/null; then
        version=$(curl -sL "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    elif command -v wget &> /dev/null; then
        version=$(wget -qO- "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
    else
        error "curl or wget is required"
    fi
    
    if [ -z "$version" ]; then
        error "Failed to get latest version. You may need to install from source."
    fi
    
    echo "$version"
}

# Download file
download() {
    local url=$1
    local output=$2
    
    if command -v curl &> /dev/null; then
        curl -sL "$url" -o "$output"
    elif command -v wget &> /dev/null; then
        wget -qO "$output" "$url"
    else
        error "curl or wget is required"
    fi
}

# Main installation
main() {
    info "Queen CLI Installer"
    echo ""
    
    local os=$(detect_os)
    local arch=$(detect_arch)
    local version="${VERSION:-$(get_latest_version)}"
    
    info "Detected: $os $arch"
    info "Version: $version"
    
    # Construct download URL
    local filename="${BINARY_NAME}_${os}_${arch}"
    if [ "$os" = "Windows" ]; then
        filename="${filename}.zip"
    else
        filename="${filename}.tar.gz"
    fi
    
    local url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    
    # Create temp directory
    local tmpdir=$(mktemp -d)
    trap "rm -rf $tmpdir" EXIT
    
    info "Downloading ${url}..."
    download "$url" "${tmpdir}/${filename}"
    
    if [ ! -f "${tmpdir}/${filename}" ]; then
        error "Download failed"
    fi
    
    # Extract
    info "Extracting..."
    cd "$tmpdir"
    if [ "$os" = "Windows" ]; then
        unzip -q "$filename"
    else
        tar -xzf "$filename"
    fi
    
    # Find binary
    local binary
    if [ -f "${BINARY_NAME}" ]; then
        binary="${BINARY_NAME}"
    elif [ -f "${BINARY_NAME}.exe" ]; then
        binary="${BINARY_NAME}.exe"
    else
        error "Binary not found in archive"
    fi
    
    # Install
    info "Installing to ${INSTALL_DIR}..."
    
    # Check if we need sudo
    if [ -w "$INSTALL_DIR" ]; then
        cp "$binary" "${INSTALL_DIR}/${BINARY_NAME}"
        chmod +x "${INSTALL_DIR}/${BINARY_NAME}"
    else
        warn "Requires sudo to install to ${INSTALL_DIR}"
        sudo cp "$binary" "${INSTALL_DIR}/${BINARY_NAME}"
        sudo chmod +x "${INSTALL_DIR}/${BINARY_NAME}"
    fi
    
    # Verify
    info "Verifying installation..."
    if command -v queen &> /dev/null; then
        echo ""
        queen version
        echo ""
        info "Installation complete!"
        info "Run 'queen --help' to get started"
    else
        warn "queen installed but not in PATH"
        info "Add ${INSTALL_DIR} to your PATH or run: ${INSTALL_DIR}/queen"
    fi
}

main "$@"
