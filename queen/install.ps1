# Queen CLI Windows installer
# Usage:
#   irm https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.ps1 | iex

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Script:Repo = "tjboudreaux/queenbee"
$Script:BinaryName = "queen"
$Script:MinGoVersion = "1.21"
$Script:LastInstallPath = $null

function Write-Info($Message)    { Write-Host "==> $Message" -ForegroundColor Cyan }
function Write-Success($Message) { Write-Host "==> $Message" -ForegroundColor Green }
function Write-WarningMsg($Message) { Write-Warning $Message }
function Write-Err($Message)     { Write-Host "Error: $Message" -ForegroundColor Red }

function Get-LatestVersion {
    $url = "https://api.github.com/repos/$Script:Repo/releases/latest"
    try {
        $response = Invoke-RestMethod -Uri $url -UseBasicParsing
        return $response.tag_name
    } catch {
        Write-Err "Failed to fetch latest version: $_"
        return $null
    }
}

function Install-FromRelease {
    Write-Info "Installing queen from GitHub releases..."

    $version = $env:VERSION
    if (-not $version) {
        Write-Info "Fetching latest release..."
        $version = Get-LatestVersion
        if (-not $version) {
            return $false
        }
    }

    Write-Info "Version: $version"

    # Detect architecture
    $arch = if ([Environment]::Is64BitOperatingSystem) { "x86_64" } else { "i386" }
    
    $archiveName = "${Script:BinaryName}_Windows_${arch}.zip"
    $downloadUrl = "https://github.com/$Script:Repo/releases/download/$version/$archiveName"

    $tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("queen-install-" + [guid]::NewGuid().ToString("N"))
    New-Item -ItemType Directory -Path $tempDir | Out-Null

    try {
        $archivePath = Join-Path $tempDir $archiveName
        
        Write-Info "Downloading $archiveName..."
        try {
            Invoke-WebRequest -Uri $downloadUrl -OutFile $archivePath -UseBasicParsing
        } catch {
            Write-Err "Download failed: $_"
            return $false
        }

        Write-Info "Extracting archive..."
        Expand-Archive -Path $archivePath -DestinationPath $tempDir -Force

        # Find binary
        $binaryPath = Join-Path $tempDir "${Script:BinaryName}.exe"
        if (-not (Test-Path $binaryPath)) {
            Write-Err "Binary not found in archive"
            return $false
        }

        # Install to user's local programs
        $installDir = Join-Path $env:LOCALAPPDATA "Programs\queen"
        New-Item -ItemType Directory -Path $installDir -Force | Out-Null

        Copy-Item -Path $binaryPath -Destination (Join-Path $installDir "queen.exe") -Force
        Write-Success "queen installed to $installDir\queen.exe"

        $Script:LastInstallPath = Join-Path $installDir "queen.exe"

        # Check PATH
        $pathEntries = [Environment]::GetEnvironmentVariable("PATH", "Process").Split([IO.Path]::PathSeparator) | ForEach-Object { $_.Trim() }
        if (-not ($pathEntries -contains $installDir)) {
            Write-WarningMsg "$installDir is not in your PATH. Add it with:`n  setx PATH `"$Env:PATH;$installDir`""
        }

        return $true
    } finally {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

function Test-GoSupport {
    $goCmd = Get-Command go -ErrorAction SilentlyContinue
    if (-not $goCmd) {
        return [pscustomobject]@{
            Present = $false
            MeetsRequirement = $false
            RawVersion = $null
        }
    }

    try {
        $output = & go version
    } catch {
        return [pscustomobject]@{
            Present = $false
            MeetsRequirement = $false
            RawVersion = $null
        }
    }

    $match = [regex]::Match($output, 'go(?<major>\d+)\.(?<minor>\d+)')
    if (-not $match.Success) {
        return [pscustomobject]@{
            Present = $true
            MeetsRequirement = $true
            RawVersion = $output
        }
    }

    $major = [int]$match.Groups["major"].Value
    $minor = [int]$match.Groups["minor"].Value
    $reqMajor = [int]($Script:MinGoVersion.Split('.')[0])
    $reqMinor = [int]($Script:MinGoVersion.Split('.')[1])
    $meets = ($major -gt $reqMajor) -or ($major -eq $reqMajor -and $minor -ge $reqMinor)

    return [pscustomobject]@{
        Present = $true
        MeetsRequirement = $meets
        RawVersion = $output.Trim()
    }
}

function Install-WithGo {
    Write-Info "Installing queen via go install..."
    try {
        & go install "github.com/$Script:Repo/queen/cmd/queen@latest"
        if ($LASTEXITCODE -ne 0) {
            Write-WarningMsg "go install exited with code $LASTEXITCODE"
            return $false
        }
    } catch {
        Write-WarningMsg "go install failed: $_"
        return $false
    }

    $gobin = (& go env GOBIN) 2>$null
    if ($gobin -and $gobin.Trim() -ne "") {
        $binDir = $gobin.Trim()
    } else {
        $gopath = (& go env GOPATH)
        if (-not $gopath) {
            return $true
        }
        $binDir = Join-Path $gopath "bin"
    }

    $Script:LastInstallPath = Join-Path $binDir "queen.exe"

    $pathEntries = [Environment]::GetEnvironmentVariable("PATH", "Process").Split([IO.Path]::PathSeparator) | ForEach-Object { $_.Trim() }
    if (-not ($pathEntries -contains $binDir)) {
        Write-WarningMsg "$binDir is not in your PATH. Add it with:`n  setx PATH `"$Env:PATH;$binDir`""
    }

    return $true
}

function Install-FromSource {
    Write-Info "Building queen from source..."

    $tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("queen-install-" + [guid]::NewGuid().ToString("N"))
    New-Item -ItemType Directory -Path $tempRoot | Out-Null

    try {
        $repoPath = Join-Path $tempRoot "queenbee"
        
        Write-Info "Cloning repository..."
        & git clone --depth 1 "https://github.com/$Script:Repo.git" $repoPath
        if ($LASTEXITCODE -ne 0) {
            throw "git clone failed with exit code $LASTEXITCODE"
        }

        Push-Location (Join-Path $repoPath "queen")
        try {
            Write-Info "Compiling queen.exe..."
            & go build -o queen.exe ./cmd/queen
            if ($LASTEXITCODE -ne 0) {
                throw "go build failed with exit code $LASTEXITCODE"
            }
        } finally {
            Pop-Location
        }

        $installDir = Join-Path $env:LOCALAPPDATA "Programs\queen"
        New-Item -ItemType Directory -Path $installDir -Force | Out-Null

        Copy-Item -Path (Join-Path $repoPath "queen\queen.exe") -Destination (Join-Path $installDir "queen.exe") -Force
        Write-Success "queen installed to $installDir\queen.exe"

        $Script:LastInstallPath = Join-Path $installDir "queen.exe"

        $pathEntries = [Environment]::GetEnvironmentVariable("PATH", "Process").Split([IO.Path]::PathSeparator) | ForEach-Object { $_.Trim() }
        if (-not ($pathEntries -contains $installDir)) {
            Write-WarningMsg "$installDir is not in your PATH. Add it with:`n  setx PATH `"$Env:PATH;$installDir`""
        }

        return $true
    } catch {
        Write-Err "Build from source failed: $_"
        return $false
    } finally {
        Remove-Item -Path $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
}

function Verify-Install {
    Write-Info "Verifying installation..."
    try {
        $versionOutput = & queen version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-WarningMsg "queen version exited with code $LASTEXITCODE"
            return $false
        }
        Write-Success "queen is installed: $versionOutput"
        return $true
    } catch {
        Write-WarningMsg "queen is not on PATH yet. Add the install directory to PATH and re-open your shell."
        if ($Script:LastInstallPath) {
            Write-Host "Binary location: $Script:LastInstallPath" -ForegroundColor Cyan
        }
        return $false
    }
}

function Print-GoInstallInstructions {
    Write-Host "`nTo install Go (required: $Script:MinGoVersion+), run one of the following:" -ForegroundColor Cyan

    $winget = Get-Command winget -ErrorAction SilentlyContinue
    $choco = Get-Command choco -ErrorAction SilentlyContinue
    $scoop = Get-Command scoop -ErrorAction SilentlyContinue

    if ($winget) {
        Write-Host "  winget install --exact --id GoLang.Go" -ForegroundColor Yellow
        return
    }

    if ($choco) {
        Write-Host "  choco install golang -y" -ForegroundColor Yellow
        return
    }

    if ($scoop) {
        Write-Host "  scoop install go" -ForegroundColor Yellow
        return
    }

    Write-Host "  Download and run the official installer from:" -ForegroundColor Cyan
    Write-Host "    https://go.dev/dl/" -ForegroundColor Yellow
}

# Main
Write-Host ""
Write-Host "Crown Queen CLI Installer" -ForegroundColor Magenta
Write-Host ""

$goSupport = Test-GoSupport

if ($goSupport.Present) {
    Write-Info "Detected Go: $($goSupport.RawVersion)"
}

$installed = $false

# Try GitHub releases first
if (Install-FromRelease) {
    $installed = $true
}

# Fallback to go install
if (-not $installed -and $goSupport.Present -and $goSupport.MeetsRequirement) {
    Write-WarningMsg "Release download failed, trying go install..."
    $installed = Install-WithGo
}

# Fallback to building from source
if (-not $installed) {
    if ($goSupport.Present -and $goSupport.MeetsRequirement) {
        Write-WarningMsg "Falling back to building from source..."
        $installed = Install-FromSource
    } elseif ($goSupport.Present -and -not $goSupport.MeetsRequirement) {
        Write-Err "Go $Script:MinGoVersion or newer is required (found: $($goSupport.RawVersion))."
        Print-GoInstallInstructions
        exit 1
    } else {
        Write-Err "Installation from releases failed and Go is not installed."
        Print-GoInstallInstructions
        exit 1
    }
}

if ($installed) {
    Verify-Install | Out-Null
    Write-Success "Installation complete!"
    Write-Host ""
    Write-Host "Get started:" -ForegroundColor Cyan
    Write-Host "  cd your-project"
    Write-Host "  queen init"
    Write-Host "  queen status"
    Write-Host ""
} else {
    Write-Err "Installation failed."
    exit 1
}
