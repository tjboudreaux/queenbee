#!/usr/bin/env bash
#
# Queen CLI installation script
# Usage: curl -fsSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/scripts/install.sh | bash
#
# Environment variables:
#   VERSION - specific version to install (default: latest)
#   INSTALL_DIR - installation directory (default: /usr/local/bin or ~/.local/bin)
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO="tjboudreaux/queenbee"
BINARY_NAME="queen"
MIN_GO_VERSION="1.21"

log_info() {
    echo -e "${BLUE}==>${NC} $1"
}

log_success() {
    echo -e "${GREEN}==>${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}==>${NC} $1"
}

log_error() {
    echo -e "${RED}Error:${NC} $1" >&2
}

# Re-sign binary for macOS to avoid slow Gatekeeper checks
resign_for_macos() {
    local binary_path=$1

    if [[ "$(uname -s)" != "Darwin" ]]; then
        return 0
    fi

    if ! command -v codesign &> /dev/null; then
        return 0
    fi

    log_info "Re-signing binary for macOS..."
    codesign --remove-signature "$binary_path" 2>/dev/null || true
    if codesign --force --sign - "$binary_path"; then
        log_success "Binary re-signed for this machine"
    fi
}

# Detect OS and architecture
detect_platform() {
    local os arch

    case "$(uname -s)" in
        Darwin)
            os="Darwin"
            ;;
        Linux)
            os="Linux"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            os="Windows"
            ;;
        *)
            log_error "Unsupported operating system: $(uname -s)"
            exit 1
            ;;
    esac

    case "$(uname -m)" in
        x86_64|amd64)
            arch="x86_64"
            ;;
        aarch64|arm64)
            arch="arm64"
            ;;
        *)
            log_error "Unsupported architecture: $(uname -m)"
            exit 1
            ;;
    esac

    echo "${os}_${arch}"
}

# Get latest release version from GitHub
get_latest_version() {
    local latest_url="https://api.github.com/repos/${REPO}/releases/latest"
    local version

    if command -v curl &> /dev/null; then
        version=$(curl -fsSL "$latest_url" | grep '"tag_name"' | sed -E 's/.*"tag_name": "([^"]+)".*/\1/')
    elif command -v wget &> /dev/null; then
        version=$(wget -qO- "$latest_url" | grep '"tag_name"' | sed -E 's/.*"tag_name": "([^"]+)".*/\1/')
    else
        log_error "Neither curl nor wget found. Please install one of them."
        return 1
    fi

    if [ -z "$version" ]; then
        log_error "Failed to fetch latest version"
        return 1
    fi

    echo "$version"
}

