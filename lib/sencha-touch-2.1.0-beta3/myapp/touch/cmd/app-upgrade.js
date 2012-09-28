importPackage(java.lang);
importPackage(java.io);
importPackage(javax.script);
importPackage(com.sencha.util);
importPackage(com.sencha.util.filters);
importPackage(com.sencha.logging);
importPackage(com.sencha.exceptions);

var _logger = SenchaLogManager.getLogger("app-build");

function resolvePath() {
    return new File(joinPath.apply(this, arguments)).getAbsolutePath();
}

function joinPath() {
    var len = arguments.length, i, paths = [];
    for (i = 0; i < len; i++) {
        if (_logger.isTraceEnabled()) {
            _logger.trace("adding path arg : {}", arguments[i]);
        }
        paths.push(arguments[i]);
    }
    return paths.join(File.separator);
}

function copyFiles(proj, dir, todir, includes, excludes) {
    var task = proj.createTask("copy"),
        fileset = proj.createDataType('fileset');

    fileset.setDir(new File(dir));
    if(includes) {
        fileset.setIncludes(includes);
    }

    if(excludes) {
        fileset.setExcludes(excludes);
    }

    task.setTodir(new File(todir));
    task.addFileset(fileset);
    task.execute();
}

function moveFiles(proj, from, to, includes, excludes) {
    var task = proj.createTask("move"),
        fileset = proj.createDataType('fileset');

    fileset.setDir(new File(from));
    if(includes) {
        fileset.setIncludes(includes);
    }

    if(excludes) {
        fileset.setExcludes(excludes);
    }

    task.setTodir(new File(to));
    task.addFileset(fileset);
    task.execute();
}

function moveFile(proj, from, to) {
    var task = proj.createTask("move");
    task.setTofile(new File(to));
    task.setFile(new File(from));
    task.execute();
}

function runAppUpgrade(proj) {
    var basedir = proj.getProperty("basedir"),
        appPath = proj.getProperty("args.path"),
        sdkPath = resolvePath(basedir, '..'),
        appSdkFile = resolvePath(appPath, '.senchasdk'),
        appSdkPtr =  FileUtil.readFile(resolvePath(appSdkFile)).trim(),
        appSdkPath = resolvePath(appPath, appSdkPtr),
        newSdkVersion = FileUtil.readFile(resolvePath(sdkPath, 'version.txt')).trim(),
        oldSdkVersion = FileUtil.readFile(resolvePath(appSdkPath, "version.txt")).trim(),
        backupPath = resolvePath(appSdkPath + StringUtil.formatString('-%s-backup', oldSdkVersion));

    _logger.debug("sdk: {} app: {}", sdkPath, appSdkPath);

    if(newSdkVersion == oldSdkVersion) {
        _logger.info(
            "This SDK (version {}) is identical to the application's SDK, nothing to upgrade.",
            newSdkVersion);
        return;
    }

    _logger.info(
        "Upgrading your application from SDK version '{}' to version '{}'",
        oldSdkVersion,
        newSdkVersion);

    _logger.debug("Backing up application sdk from {} to {}",
        appSdkPath,
        backupPath);

    moveFiles(proj, appSdkPath, backupPath);

    _logger.info("Renamed {} to {} for backup", appSdkPath, backupPath);

    copyFiles(proj, sdkPath, appSdkPath, [
        "src/**/*",
        'resources/**/*',
        'command/**/*',
        'microloader/**/*',
        'version.txt',
        '.sencha*',
        'implicitClassDependencies',
        'sencha-touch-debug.js',
        'sencha-touch-all-debug.js'
    ].join(','));

    moveFile(proj,
        resolvePath(appSdkPath, 'sencha-touch-all-debug.js'),
        resolvePath(appSdkPath, 'sencha-touch-all.js'));

    moveFile(proj,
        resolvePath(appSdkPath, 'sencha-touch-debug.js'),
        resolvePath(appSdkPath, 'sencha-touch.js'));

    _logger.info(
        "Your application has successfully been upgraded. To revert this operation, simply remove '{}' and rename '{}' back to '{}'",
        [
            appSdkPath,
            backupPath,
            appSdkPath
        ]);

}

(function (proj) {
    try {
        _logger.info("building application");
        runAppUpgrade(proj);
    } catch (err) {
        _logger.error("Exception running app build : " + err);
        throw err;
    }
})(project);