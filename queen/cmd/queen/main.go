package main

import (
	"fmt"
	"os"

	"github.com/tjboudreaux/queenbee/queen/internal/cli"
)

var (
	Version = "dev"
	Commit  = "unknown"
	Date    = "unknown"
)

func main() {
	cli.SetVersionInfo(Version, Commit, Date)

	if err := cli.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