# Download and install from GitHub releases
install_from_release() {
    log_info "Installing queen from GitHub releases..."

    local platform=$1
    local tmp_dir
    tmp_dir=$(mktemp -d)

    # Get version
    local version="${VERSION:-}"
    if [ -z "$version" ]; then
        log_info "Fetching latest release..."
        version=$(get_latest_version) || return 1
    fi

    log_info "Version: $version"

    # Construct download URL
    local archive_name="${BINARY_NAME}_${platform}"
    if [[ "$platform" == Windows* ]]; then
        archive_name="${archive_name}.zip"
    else
        archive_name="${archive_name}.tar.gz"
    fi
    
    local download_url="https://github.com/${REPO}/releases/download/${version}/${archive_name}"

    log_info "Downloading $archive_name..."

    cd "$tmp_dir"
    if command -v curl &> /dev/null; then
        if ! curl -fsSL -o "$archive_name" "$download_url"; then
            log_error "Download failed"
            cd - > /dev/null || cd "$HOME"
            rm -rf "$tmp_dir"
            return 1
        fi
    elif command -v wget &> /dev/null; then
        if ! wget -q -O "$archive_name" "$download_url"; then
            log_error "Download failed"
            cd - > /dev/null || cd "$HOME"
            rm -rf "$tmp_dir"
            return 1
        fi
    fi

    # Extract archive
    log_info "Extracting archive..."
    if [[ "$archive_name" == *.zip ]]; then
        unzip -q "$archive_name"
    else
        tar -xzf "$archive_name"
    fi

    # Determine install location
    local install_dir="${INSTALL_DIR:-}"
    if [ -z "$install_dir" ]; then
        if [[ -w /usr/local/bin ]]; then
            install_dir="/usr/local/bin"
        else
            install_dir="$HOME/.local/bin"
            mkdir -p "$install_dir"
        fi
    fi

    # Find and install binary
    local binary
    if [ -f "${BINARY_NAME}" ]; then
        binary="${BINARY_NAME}"
    elif [ -f "${BINARY_NAME}.exe" ]; then
        binary="${BINARY_NAME}.exe"
    else
        log_error "Binary not found in archive"
        cd - > /dev/null || cd "$HOME"
        rm -rf "$tmp_dir"
        return 1
    fi

    log_info "Installing to $install_dir..."
    if [[ -w "$install_dir" ]]; then
        mv "$binary" "${install_dir}/${BINARY_NAME}"
        chmod +x "${install_dir}/${BINARY_NAME}"
    else
        sudo mv "$binary" "${install_dir}/${BINARY_NAME}"
        sudo chmod +x "${install_dir}/${BINARY_NAME}"
    fi

    resign_for_macos "${install_dir}/${BINARY_NAME}"

    LAST_INSTALL_PATH="${install_dir}/${BINARY_NAME}"
    log_success "queen installed to ${install_dir}/${BINARY_NAME}"

    # Check if install_dir is in PATH
    if [[ ":$PATH:" != *":$install_dir:"* ]]; then
        log_warning "$install_dir is not in your PATH"
        echo ""
        echo "Add this to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
        echo "  export PATH=\"\$PATH:$install_dir\""
        echo ""
    fi

    cd - > /dev/null || cd "$HOME"
    rm -rf "$tmp_dir"
    return 0
}

# Check if Go is installed and meets minimum version
check_go() {
    if command -v go &> /dev/null; then
        local go_version=$(go version | awk '{print $3}' | sed 's/go//')
        log_info "Go detected: $(go version)"

        local major=$(echo "$go_version" | cut -d. -f1)
        local minor=$(echo "$go_version" | cut -d. -f2)
        local req_major=$(echo "$MIN_GO_VERSION" | cut -d. -f1)
        local req_minor=$(echo "$MIN_GO_VERSION" | cut -d. -f2)

        if [ "$major" -lt "$req_major" ] || ([ "$major" -eq "$req_major" ] && [ "$minor" -lt "$req_minor" ]); then
            log_error "Go $MIN_GO_VERSION or later is required (found: $go_version)"
            return 1
        fi

        return 0
    else
        return 1
    fi
}

# Install using go install (fallback)
install_with_go() {
    log_info "Installing queen using 'go install'..."

    if go install github.com/${REPO}/queen/cmd/queen@latest; then
        log_success "queen installed successfully via go install"

        local gobin
        gobin=$(go env GOBIN 2>/dev/null || true)
        if [ -n "$gobin" ]; then
            bin_dir="$gobin"
        else
            bin_dir="$(go env GOPATH)/bin"
        fi
        LAST_INSTALL_PATH="$bin_dir/queen"

        resign_for_macos "$bin_dir/queen"

        if [[ ":$PATH:" != *":$bin_dir:"* ]]; then
            log_warning "$bin_dir is not in your PATH"
            echo ""
            echo "Add this to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
            echo "  export PATH=\"\$PATH:$bin_dir\""
            echo ""
        fi

        return 0
    else
        log_error "go install failed"
        return 1
    fi
}

