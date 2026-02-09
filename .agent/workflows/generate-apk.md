---
description: How to generate an APK for the Expo project using EAS Build
---

To create an APK (Android Package) for your Expo app, follow these steps. 

### Prerequisites
1.  **Expo Account**: You must have an account at [expo.dev](https://expo.dev).
2.  **EAS CLI**: Install the EAS Command Line Interface.
    ```bash
    npm install -g eas-cli
    ```

### Step 1: Login to Expo
Run this command and follow the prompts to log in:
```bash
eas login
```

### Step 2: Initialize EAS Build
Initialize your project with EAS:
```bash
eas build:configure
```
*When asked "Which platforms would you like to configure?", select **Android**.*

### Step 3: Configure for APK Output
By default, Expo builds an **AAB** (Android App Bundle) for the Play Store. To get an **APK** you can install directly, you must modify `eas.json`.

Update your `eas.json` (or create it if it doesn't exist) with this configuration:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### Step 4: Run the Build
Run the following command to start the build on Expo's servers:
```bash
eas build -p android --profile preview
```

### Step 5: Download the APK
Once the build is complete, EAS will provide a link in your terminal to download the `.apk` file. You can also find it in your dashboard at [expo.dev](https://expo.dev).
