# Changelog

## [0.4.1](https://github.com/Jakob-Strobl/portfolio/compare/v0.4.0...v0.4.1) (2025-01-11)


### Bug Fixes

* **contact:** improve mobile view padding and alignment ([3837546](https://github.com/Jakob-Strobl/portfolio/commit/38375464496cd31369cc356e48a6bb5d0b0cc131))
* **umbra:** accounts for scroll offset on navigation ([975e67e](https://github.com/Jakob-Strobl/portfolio/commit/975e67e74a3f228de103bf0b2393adb65cc84c14))

## [0.4.0](https://github.com/Jakob-Strobl/portfolio/compare/v0.3.5...v0.4.0) (2025-01-05)


### Features

* add Shadow to contact and experience pages ([c613d60](https://github.com/Jakob-Strobl/portfolio/commit/c613d601a95091ec691478764567afc0c4949083))
* add transition-rect to tailwind ([5d77f17](https://github.com/Jakob-Strobl/portfolio/commit/5d77f179396d2f24a58fa36f5d47992e176ab2f3))
* add umbra and add shadow reference on creation ([7d5e727](https://github.com/Jakob-Strobl/portfolio/commit/7d5e727c3df4f17a5722e25f012d038ea1e8dab8))
* compute client side bounding box on resize ([f3b135b](https://github.com/Jakob-Strobl/portfolio/commit/f3b135b24f51aa357c6763f4fc06b3801d1510e3))
* **contact:** add linkedin and github links with matched logo dimensions ([13001e3](https://github.com/Jakob-Strobl/portfolio/commit/13001e3c35c8769efcfd44c9157fb8aa477a6762))
* **contact:** add underline to email for discovery with hover transition ([1eaf67f](https://github.com/Jakob-Strobl/portfolio/commit/1eaf67f561a213670949a1779b217962bf3fa314))
* extract menu background into Shadow component ([e12c918](https://github.com/Jakob-Strobl/portfolio/commit/e12c918d50fc41ce3bf8d62cc1741be3d5ae0171))
* finish simple contact page and copy email to clipboard on click ([15c9af6](https://github.com/Jakob-Strobl/portfolio/commit/15c9af61583c17e19fef3c617ee74656bf6f795d))
* **notify-bubble:** add tooltip to tell user email was copied to clipboard ([83ccbed](https://github.com/Jakob-Strobl/portfolio/commit/83ccbed9dbffd2c988ab156bf8e56d0330e44978))
* the &lt;Umbra /&gt; component is alive! the transitions work! ([1923c46](https://github.com/Jakob-Strobl/portfolio/commit/1923c46b98798b350373c548766bf3d9460c5b08))


### Bug Fixes

* **cloudflare:** deployments broke use vite's import.meta instead of process ([4c86e1c](https://github.com/Jakob-Strobl/portfolio/commit/4c86e1c29f928fc81cc59b71a89f4a69ca5e8d53))
* **dev|test:** vite-solidjs plugin rollback for tests and vite 6 for dev ([4937004](https://github.com/Jakob-Strobl/portfolio/commit/493700463a6fc2fd12921fdb1d26df132c8116b2))
* store shape and add comments for fade-in ([005b0e5](https://github.com/Jakob-Strobl/portfolio/commit/005b0e5b592e6981dd1474886f70d43f5af2d770))
* **tests|vite:** rollback since vite 6 + solid start causes tests to fail ([6f5573f](https://github.com/Jakob-Strobl/portfolio/commit/6f5573f45f74ae2d124a4202f408012b046f2220))
* **tests:** after upgrade some things broke with clientOnly code and added isTest helper action ([94c0f56](https://github.com/Jakob-Strobl/portfolio/commit/94c0f56bf2de8c40b5a5b264a282d31217898e25))

## [0.3.5](https://github.com/Jakob-Strobl/portfolio/compare/v0.3.4...v0.3.5) (2024-09-09)


### Bug Fixes

* actual skill issue. I blame being tired ([72e8f1d](https://github.com/Jakob-Strobl/portfolio/commit/72e8f1d69cd4473471d9639c0f7a537853ab5cf5))

## [0.3.4](https://github.com/Jakob-Strobl/portfolio/compare/v0.3.3...v0.3.4) (2024-09-09)


### Bug Fixes

* **cicd:** forgot to pass secrets to reusable workflow ([c92650d](https://github.com/Jakob-Strobl/portfolio/commit/c92650db6bd1de334abe8bb224df7bbbfe0fa0fc))

## [0.3.3](https://github.com/Jakob-Strobl/portfolio/compare/v0.3.2...v0.3.3) (2024-09-09)


### Bug Fixes

* **cicd:** set branch on cloudflare action ([ee6b758](https://github.com/Jakob-Strobl/portfolio/commit/ee6b7583df1c1954b26184ff77207c9cee0845e9))
* **cicd:** set cloudflare page action to use wrangler 3 ([9d43a79](https://github.com/Jakob-Strobl/portfolio/commit/9d43a798706f768bb79991874263e989e49db3d4))
* **cicd:** setup bun on action ([37007ef](https://github.com/Jakob-Strobl/portfolio/commit/37007ef7c312c0b79633df38665c9f0ab06e7224))

## [0.3.2](https://github.com/Jakob-Strobl/portfolio/compare/v0.3.1...v0.3.2) (2024-09-09)


### Bug Fixes

* **cicd:** only perform checkout if we know we are making tags ([6e31ade](https://github.com/Jakob-Strobl/portfolio/commit/6e31aded23cbddd96bc196e27a8c4095eaede6dd))
* **cicd:** remove redundant permissions ([f97b017](https://github.com/Jakob-Strobl/portfolio/commit/f97b017b8f3b95d77cdccf69b879f2130bf2bdd3))
* **cicd:** set permissions when triggering workflow ([c3bb197](https://github.com/Jakob-Strobl/portfolio/commit/c3bb1976d82c4fa92026e29c2cb5459db07f830b))
* **cicd:** trigger workflow as job not in steps ([0a83770](https://github.com/Jakob-Strobl/portfolio/commit/0a8377006ec44c2e51ba25ad81c4c247486d5bb7))

## [0.3.1](https://github.com/Jakob-Strobl/portfolio/compare/v0.3.0...v0.3.1) (2024-09-09)


### Bug Fixes

* try checkout before trigger? ([f609ec9](https://github.com/Jakob-Strobl/portfolio/commit/f609ec97e8a7eee4aed5d3857e923be446068a37))

## [0.3.0](https://github.com/Jakob-Strobl/portfolio/compare/v0.2.2...v0.3.0) (2024-09-09)


### Features

* deploye page to cloudflare as trigger on releases ([41e3c67](https://github.com/Jakob-Strobl/portfolio/commit/41e3c67b6e30f19b17802e431377d7fc213077aa))
* release and tag on main | create prs on feature branches ([e8d8375](https://github.com/Jakob-Strobl/portfolio/commit/e8d8375b2c8e785ea3b1fab3244334f33d66612b))


### Bug Fixes

* add missing id from workflow step ([88e34c9](https://github.com/Jakob-Strobl/portfolio/commit/88e34c919abf4d92bb9483e9b7fbe1d49fa2875d))
* bring back what's broken ([86f3a94](https://github.com/Jakob-Strobl/portfolio/commit/86f3a94e7d73f518063bfd14de9d2b66a446ad5c))
* change to only make PR against main ([684f9eb](https://github.com/Jakob-Strobl/portfolio/commit/684f9eb6a4854bf95be5b8ffff22567d265d9aa9))
* clean up step names and missing conditional to trigger page deploy ([06e5c03](https://github.com/Jakob-Strobl/portfolio/commit/06e5c0386f025d6b6079c6bc51e243d36de381c0))
* i forgot it again... filter out branches with slashes too ([4a38fc3](https://github.com/Jakob-Strobl/portfolio/commit/4a38fc326b9d573e1b09a624c4f71fbc7b58c13e))
* ignore release-please branches duh ([a1adb2f](https://github.com/Jakob-Strobl/portfolio/commit/a1adb2fc4f288e7b57326b02c0ed14fb68776768))
* match everything even forward slashes for workflow ([d009461](https://github.com/Jakob-Strobl/portfolio/commit/d0094613ac68681674d160b7eebe8bf3dacdcf0c))
* modifying conditional so tagging doesn't get skipped ([30af6ff](https://github.com/Jakob-Strobl/portfolio/commit/30af6ff66ecc174d07a30ee6ced00d951a8b226e))
* set release please to only watch main branch ([f061bfe](https://github.com/Jakob-Strobl/portfolio/commit/f061bfe48ca32b63fa67b6ea402b0ea67c77064c))


## [0.2.2](https://github.com/Jakob-Strobl/portfolio/compare/v0.2.1...v0.2.2) (2024-09-02)


### Bug Fixes

* center menu on mobile device ([963aa81](https://github.com/Jakob-Strobl/portfolio/commit/963aa818861b094c914317f99cf876a6778410e7))
* unwatch main branch for release please ([7e87472](https://github.com/Jakob-Strobl/portfolio/commit/7e8747261089319a3d3857453f1fc663a2bcefbb))

## [0.2.1](https://github.com/Jakob-Strobl/portfolio/compare/v0.2.0...v0.2.1) (2024-08-27)


### Bug Fixes

* improve broken unit test due to fade-in transition ([80467fe](https://github.com/Jakob-Strobl/portfolio/commit/80467feff2e7247e5eb346c02332ad4c9a76261b))

## [0.2.0](https://github.com/Jakob-Strobl/portfolio/compare/v0.14.0...v0.2.0) (2024-08-27)


### Features

* add color themes to tailwind ([f6a56c7](https://github.com/Jakob-Strobl/portfolio/commit/f6a56c7316283a3513b3b8f28637e3ecd7bf41e3))
* add dynamic text-stroke utility and stroke nav text on hover ([ef2ecd0](https://github.com/Jakob-Strobl/portfolio/commit/ef2ecd05ba9f86571d0d09a091ba7d49cae22edc))
* add file router with base layout and start working on main menu ([959d3a6](https://github.com/Jakob-Strobl/portfolio/commit/959d3a6a40a9ed51230da6e0b5b910f05feee06f))
* add raleway medium and to my name and stop prettier from formating src ([534f08a](https://github.com/Jakob-Strobl/portfolio/commit/534f08adccb55350ef75df7e05d8ccc9dc887faf))
* add raleway regular font ([34a7f58](https://github.com/Jakob-Strobl/portfolio/commit/34a7f58400fc57c153ae07a9cde9131f8079e04d))
* **cicd:** setup semantic release ([bc749a7](https://github.com/Jakob-Strobl/portfolio/commit/bc749a75b03daad7b3c4d54550b1ded6c1fd0f32))
* define project version as esbuild variable and render to page ([e54cc3d](https://github.com/Jakob-Strobl/portfolio/commit/e54cc3d2d349e6a134c1f3c0e4788b6acaf2d102))
* fade-in component and fade in menu buttons (doesn't work on load though sadge) ([3c287e8](https://github.com/Jakob-Strobl/portfolio/commit/3c287e8e040576be2f0c6b19874bdbfd17b0a20e))
* placement and opacity of menu - LETS GO ([42d2409](https://github.com/Jakob-Strobl/portfolio/commit/42d2409f8041b1a8ed27a7750b1e5aa533cdb05e))
* setup release please ([3696600](https://github.com/Jakob-Strobl/portfolio/commit/3696600d048681b575b2a101220537d075e845b2))
* stub out Experience and Contact page ([b6bbbdb](https://github.com/Jakob-Strobl/portfolio/commit/b6bbbdb722aaf1f1c791f0b417e267a31e20e252))
* waves background fades in with opacity transition ([d3d8d6a](https://github.com/Jakob-Strobl/portfolio/commit/d3d8d6a3f79d7c6c8ede0a78e0aac02572a35918))


### Bug Fixes

* add config file ([a5598bd](https://github.com/Jakob-Strobl/portfolio/commit/a5598bd18afc681e5e9d83bf7b720f022613b94c))
* add flag and dot to test ([a414660](https://github.com/Jakob-Strobl/portfolio/commit/a414660abb5bb40af5fa5146cd773006ead0048f))
* define branch reference explicitly ([ad1e81f](https://github.com/Jakob-Strobl/portfolio/commit/ad1e81fdb97219cc846b549abe26f12fe78fe711))
* figured out how to get fade-in on load. always trust inline styles. ([29ff041](https://github.com/Jakob-Strobl/portfolio/commit/29ff041d5e60f50d29fcc2e50336fe8b09505f96))
* include version branches ([717a692](https://github.com/Jakob-Strobl/portfolio/commit/717a692756006bcb9bc8ad6123fc7ed08f0d159f))
* learned a bit about tailwind plugins ([602766c](https://github.com/Jakob-Strobl/portfolio/commit/602766c6089b3166879d76017c668f7e8c086b98))
* move main tag to base layout for center children content by default ([cba3b78](https://github.com/Jakob-Strobl/portfolio/commit/cba3b78410ebb33c114850461ba4b0ccd9cbf90d))
* move suspense to children since only they require it ([50eebfc](https://github.com/Jakob-Strobl/portfolio/commit/50eebfc739aeb653e6040c2f71e9ca28b4d3e285))
* **prettier:** ignore changelog + prettify ([06b78b6](https://github.com/Jakob-Strobl/portfolio/commit/06b78b69fefd8ab94b667dc2a12a5141e336ea6c))
* remove feat commits bumping patch semver. bump minor preferred ([d56c6da](https://github.com/Jakob-Strobl/portfolio/commit/d56c6dadc3ad3b5cf3ffaf14f1ddffe0c5820208))
* remove this dot property ([5450a32](https://github.com/Jakob-Strobl/portfolio/commit/5450a32ed2a14252e54d66fc4fbc90b21ba40e33))
* remove unused import ([be94fdc](https://github.com/Jakob-Strobl/portfolio/commit/be94fdcfdb1b95760db9e393f4437dfb612e8c43))
* rename file to manifest ([84c3bb0](https://github.com/Jakob-Strobl/portfolio/commit/84c3bb0f1da1e20d1402ce16d80d5585dcb8e762))
* stop flickering on refresh ([3669a39](https://github.com/Jakob-Strobl/portfolio/commit/3669a39649ab99e6a2d3d554a59bb6ae0759583f))
* the table listed the json path smh d'oh ([aae6742](https://github.com/Jakob-Strobl/portfolio/commit/aae674266d28791bd3594283c2334bc57b8b10bb))
* yeah I don't know why this settings don't work for me when it's the example on solid docs ([dfa73fc](https://github.com/Jakob-Strobl/portfolio/commit/dfa73fc3781021582925d6c318bc520d2e175662))


### Miscellaneous Chores

* release 0.2.0 ([a785340](https://github.com/Jakob-Strobl/portfolio/commit/a78534087bddf292e74bdb795d50735a761d5529))

## [0.1.1](https://github.com/Jakob-Strobl/portfolio/compare/v0.1.0...v0.1.1) (2024-07-04)


### Bug Fixes

* remove feat commits bumping patch semver. bump minor preferred ([d56c6da](https://github.com/Jakob-Strobl/portfolio/commit/d56c6dadc3ad3b5cf3ffaf14f1ddffe0c5820208))
* remove this dot property ([5450a32](https://github.com/Jakob-Strobl/portfolio/commit/5450a32ed2a14252e54d66fc4fbc90b21ba40e33))
