## Requirements

Node.js (LTS) https://nodejs.org/

## URL Parameters

- workerId
  - Worker Id passed from MTurk
  - Default: `testWorkerId`
- exp
  - Experiment plan used
  - Default: `default`
- fullscreen (`true`/`false`)
  - Force player to play in fullscreen
  - Default: `false`

## Instructions, Consent, Demographics, Debriefing, etc. Files

Instructions, consent, demographics, debriefing, etc. files are now all located in the pregame folder in the game-data repository:

https://github.com/lupyanlab/Rule-Game-game-data/tree/master/pregame

The demographics files follow the SurveyJS standard format for writing new questions.

SurveyJS Library Documentation: https://surveyjs.io/Examples/Library?id=questiontype-text&platform=jQuery&theme=modern#content-result

## Local Development

### Install Dependencies

Run `npm install` in this folder/directory.

### Run Server

`npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## GitHub Actions

Currently, there is a GitHub Actions server (Private Repo: https://github.com/kmui2/github-actions-server) in the `/var/www/rule-game/github-actions-server` folder which allows new frontend builds to be uploaded directly from GitHub Actions. Backups of older builds are stored in `/var/www/rule-game/github-actions-server/backups` and may be manually deleted.