# Build from source (last resort)
build_from_source() {
    log_info "Building queen from source..."

    local tmp_dir
    tmp_dir=$(mktemp -d)

    cd "$tmp_dir"
    log_info "Cloning repository..."

    if git clone --depth 1 https://github.com/${REPO}.git; then
        cd queenbee/queen
        log_info "Building binary..."

        # Get version info for ldflags
        local build_version=$(git describe --tags --always --dirty 2>/dev/null || echo "dev")
        local build_commit=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
        local build_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
        local ldflags="-X main.Version=${build_version} -X main.Commit=${build_commit} -X main.Date=${build_date}"

        if go build -ldflags "$ldflags" -o queen ./cmd/queen; then
            local install_dir="${INSTALL_DIR:-}"
            if [ -z "$install_dir" ]; then
                if [[ -w /usr/local/bin ]]; then
                    install_dir="/usr/local/bin"
                else
                    install_dir="$HOME/.local/bin"
                    mkdir -p "$install_dir"
                fi
            fi

            log_info "Installing to $install_dir..."
            if [[ -w "$install_dir" ]]; then
                mv queen "$install_dir/"
            else
                sudo mv queen "$install_dir/"
            fi

            resign_for_macos "$install_dir/queen"

            LAST_INSTALL_PATH="$install_dir/queen"
            log_success "queen installed to $install_dir/queen"

            if [[ ":$PATH:" != *":$install_dir:"* ]]; then
                log_warning "$install_dir is not in your PATH"
                echo ""
                echo "Add this to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
                echo "  export PATH=\"\$PATH:$install_dir\""
                echo ""
            fi

            cd - > /dev/null || cd "$HOME"
            rm -rf "$tmp_dir"
            return 0
        else
            log_error "Build failed"
            cd - > /dev/null || cd "$HOME"
            rm -rf "$tmp_dir"
            return 1
        fi
    else
        log_error "Failed to clone repository"
        rm -rf "$tmp_dir"
        return 1
    fi
}

# Verify installation
verify_installation() {
    if command -v queen &> /dev/null; then
        log_success "queen is installed and ready!"
        echo ""
        queen version 2>/dev/null || echo "queen (development build)"
        echo ""
        echo "Get started:"
        echo "  cd your-project"
        echo "  bd init          # Initialize beads (if not already done)"
        echo "  queen status"
        echo ""
        return 0
    else
        log_error "queen was installed but is not in PATH"
        if [ -n "$LAST_INSTALL_PATH" ]; then
            echo "Binary location: $LAST_INSTALL_PATH"
        fi
        return 1
    fi
}

# Main installation flow
main() {
    echo ""
    echo "👑 Queen CLI Installer"
    echo ""

    log_info "Detecting platform..."
    local platform
    platform=$(detect_platform)
    log_info "Platform: $platform"

    # Try downloading from GitHub releases first
    if install_from_release "$platform"; then
        verify_installation
        exit 0
    fi

    log_warning "Failed to install from releases, trying alternative methods..."

    # Try go install as fallback
    if check_go; then
        if install_with_go; then
            verify_installation
            exit 0
        fi
    fi

    # Try building from source as last resort
    log_warning "Falling back to building from source..."

    if ! check_go; then
        log_warning "Go is not installed"
        echo ""
        echo "queen requires Go $MIN_GO_VERSION or later to build from source. You can:"
        echo "  1. Install Go from https://go.dev/dl/"
        echo "  2. Use your package manager:"
        echo "     - macOS: brew install go"
        echo "     - Ubuntu/Debian: sudo apt install golang"
        echo "     - Other Linux: Check your distro's package manager"
        echo ""
        echo "After installing Go, run this script again."
        exit 1
    fi

    if build_from_source; then
        verify_installation
        exit 0
    fi

    # All methods failed
    log_error "Installation failed"
    echo ""
    echo "Manual installation:"
    echo "  1. Download from https://github.com/${REPO}/releases/latest"
    echo "  2. Extract and move 'queen' to your PATH"
    echo ""
    echo "Or install from source:"
    echo "  1. Install Go from https://go.dev/dl/"
    echo "  2. Run: go install github.com/${REPO}/queen/cmd/queen@latest"
    echo ""
    exit 1
}

main "$@"
