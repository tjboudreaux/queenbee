# Installing Queen CLI

Queen is a multi-agent coordination CLI for AI-assisted development workflows.

## Quick Install

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/scripts/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.ps1 | iex
```

## Alternative Installation Methods

### Go Install

If you have Go 1.21+ installed:

```bash
go install github.com/tjboudreaux/queenbee/queen/cmd/queen@latest
```

### Homebrew (macOS/Linux)

```bash
brew install tjboudreaux/tap/queen
```

### Manual Download

1. Download the appropriate archive from the [latest release](https://github.com/tjboudreaux/queenbee/releases/latest)
2. Extract the archive
3. Move the `queen` binary to a directory in your PATH

**Available archives:**
- `queen_Darwin_x86_64.tar.gz` - macOS Intel
- `queen_Darwin_arm64.tar.gz` - macOS Apple Silicon
- `queen_Linux_x86_64.tar.gz` - Linux x64
- `queen_Linux_arm64.tar.gz` - Linux ARM64
- `queen_Windows_x86_64.zip` - Windows x64

### Build from Source

```bash
git clone https://github.com/tjboudreaux/queenbee.git
cd queenbee/queen
go build -o queen ./cmd/queen
sudo mv queen /usr/local/bin/
```

## Verifying Installation

After installation, verify queen is working:

```bash
queen version
```

## Getting Started

```bash
# Navigate to your project
cd your-project

# Initialize beads (if not already done)
bd init

# Check queen status
queen status

# Get help
queen --help
```

## Updating

To update to the latest version, run the same install command you used initially.

## Uninstalling

### If installed via script or manual download

```bash
# macOS/Linux
sudo rm /usr/local/bin/queen
# or
rm ~/.local/bin/queen
```

```powershell
# Windows
Remove-Item "$env:LOCALAPPDATA\Programs\queen" -Recurse
```

### If installed via Go

```bash
rm $(go env GOPATH)/bin/queen
```

### If installed via Homebrew

```bash
brew uninstall queen
```

## Troubleshooting

### "queen: command not found"

Ensure the installation directory is in your PATH:

```bash
# Check where queen was installed
which queen

# If using ~/.local/bin, add to your shell profile:
echo 'export PATH="$PATH:$HOME/.local/bin"' >> ~/.bashrc
source ~/.bashrc
```

### macOS Gatekeeper Warning

If you see a warning about an unverified developer, the install script automatically re-signs the binary. If you downloaded manually:

```bash
codesign --force --sign - /usr/local/bin/queen
```

### Permission Denied

If you can't write to `/usr/local/bin`, the script will use `~/.local/bin` instead. Alternatively, use sudo:

```bash
curl -fsSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/scripts/install.sh | sudo bash
```

## Requirements

- **From releases:** No dependencies (pre-compiled binaries)
- **From source:** Go 1.21 or later
