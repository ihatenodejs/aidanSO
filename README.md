# aidanSO

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

aidanSO is the third version of my personal website, built with Next.js 15, Tailwind CSS, and Bun.

It was previously known as aidxnCC, though due to a better domain name being available, I have renamed this project to aidanSO to match the new domain name, [aidan.so](https://aidan.so).

## Development

**Requirements:**

- [Bun](https://bun.sh)
- TypeScript knowledge for development

**Quick Start:**

```bash
bun install
bun run dev
```

The development server will start on an available port (defaults to 3000, auto-increments if busy).

## Deployment

### Docker

Docker is the easiest way to deploy aidanSO. You can use the `docker-compose.yml.example` file in `examples/` for this.

Just create a `.env` file with the below variables, run `docker compose up -d --build`, and you'll be all set.

## Environment Variables

| Variable                         | Required? | Description                                                                                |
| -------------------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `LASTFM_API_KEY`                 | Yes       | Get this from your Last.fm [API account](https://www.last.fm/api/account/create)           |
| `LISTENBRAINZ_TOKEN`             | No        | Get this from your ListenBrainz [user settings](https://listenbrainz.org/settings/)        |
| `GITHUB_PROJECTS_USER`           | No        | GitHub username to display in the footer projects list (defaults to `ihatenodejs`)         |
| `GITHUB_USERNAME`                | No        | Fallback GitHub username if `GITHUB_PROJECTS_USER` is not set                              |
| `GITHUB_PROJECTS_PAT`            | No        | GitHub personal access token used to increase API limits for the footer projects list      |
| `GITHUB_PAT`                     | No        | Fallback GitHub personal access token if `GITHUB_PROJECTS_PAT` is not set                  |
| `PORT`                           | No        | Server port (defaults to `3000`)                                                           |
| `NODE_ENV`                       | No        | Environment mode (`production` or `development`, automatically set by deployment platform) |
| `WARNING_LEVEL`                  | No        | Logging level: `debug`, `info`, `warning`, or `error` (defaults to `info`)                 |
| `NO_COLOR`                       | No        | Set to any value to disable colored terminal output                                        |
| `NEXT_PUBLIC_DEFAULT_TIME_RANGE` | No        | Default time range for AI usage page (defaults to `3m`)                                    |

## MusicBrainz

This project does not use a custom user agent when interacting with the MusicBrainz API. This is because the LastPlayed component is rendered client-side and user agent support is not universal.

If bugs were to occur with my code, I believe it would be easier for MusicBrainz to block this way.

## Contributing

Any and all contributions are welcome! Simply create a pull request and I should have a response to you within a day.

Please use common sense when contributing :)
