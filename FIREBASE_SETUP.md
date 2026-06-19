# Setting up the global leaderboard backend (Firebase Realtime Database)

This is free, has no server to maintain, and works straight from a static
HTML file via its REST API.

## 1. Create the project
1. Go to https://console.firebase.google.com and click **Add project**.
2. Name it anything (e.g. `red-cube-collector`). You can skip Google Analytics.

## 2. Create the Realtime Database
1. In the left sidebar: **Build → Realtime Database → Create Database**.
2. Pick any region.
3. Start in **locked mode** (we'll set custom rules in step 4).

## 3. Get your database URL
After creation you'll see a URL at the top of the Realtime Database page,
shaped like:

```
https://red-cube-collector-default-rtdb.firebaseio.com
```

Copy it.

## 4. Set the security rules
Go to the **Rules** tab of the Realtime Database and paste this:

```json
{
  "rules": {
    "leaderboard": {
      "$mode": {
        "$difficulty": {
          ".read": true,
          ".write": true,
          ".validate": "newData.hasChildren() || newData.val() == null",
          "$index": {
            ".validate": "newData.hasChildren(['name','time'])",
            "name": { ".validate": "newData.isString() && newData.val().length <= 16" },
            "time": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() < 100000" }
          }
        }
      }
    }
  }
}
```

This allows **anyone** to read and write leaderboard entries, but rejects
malformed data (wrong shape, oversized names, absurd times). It's open by
design — there's no auth in this game — so treat the leaderboard as
informal and not abuse-proof. If it ever gets spammed, you can always wipe
a node from the Firebase console (Realtime Database → data view → delete).

Click **Publish**.

## 5. Plug the URL into the game
Open `index.html`, find this line (search for `FIREBASE_DB_URL`):

```js
const FIREBASE_DB_URL = "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com"; // <-- replace, or set to null
```

Replace it with your real database URL from step 3, no trailing slash:

```js
const FIREBASE_DB_URL = "https://red-cube-collector-default-rtdb.firebaseio.com";
```

Save, re-upload/host the file. Done — every player hitting that hosted
copy now shares the same global leaderboard.

## Fallback behavior (already built in)
- If `FIREBASE_DB_URL` is left as the placeholder, or a request fails
  (offline, misconfigured rules, etc.), the game automatically falls back
  to `window.storage` if running inside a Claude.ai artifact, or to
  `localStorage` if hosted standalone — so the leaderboard UI never breaks,
  it just becomes local-only instead of global.
- The leaderboard panel shows a small status line at the bottom
  (`connected — scores are global` / `backend unreachable...` / `no backend
  configured...`) so it's always clear which mode you're in.

## Costs
Realtime Database's free "Spark" tier covers this easily — leaderboard
entries are tiny (a name + a number, max 10 per mode/difficulty pair), and
read/write volume from a small audience won't come close to the free
quota.
