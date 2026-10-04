# Signing and releasing the Android app

Releases are built and signed by `.github/workflows/android.yml` on every push to `master`,
then uploaded to the Play Console **internal** track. Promote to production from the Play Console.

## Repository secrets

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | `base64 -i upload.jks` (the upload key) |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias (`upload`) |
| `ANDROID_KEY_PASSWORD` | Key password |
| `PLAY_SERVICE_ACCOUNT_JSON` | JSON key of a Google Cloud service account invited to the Play Console with release rights |

Repository variable `API_URL`: the deployed API, with a trailing slash (e.g. `https://pos-nest.vercel.app/`).

## Building a signed bundle locally

```bash
npx ng build --configuration production && npx cap sync android
cd android
ANDROID_KEYSTORE_PATH=~/upload.jks \
ANDROID_KEYSTORE_PASSWORD=... ANDROID_KEY_ALIAS=upload ANDROID_KEY_PASSWORD=... \
VERSION_CODE=<higher than the last upload> \
./gradlew bundleRelease
```

Without `ANDROID_KEYSTORE_PATH` the release build comes out unsigned.

`android.enableJetifier=true` stays in `android/gradle.properties`.
