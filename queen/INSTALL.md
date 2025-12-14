# Queen CLI Installation

## Quick Install (recommended)

### Using install script

```bash
curl -sSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.sh | bash
```

### Using Homebrew (macOS/Linux)

```bash
brew tap tjboudreaux/tap
brew install queen
```

### Using Go

```bash
go install github.com/tjboudreaux/queenbee/queen/cmd/queen@latest
```

## Manual Installation

1. Download the appropriate release for your platform from [GitHub Releases](https://github.com/tjboudreaux/queenbee/releases)

2. Extract the archive:
   ```bash
   tar -xzf queen_Darwin_arm64.tar.gz  # macOS Apple Silicon
   tar -xzf queen_Darwin_x86_64.tar.gz # macOS Intel
   tar -xzf queen_Linux_x86_64.tar.gz  # Linux
   ```

3. Move to your PATH:
   ```bash
   sudo mv queen /usr/local/bin/
   ```

4. Verify installation:
   ```bash
   queen version
   ```

## Build from Source

```bash
git clone https://github.com/tjboudreaux/queenbee.git
cd queenbee/queen
go build -o queen ./cmd/queen
./queen version
```

## Supported Platforms

| OS | Architecture | Download |
|----|--------------|----------|
| macOS | Apple Silicon (arm64) | `queen_Darwin_arm64.tar.gz` |
| macOS | Intel (x86_64) | `queen_Darwin_x86_64.tar.gz` |
| Linux | arm64 | `queen_Linux_arm64.tar.gz` |
| Linux | x86_64 | `queen_Linux_x86_64.tar.gz` |
| Windows | x86_64 | `queen_Windows_x86_64.zip` |
| Windows | arm64 | `queen_Windows_arm64.zip` |

## Verify Installation

```bash
queen version
```

Should output something like:
```
queen v0.1.0 (commit: abc123, built: 2024-01-01T00:00:00Z)
```

## Getting Started

After installation, initialize queen in your project:

```bash
# Set your droid identity
queen config set droid my-droid-name

# View your inbox
queen msg inbox

# List reservations
queen reserved

# View assignments
queen assignments
```

See `queen --help` for all available commands.
