## Requirements to get the app to work:
- `node` (best way is to get LTS version): https://nodejs.org/en/
- `yarn`: https://yarnpkg.com/lang/en/

---

### 1. Install packages
`yarn install`
### 2. Start local server
`yarn start`
### 3. Create local `.env` file for firebase connection

---

## Firebase database + authentication
so to get this to work locally you need a (free) account and from [firebase](https://firebase.google.com)

then create a new file in root folder `.env.local` (or depending on what stage you work, any of the following are already in the gitignore `.env.local` `.env.development.local` `.env.test.local` `.env.production.local`)

The .env file needs the following Variables:
```
REACT_APP_API_KEY=*****
REACT_APP_AUTH_DOMAIN=*****.firebaseapp.com
REACT_APP_DATABASE_URL=https://*****.firebaseio.com
REACT_APP_PROJECT_ID=*****
REACT_APP_STORAGE_BUCKET=*****.appspot.com
REACT_APP_MESSAGING_SENDER_ID=*****
REACT_APP_MAPS_KEY=*****
```

You can find them in your firebase console.