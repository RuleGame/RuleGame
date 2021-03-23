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

## Texts File

[`src/constants/texts.tsx`](src/constants/texts.tsx)

### Adding Images

```tsx
// store images in src/assets folder
import HappyFace from '../assets/smiley-face.png';

<Box width="small" height="small">
  <Image src={HappyFace} fill />
</Box>;
```

## Demographics File

[`src/constants/demographics.ts`](src/constants/demographics.ts)

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
