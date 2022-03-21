# Personal Boxes

This is an [Next.js](https://nextjs.org/) - [Firebase](https://firebase.google.com/) open-source web app.

## Live version

See live deployment of app on [Vercel](https://personal-boxes.vercel.app/).

## App goal

It's app that that let people create and share personal boxes. Boxes are meant to be filled with items that creator holds dear to their heart. Everybox has a key, and it they can be shared with other special people, or made public so that everyone can enjoy its content.

## Setting up your own instance

1. Create new Firebase project from [Firebase console](https://console.firebase.google.com/).
2. Populate .env.local file with your Firebase project credentionals.
3. Get service account credentials from [Firebase console](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk).
4. Delete all new line characters from json file and assign string to FIREBASE_ADMIN const in .env.local file.
5. Set cors.json file on project. Instructions can be found [here](https://firebase.google.com/docs/storage/web/download-files#cors_configuration).
6. Run `yarn install`.
7. Run `yarn dev`.
8. (optional) Add Firestore rules to [Firebase console](https://console.firebase.google.com/) from utils folder.
