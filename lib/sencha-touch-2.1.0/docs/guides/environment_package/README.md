# Environment Detection

Commonly when building applications targeting mobile devices, you need to know specific information about the environment your application is running on. Perhaps the browser type, device name, or if specific functionality is available for use. The environment package in Sencha Touch gives you an easy API which allows you to find out all this information.

## Operating System

You can detect the operating system your application is running on using `Ext.os.name`. This will return one of the following values:

- iOS
- Android
- webOS
- BlackBerry
- RIMTablet
- MacOS
- Windows
- Linux
- Bada
- Other

You can also use the `Ext.os.is` singleton to check if the current OS mataches a certain operating system. For example, if you wanted to check if the current OS is Android, you could do:

    if (Ext.os.is.Android) {
        // ...
    }

You can do this will any of the above values:

    if (Ext.os.is.MacOS) {
        // ...
    }

You can also use it to detect if the device is an iPhone, iPad or iPod using `Ext.os.is`:

    if (Ext.os.is.iPad) {
        // ...
    }

The version of the OS can be also accessed using `Ext.os.version`:

    alert('You are running: ' + Ext.os.name + ', version ' + Ext.os.version.version);

## Browser

You can also find information about the browser you are running your application on by using `Ext.browser.name`. The list of available values are:

- Safari
- Chrome
- Opera
- Dolfin
- webOSBrowser
- ChromeMobile
- Firefox
- IE
- Other

You can also use `Ext.browser.is` to check if the current browser is one of the above values:

    if (Ext.browser.is.Chrome) {
        // ...
    }

The `Ext.browser.is` singleton also has other useful information about the current browser that may be useful for your application:

- `Ext.browser.userAgent` - returns the current userAgent
- `Ext.browser.isSecure` - returns true if the current page is using SSL
- `Ext.browser.isStrict` - returns true if the browser is in strict mode
- `Ext.browser.engineName` - returns the browser engine name (`WebKit`, `Gecko`, `Presto`, `Trident` and `Other`)
- `Ext.browser.engineVersion` - returns the version of the browser engine

## Features

You can use the {@link Ext.feature} singleton to check if a certain browser feature exists. For example, if you want to check if the browser supports canvas, you check do the following:

    if (Ext.feature.has.Canvas) {
        // ...
    }

The available *features* are:

- Ext.feature.has.Audio
- Ext.feature.has.Canvas
- Ext.feature.has.ClassList
- Ext.feature.has.CreateContextualFragment
- Ext.feature.has.Css3dTransforms
- Ext.feature.has.CssAnimations
- Ext.feature.has.CssTransforms
- Ext.feature.has.CssTransitions
- Ext.feature.has.DeviceMotion
- Ext.feature.has.Geolocation
- Ext.feature.has.History
- Ext.feature.has.Orientation
- Ext.feature.has.OrientationChange
- Ext.feature.has.Range
- Ext.feature.has.SqlDatabase
- Ext.feature.has.Svg
- Ext.feature.has.Touch
- Ext.feature.has.Video
- Ext.feature.has.Vml
- Ext.feature.has.WebSockets
