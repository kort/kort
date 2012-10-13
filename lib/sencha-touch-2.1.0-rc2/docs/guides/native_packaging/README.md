# Native Packaging for iOS and Android

This guide describes how to package a Sencha Touch app to run natively on iOS or Android devices using the Sencha Touch Native Packager tool.  

## Native app packaging general procedures

The app packaging process is very much the same whether you target iOS or Android devices. The main difference is that each environment requires you to complete a different prerequisite. Additionally, some of the details of creating the config file differ between the two environments.

Here are the basic steps for app packaging:

 - 1 **Provisioning.** For **iOS**, you first need to complete iOS provisioning on [Apple iOS provisioning portal][1] including certificates and devices set up through the provisioning portal and Xcode.  **Android** provisioning involves obtaining an appropriate Android ready certificate (debug or release) for signing the application.
 - 2 **Installation.** Install the packager, part of [Sencha SDK Tools 2.0](http://www.sencha.com/products/sdk-tools/)
 - 3 **Create config file.** Create a packaging configuration file to be used with the Native Packager.
 - 4 **Create package.** Run the packager to create a packaged `\<application\>.app` file for iOS or an `.apk` file for Android.
	
Each of these steps is detailed further in this guide, with special care given to detailing the differences between iOS and Android packaging procedures.

### Required software

Before you begin, make sure your computer is running the following:

- **iOS packaging**: Mac OS X 10.6+ or Windows Vista+ and Xcode
- **Android packaging**: [Android SDK Tools](http://developer.android.com/sdk/index.html) (Revision 16+) and [Eclipse](http://www.eclipse.org/) (optional).

## Step 1: Provisioning

Provisioning differs between the two environments, as follows:

**iOS:** Refer to the [Native iOS Provisioning Guide](#!/guide/native_provisioning) and use the [Apple iOS provisioning portal][1] to set up the appropriate development and distribution certifications and profiles. Create an App ID and finish provisioning your application. You need your App ID and App Name to complete the packaging process. Refer to the How-To section in the [Apple iOS provisioning portal][1] for help.

**Android:** The Android Keytool included in the Android SDK tools is one way of creating certificate for signing Android applications. Below is an example of a Keytool command that generates a private key:

    $ keytool -genkey -v -keystore my-release-key.keystore -alias alias_name
        -keyalg RSA -keysize 2048 -validity 10000

See the Android developers guide [Signing Your Applications](http://developer.android.com/tools/publishing/app-signing.html) for more information about creating certificates and signing applications.

## Step 2: Install the packager

  - Run the [Sencha SDK Tools][5] installation: SenchaSDKTools (SenchaSDKTools-2.0.0-Beta)
  - The `sencha` command that includes the package option will be installed to the specified location during installation (default: Applications/SenchaSDKTools-2.0.0-Beta/command). 

## Step 3: Create a packaging configuration file

Create a configuration file template by running the following command in the Terminal:

    sencha package generate <configTemplate.json>

`<configTemplate.json>` is the name of the configuration file. It cannot contain any spaces.

The configuration file should have the following format. Parameters unique to **iOS** or **Android** are noted. Note that the parameters do not have to follow any particular order in an actual config file.

    {
        "applicationName": "<AppName>",
        "applicationId": "<AppID>",
        "bundleSeedId": "<String>", (iOS only)
        "versionString": "<AppVersion>",
        "versionCode": "<BuildNumber>", (Android only)
        "icon": "<Object>",
        "inputPath": "<AppPackageInputPath>",
        "outputPath": "<AppPackageOutputPath>",
        "rawConfig": "<Info.plistKeys>", (iOS only)
        "configuration": "<Release | Debug>",
        "notificationConfiguration": "<Release | Debug>", (iOS only; optional)
        "platform": "<iOSSimulator | iOS | Android | AndroidEmulator>",
        "deviceType": "<iPhone | iPad | Universal>", (iOS only)
        "certificatePath": "<CertificateLocation>",
        "certificateAlias": "<CertificateAlias>", (Optional)
        "certificatePassword": "<Password>", (Optional)
        "permissions": "<ApplicationPermissions>" (Android only)
        "sdkPath": "<SDKLocation>", (Android only)
        "androidAPILevel": "<VersionNumber>", (Android only)
        "minOSVersion": "<VersionNumber>", (iOS only)
        "orientations": "<Direction>"
    }

The rest of this section provides details about each parameter, noting environment-specific settings.

### `applicationName`

The name of your application, which a device displays to the user after the app is installed. 

**iOS:** The application name should match the name provided in the [iOS Provisioning Portal][1], in the App IDs section. Here's an example iOS App ID, showing both the name and the ID:

{@img idScreen.png App ID}

This example uses the following:

  - AppName: Sencha Touch 2 Packaging
  - AppID: com.Sencha.Touch2Packaging

*Note.* the App ID is the same as the one you put in the Identifier field in Xcode.

**Android:** The output file will have the name \<AppName\>.apk.

### `applicationId`
	
The ID for your app. It's suggested that you use a nameSpace for your app, such as `com.sencha.Touch2Package`, as shown in the example above. For iOS, this can also be found in the provisioning portal.

### `bundleSeedId` (iOS only)
	
This is the ten character string in front of the iOS application ID obtained from the [iOS Provisioning Portal][1]. In the example shown above under `applicationName`, it's `H8A8ADYR7H`.

### `versionString`
	
This is the version number of your application. Usually it takes a string such as `1.0`.

### `versionCode` (Android only)

The build number of an Android app, also called the integer version code.

### `icon`

The icon displayed to the user along with your app name.

**iOS:** Specifies the icon file to be used for your application. Retina icon should be specified with `@2x` at the end of the icon name. A regular icon name looks like `icon.png`, while a retina icon looks like `(regular) andicon@2x.png`. If a retina icon with the `@2x.png` exists, the packager includes the retina icon. Should also specify target device for app, as follows:

    "icon": {
        "57": "resources/icons/Icon.png",
        "72": "resources/icons/Icon~ipad.png",
        "114": "resources/icons/Icon@2x.png",
        "144": "resources/icons/Icon~ipad@2x.png"
    }

Refer to the [Apple documentation](https://developer.apple.com/library/ios/#documentation/userexperience/conceptual/mobilehig/IconsImages/IconsImages.html) for specific information about icon sizes.

**Android:** Specifies the launcher icon file to be used for your application. Refer to the [Android Launcher Icons guide](http://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher.html) for more information.

### `inputPath`

This is location of your Sencha Touch 2 application, relative to the configuration file.

### `outputPath`

This is the output location of the packaged application, that is where the built application file will be saved.

### `rawConfig` (iOS only)

"Raw" keys that can be included with `info.plist` configuration with iOS apps. `info.plist` is the name of an information property list file, a structure text file with configuration information for a bundled executable. See [Information Property List Files](https://developer.apple.com/library/ios/#documentation/MacOSX/Conceptual/BPRuntimeConfig/Articles/ConfigFiles.html) in the iOS Developer Library for more information.

### `configuration`

Indicates whether you are building the debug or release configuration of your application. `Debug` should be used unless you are submitting your app to an online store, in which case `Release` should be specified.

### `notificationConfiguration` (iOS only)

Optional for apps that use push notifications. `Debug` should be used unless you are submitting your app to an online store, in which case `Release` should be specified. If app doesn't use push notifications, leave blank or remove parameter.

### `platform`

Indicate the platform on which your application will run.

- **iOS:** Options are `iOSSimulator` or `iOS`.
- **Android:** Options are `Android` or `AndroidEmulator`.

### `deviceType` (iOS only)

Indicates the iOS device type that your application will run on. Available options are:

 - iPhone
 - iPad
 - Universal

### `certificatePath`

This is the location of your certificate. This is required when you are developing for Android or you are developing on Windows.

### `certificateAlias` (Optional)

Indicates the name of your certificate. It this is not specified when developing on OSX, the packaging tool automatically tries to find the certificate using the applicationId. 

Can be just a simple matcher. For example, if your certificate name is "iPhone Developer: Robert Dougan (ABCDEFGHIJ)", you can just enter `iPhone Developer`.

Not required when using a `certificatePath` on Windows.

### `certificatePassword` (Optional)

Use only if password was specified when generating certificate for release build of Android (iOS or Windows) or any iOS build on Windows. Indicates password set for certificate. If no password set, leave blank or eliminate parameter.

### `permissions` (Android only)

Array of permissions to use services called from an Android app, including coarse location, fine location, information about networks, the camera, and so on. See the [complete list](http://developer.android.com/reference/android/Manifest.permission.html) of permissions for Android app services.

### `sdkPath` (Android only)

Indicates the path to the Android SDK.


### `androidAPILevel` (Android only)

Indicates the Android API level, the version of Android SDK to use. For more information, see [What is API Level](http://developer.android.com/guide/appendix/api-levels.html) in the Android SDK documentation. Be sure to install the corresponding platform API in the Android SDK manager (*android_sdk/tools/android*). 

### `minOSVersion` (iOS only)

Indicates number of lowest iOS version required for app to run. 

### `orientations`

Indicates the device orientations in which the application can run. Options are:

- portrait
- landscapeLeft
- landscapeRight
- portraitUpsideDown

*Note.* If this omitted, default orientations setting is all four orientations.

## Sample iOS config file

The following is an example iOS config file.

    {
        "applicationName": "SenchaAPI",
        "applicationId": "com.sencha.api",
        "outputPath": "~/stbuild/app/",
        "versionString": "1.2",
        "inputPath": "~/stbuild/webapp",
        "icon": {
            "57": "resources/icons/Icon.png",
            "72": "resources/icons/Icon~ipad.png",
            "114": "resources/icons/Icon@2x.png",
            "144": "resources/icons/Icon~ipad@2x.png"
        },
        "rawConfig": "<key>UIPrerenderedIcon</key><true/>",
        "configuration": "debug",
        "notificationConfiguration": "debug",
        "platform": "iOS",
        "deviceType": "iPhone",
        "certificatePath": "stbuild.keystore",
        "certificateAlias": "iPhone Developer",
        "certificatePassword": "stbuild",
        "minOSVersion": "4.0",
        "bundleSeedId": "KPXFEPZ6EF",
        "orientations": [
            "portrait",
            "landscapeLeft",
            "landscapeRight",
            "portraitUpsideDown"
        ]
    }

## Sample Android config file

The following is an example Android config file.

    {
        "applicationName": "SenchaAPI",
        "applicationId": "com.sencha.api",
        "outputPath": "~/stbuild/app/",
        "versionString": "1.2",
        "versionCode": "12",
        "inputPath": "~/stbuild/webapp",
        "icon": {
            "57": "resources/icons/Icon.png",
            "72": "resources/icons/Icon~ipad.png",
            "114": "resources/icons/Icon@2x.png",
            "144": "resources/icons/Icon~ipad@2x.png"
        },
        "configuration": "debug",
        "platform": "android",
        "certificatePath": "stbuild.keystore",
        "certificateAlias": "Android Developer",
        "certificatePassword": "stbuild",
        "permissions": [
            "INTERNET",
            "ACCESS_NETWORK_STATE",
            "CAMERA",
            "VIBRATE",
            "ACCESS_FINE_LOCATION",
            "ACCESS_COARSE_LOCATION",
            "CALL_PHONE"
        ],
        "sdkPath": "/android_sdk-mac_86/",
        "androidAPILevel": "7",
        "orientations": [
            "portrait",
            "landscapeLeft",
            "landscapeRight",
            "portraitUpsideDown"
        ]
    }


## Step 4: Run the packager to create the packaged application

After creating the config file, the next step is to package the app. Here are the procedures for packaging both debug and release versions of an app for both iOS and Android.

### iOS: Package a debug application 

The appropriate `platform` and `configuration` settings need to be made in the config file, for example:

    platform: iOSSimulator
    configuration: Debug

If `platform` and `configuration` are not set, the packaged app will not run correctly.

With these configs set properly, issue the following command in Terminal:

    sencha package run <configFile.json>

In this example, which targets the iOS Simulator in the `platform` config parameter, successful completion of the `package` command launches the iOS simulator with the application running natively. Note that the `deviceType` identifier  -- `iPhone` or `iPad` -- has to be set properly to trigger the appropriate simulator.

### iOS: Package a release application 

To package a signed application to run on the device, issue the following command in the terminal:

    sencha package <configFile.json>

*Note.* an `<AppName.app>` is created in the specified output location. This is the application that you can use to deploy to the iOS device.

### Android: Package a debug application and run it on Android Emulator

The appropriate `platform` and `configuration` settings need to be made in the config file, for example:

    platform: AndroidEmulator
    configuration: Debug

If `platform` and `configuration` are not set, the packaged app will not run correctly.

With these configs set properly, start the Android Emulator and issue the following command:
    
    sencha package run <configFile.json>

In this example, which targets the Android Emulator in the `platform` config parameter, successful completion of the `package` command launches the app in the already running emulator. If `package` is successful, an `.apk` is available in the application output location for you to manually test on an Android Emulator or a device.

More information about the Android Emulator can be found in [Android Developer Guide: Using the Android Emulator](http://developer.android.com/tools/devices/emulator.html).

### Android: Package an application for distribution

To package a signed application to run on the device, issue the following command:

    sencha package <configFile.json>

An `<AppName.apk>` is created in the specified output location. This is the application that you can use to release for distribution.

## Additional resources

### iOS resources

  1. [Native iOS Provisioning](#!/guide/native_provisioning)
  2. [Apple iOS provisioning portal][1]
  2. [iOS Icon guideline][4]

### Android resources

  1. [Signing Your Applications](http://developer.android.com/tools/publishing/app-signing.html)
  2. [Installing the ADT Plugin for Eclipse](http://developer.android.com/tools/sdk/eclipse-adt.html)
  3. [Eclipse](http://www.eclipse.org/)
  4. [Managing Virtual Devices for Android Emulator](http://developer.android.com/tools/publishing/app-signing.html), "Setting up Virtual Devices".

[1]: https://developer.apple.com/ios/manage/overview/index.action
[3]: http://developer.apple.com/library/ios/%23documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/BuildTimeConfiguration/BuildTimeConfiguration.html%23//apple_ref/doc/uid/TP40007072-CH7-SW1
[4]: http://developer.apple.com/library/ios/%23documentation/userexperience/conceptual/mobilehig/IconsImages/IconsImages.html
[5]: http://www.sencha.com/products/sdk-tools/
