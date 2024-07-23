android.enableJetifier=true

cd android &&
./gradlew assembleRelease &&

---

jarsigner -keystore /Users/feliperamirez/upload.jks -storepass password /Users/feliperamirez/Projects/POS_APP/android/app/build/outputs/apk/release/app-release-unsigned.apk upload

&&

/Users/feliperamirez/Library/Android/sdk/build-tools/34.0.0/zipalign 4 /Users/feliperamirez/Projects/POS_APP/android/app/build/outputs/apk/release/app-release-unsigned.apk /Users/feliperamirez/Projects/POS_APP/android/app/build/outputs/apk/release/app-release-signed.apk
