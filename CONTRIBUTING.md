# Contributing

Thanks for contributing to YouTube Local Library! We're quite open to new feature requests, or any work you want to do.

Please note we have a [code of conduct](./CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Creating Issues

When creating issues please follow the according template structure:
- [Bug report](./.github/ISSUE_TEMPLATE/bug_report.md)
- [Feature request](./.github/ISSUE_TEMPLATE/feature_request.md)
- [Custom](./.github/ISSUE_TEMPLATE/custom.md)

## Contributor Workflow

The codebase is maintained using the "contributor workflow" where everyone without exception contributes patch proposals using "pull requests". This facilitates social contribution, easy testing and peer review.

To contribute a patch, the workflow is as follows:

- Fork repository
- Create topic branch
- Commit patches

If you send a pull request, please do it against the `main` branch.

## Set up a local dev environment

To set up a local dev environment following steps are required:

1. Fork this repository
2. Clone:
```sh
git clone git@github.com:[YOUR_USERNAME]/youtube-local-library-ff.git
```
3. Go into cloned repository folder:
```sh
cd youtube-local-library-ff
```
4. Install yarn:
```sh
yarn install
```
5. Build project:
```sh
yarn build
```
or watch changes:
```sh
yarn watch
```
6. Create a zip archive containing all of the HTML files, `manifest.json` file and `dist` and `images` folders.
7. Open following URL in Firefox: [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
8. Upload the zip archive

## Codestyle

This project uses [ESLint](https://eslint.org/) to validate and lint JavaScript code.

To lint the code run:

```sh
yarn lint
```
