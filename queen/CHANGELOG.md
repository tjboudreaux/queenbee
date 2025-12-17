## [1.0.3](https://github.com/tjboudreaux/queenbee/compare/v1.0.2...v1.0.3) (2025-12-16)

### Bug Fixes

* **ci:** set project_name to queen for correct archive naming ([2f2321a](https://github.com/tjboudreaux/queenbee/commit/2f2321abbe81984eaba80be85511267f192ff13d))

## [1.0.2](https://github.com/tjboudreaux/queenbee/compare/v1.0.1...v1.0.2) (2025-12-16)

### Bug Fixes

* **ci:** disable homebrew in goreleaser until tap is set up ([49efd08](https://github.com/tjboudreaux/queenbee/commit/49efd0878c0dbe53ba386c25d8a992fe4a076f15))

## [1.0.1](https://github.com/tjboudreaux/queenbee/compare/v1.0.0...v1.0.1) (2025-12-16)

### Bug Fixes

* **ci:** run goreleaser after semantic-release creates a tag ([2dd72fa](https://github.com/tjboudreaux/queenbee/commit/2dd72faf94ffcd61a9f477579fcea80abe3a11cc))

## 1.0.0 (2025-12-16)

### Features

* **ci:** add semantic-release for automated versioning ([a46b3ce](https://github.com/tjboudreaux/queenbee/commit/a46b3ce4554ac93febc7ef459d1dc19d55dbca54))
* **daemon:** support default_agent for triage workflow ([16c46bc](https://github.com/tjboudreaux/queenbee/commit/16c46bc0963a1d872fc46708eeef6794a7245cb4))
* **msg:** add [@all](https://github.com/all) broadcast support ([1c85467](https://github.com/tjboudreaux/queenbee/commit/1c85467c23de24e48d3012e6356cbf527da29266))
* **queen:** add agent registry and command runner ([fdd98ce](https://github.com/tjboudreaux/queenbee/commit/fdd98ce85ddb134c45e4aa702737dba73fa2f17a))
* **queen:** add basic workflow integration tests ([8b588a7](https://github.com/tjboudreaux/queenbee/commit/8b588a7817639d6a8c0674c2d83a684ee3daab66))
* **queen:** add Bubble Tea TUI for messages and enhanced watch dashboard ([27709b3](https://github.com/tjboudreaux/queenbee/commit/27709b3a996486e3b69943e863020a8706b27ff2))
* **queen:** add comprehensive install scripts and release infrastructure ([fbe9fd7](https://github.com/tjboudreaux/queenbee/commit/fbe9fd7fde1ce31bf44a49822d6c1e130186b7b5))
* **queen:** add install.sh quick install script ([a4a0711](https://github.com/tjboudreaux/queenbee/commit/a4a0711d9cc3f52caf35a742ba97826e3bbca889))
* **queen:** add integration test infrastructure ([6adeccd](https://github.com/tjboudreaux/queenbee/commit/6adeccdde4b7bc97669052472551cbd52577ceb4))
* **queen:** add startup/shutdown phases and tests for workflow and queue ([124c37d](https://github.com/tjboudreaux/queenbee/commit/124c37d0f07eec16f81ded224e25e76c7ccab3cb))
* **queen:** add T_AGENT placeholder support in workflows ([775c448](https://github.com/tjboudreaux/queenbee/commit/775c4484105a50773be6b0bea76db63e977f2a03))
* **queen:** add workflows and work queue ([9b25d06](https://github.com/tjboudreaux/queenbee/commit/9b25d06c7df637265e7b597e78551bb795aef282))
* **queen:** implement assignment storage and CLI commands ([6171056](https://github.com/tjboudreaux/queenbee/commit/6171056fe17c4f7b63a2f40d8ec74124302f6a32))
* **queen:** implement beads integration for issue validation ([71fe36e](https://github.com/tjboudreaux/queenbee/commit/71fe36e73c2e8262ae195870cbc3bae66366c5a5))
* **queen:** implement config command for persistent settings ([b3a909f](https://github.com/tjboudreaux/queenbee/commit/b3a909f561fb8c88d8017f9e1589c7bf66f877b5))
* **queen:** implement conflict resolution logic ([ea1bdf7](https://github.com/tjboudreaux/queenbee/commit/ea1bdf7a2ee5a8fb4444fd88eb5db0bb93120efb))
* **queen:** implement daemon (start/stop/status) ([a1c53b9](https://github.com/tjboudreaux/queenbee/commit/a1c53b95fc1ed990a906518fa809845a26e99270))
* **queen:** implement epic decomposition logic ([1a4d758](https://github.com/tjboudreaux/queenbee/commit/1a4d75859ed1b45059988a87078dd398005429a6))
* **queen:** implement message storage and CLI commands ([bd3b7e4](https://github.com/tjboudreaux/queenbee/commit/bd3b7e48112c961b40c76e55c0f698bafaf8748e))
* **queen:** implement reservation storage and CLI commands ([c25e97f](https://github.com/tjboudreaux/queenbee/commit/c25e97f8be2f7c764918db38309ba8fc085e4d43))
* **queen:** implement task assignment algorithm ([cfd740f](https://github.com/tjboudreaux/queenbee/commit/cfd740f02ace2a46b804226837ea9342e9c7cc1a))
* **queen:** initialize Go module and project structure ([881b71d](https://github.com/tjboudreaux/queenbee/commit/881b71d36ec1b2ca93c2af09aea7ac19668b1118))
* **queenui:** add multi-worktree tabs ([0195587](https://github.com/tjboudreaux/queenbee/commit/0195587d1f880423aa2f15631400de0cef87b816))
* **queenui:** add Queen droids status panel ([71fd916](https://github.com/tjboudreaux/queenbee/commit/71fd9164f3fd51f1a44dca99574655140c3fbef6))
* **queenui:** add Queen reservation panel ([1a72cc5](https://github.com/tjboudreaux/queenbee/commit/1a72cc5f813d0fc620f44ee7bd1021d14593b4d4))
* **queenui:** fork beads-ui and add Queen panels ([4762c4b](https://github.com/tjboudreaux/queenbee/commit/4762c4bf8f3172bbf05ab4c79450ab51e9362269))
* **registry:** add agent directory listing ([b7f3350](https://github.com/tjboudreaux/queenbee/commit/b7f3350b5ad8e90f35c6e8fd7ed858b6d13a79f7))
* **watch:** add bd status metrics with streamlined display ([0aa9210](https://github.com/tjboudreaux/queenbee/commit/0aa92104da8d8d0d1349f53969ea3a1e27f5775d))
* **watch:** add live status dashboard with delta tracking ([f05795c](https://github.com/tjboudreaux/queenbee/commit/f05795cb9ce5ba85f721a0b4276203ee6441a476))
* **watch:** compress to powerline format with full bd status metrics ([473773e](https://github.com/tjboudreaux/queenbee/commit/473773e19a73a862684010e7679bb75664460fdb))
* **watch:** move agents to detailed section below powerline ([38b2faf](https://github.com/tjboudreaux/queenbee/commit/38b2faf3ca2ab3fea2763a40079d0b6aac04f648))

### Bug Fixes

* **queen:** add Windows compatibility for runner process management ([c20f9f4](https://github.com/tjboudreaux/queenbee/commit/c20f9f41415b026ce7e561368931065ff8f7ecb7))
* **queen:** address golangci-lint issues ([93eca9d](https://github.com/tjboudreaux/queenbee/commit/93eca9dda1355beaaf72229d2b0e40f98e2fd0b3))
* **queen:** fix flaky macOS tests in runner_test.go ([b3a606b](https://github.com/tjboudreaux/queenbee/commit/b3a606b63dbb552d974248025f8e7838973c7b4f))
* **queen:** fix Windows test compatibility ([c26d861](https://github.com/tjboudreaux/queenbee/commit/c26d861d3df333fe3c9a539c853f6054bde113f0))
* **queen:** resolve remaining golangci-lint issues ([2a10825](https://github.com/tjboudreaux/queenbee/commit/2a10825f5eb03e070841b22d3ae21a78e5bb1044))

### Code Refactoring

* rename droid to agent with backward compatibility ([4c02a63](https://github.com/tjboudreaux/queenbee/commit/4c02a634fefcaa148a4d91798227fe904d2e7f5e))

# Changelog

All notable changes to Queen CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
