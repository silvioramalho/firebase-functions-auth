# Microservice API NodeJS to manage Firebase users


## Requirements:

* firebase-tools

> export GOOGLE_APPLICATION_CREDENTIALS=your-firebase-key-path/filename.json

## Clone Repo

> git clone git@github.com:silvioramalho/firebase-functions-auth.git `<name-of-your-application>`

## Restore Packages

```
cd `<name-of-your-application>`
cd functions
npm install
```

## RUN

> npm run serve


## Deploy to Firebase

> firebase deploy --only functions:auth

## Delete Firebase Function

> firebase functions:delete auth

## Access

### Local

> http://localhost:5000/PROJETC-NAME/us-central1/auth

### Firebase Functions

> https://us-central1-PROJETC-NAME.cloudfunctions.net/auth

