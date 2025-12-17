package update

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"
)

const (
	GitHubRepo     = "tjboudreaux/queenbee"
	CheckInterval  = 24 * time.Hour
	CacheFileName  = ".queen-update-check"
)

type Release struct {
	TagName     string    `json:"tag_name"`
	Name        string    `json:"name"`
	PublishedAt time.Time `json:"published_at"`
	HTMLURL     string    `json:"html_url"`
}

type UpdateInfo struct {
	CurrentVersion  string
	LatestVersion   string
	UpdateAvailable bool
	ReleaseURL      string
	CheckedAt       time.Time
}

type cachedCheck struct {
	LatestVersion string    `json:"latest_version"`
	ReleaseURL    string    `json:"release_url"`
	CheckedAt     time.Time `json:"checked_at"`
}

func getCacheFilePath() string {
	cacheDir, err := os.UserCacheDir()
	if err != nil {
		cacheDir = os.TempDir()
	}
	return filepath.Join(cacheDir, CacheFileName)
}

func loadCachedCheck() (*cachedCheck, error) {
	data, err := os.ReadFile(getCacheFilePath())
	if err != nil {
		return nil, err
	}
	var cached cachedCheck
	if err := json.Unmarshal(data, &cached); err != nil {
		return nil, err
	}
	return &cached, nil
}

func saveCachedCheck(cached *cachedCheck) error {
	data, err := json.Marshal(cached)
	if err != nil {
		return err
	}
	return os.WriteFile(getCacheFilePath(), data, 0644)
}

func fetchLatestRelease() (*Release, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/releases/latest", GitHubRepo)

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GitHub API returned status %d", resp.StatusCode)
	}

	var release Release
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		return nil, err
	}

	return &release, nil
}

func normalizeVersion(v string) string {
	v = strings.TrimPrefix(v, "v")
	v = strings.TrimPrefix(v, "V")
	return v
}

func parseVersion(v string) (major, minor, patch int, prerelease string) {
	v = normalizeVersion(v)

	// Handle prerelease (e.g., 1.0.0-beta.1)
	if idx := strings.Index(v, "-"); idx != -1 {
		prerelease = v[idx+1:]
		v = v[:idx]
	}

	parts := strings.Split(v, ".")
	if len(parts) >= 1 {
		major, _ = strconv.Atoi(parts[0])
	}
	if len(parts) >= 2 {
		minor, _ = strconv.Atoi(parts[1])
	}
	if len(parts) >= 3 {
		patch, _ = strconv.Atoi(parts[2])
	}
	return
}

func CompareVersions(current, latest string) int {
	cMajor, cMinor, cPatch, cPre := parseVersion(current)
	lMajor, lMinor, lPatch, lPre := parseVersion(latest)

	if cMajor != lMajor {
		return cMajor - lMajor
	}
	if cMinor != lMinor {
		return cMinor - lMinor
	}
	if cPatch != lPatch {
		return cPatch - lPatch
	}

	// Handle prerelease: release > prerelease
	if cPre == "" && lPre != "" {
		return 1 // current is release, latest is prerelease
	}
	if cPre != "" && lPre == "" {
		return -1 // current is prerelease, latest is release
	}

	return strings.Compare(cPre, lPre)
}

func CheckForUpdate(currentVersion string, forceCheck bool) (*UpdateInfo, error) {
	info := &UpdateInfo{
		CurrentVersion: currentVersion,
	}

	// Skip check for dev builds
	if currentVersion == "dev" || currentVersion == "" {
		return info, nil
	}

	// Check cache first (unless forced)
	if !forceCheck {
		if cached, err := loadCachedCheck(); err == nil {
			if time.Since(cached.CheckedAt) < CheckInterval {
				info.LatestVersion = cached.LatestVersion
				info.ReleaseURL = cached.ReleaseURL
				info.CheckedAt = cached.CheckedAt
				info.UpdateAvailable = CompareVersions(currentVersion, cached.LatestVersion) < 0
				return info, nil
			}
		}
	}

	// Fetch from GitHub
	release, err := fetchLatestRelease()
	if err != nil {
		return info, err
	}

	info.LatestVersion = normalizeVersion(release.TagName)
	info.ReleaseURL = release.HTMLURL
	info.CheckedAt = time.Now()
	info.UpdateAvailable = CompareVersions(currentVersion, info.LatestVersion) < 0

	// Cache the result
	saveCachedCheck(&cachedCheck{
		LatestVersion: info.LatestVersion,
		ReleaseURL:    info.ReleaseURL,
		CheckedAt:     info.CheckedAt,
	})

	return info, nil
}

func GetInstallCommand() string {
	switch runtime.GOOS {
	case "windows":
		return `irm https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.ps1 | iex`
	default:
		return `curl -sSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.sh | bash`
	}
}

func GetUpdateInstructions(info *UpdateInfo) string {
	if !info.UpdateAvailable {
		return ""
	}

	return fmt.Sprintf(`
A new version of queen is available: %s -> %s

Update with:
  queen update

Or manually:
  %s

Release notes: %s
`,
		info.CurrentVersion,
		info.LatestVersion,
		GetInstallCommand(),
		info.ReleaseURL,
	)
}
