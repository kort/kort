importPackage(java.lang);
importPackage(java.io);
importPackage(javax.script);
importPackage(com.sencha.util);
importPackage(com.sencha.util.filters);
importPackage(com.sencha.logging);
importPackage(com.sencha.exceptions);
importPackage(com.sencha.command);
importPackage(com.sencha.tools.compressors.yui);
importPackage(com.sencha.tools.compressors.closure);
importPackage(com.sencha.tools.external);
importPackage(com.sencha.tools.compiler.jsb.statements);

var _logger = SenchaLogManager.getLogger("app-build");

var JSON = new (function () {
    var useHasOwn = !!{}.hasOwnProperty,
        pad = function (n) {
            return n < 10 ? "0" + n : n;
        },
        doDecode = function (json) {
            return eval("(" + json + ')');
        },
        doEncode = function (o) {
            if (typeof o == 'undefined' || o === null) {
                return "null";
            } else if (Object.prototype.toString.call(o) === '[object Array]') {
                return encodeArray(o);
            } else if (Object.prototype.toString.call(o) === '[object Date]') {
                return JSON.encodeDate(o);
            } else if (typeof o == 'string') {
                return encodeString(o);
            } else if (typeof o == 'number') {
                //don't use isNumber here, since finite checks happen inside isNumber
                return isFinite(o) ? String(o) : "null";
            } else if (typeof o == 'boolean') {
                return String(o);
            } else if (typeof o == 'object') {
                return encodeObject(o);
            } else if (typeof o === "function") {
                return encodeString(o.toString());
            }
            return 'undefined';
        },
        m = {
            "\b":'\\b',
            "\t":'\\t',
            "\n":'\\n',
            "\f":'\\f',
            "\r":'\\r',
            '"':'\\"',
            "\\":'\\\\',
            '\x0b':'\\u000b' //ie doesn't handle \v
        },
        charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g,
        encodeString = function (s) {
            return '"' + s.replace(charToReplace, function (a) {
                var c = m[a];
                return (typeof c === 'string') ? c : ('\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4));
            }) + '"';
        },
        encodeArray = function (o) {
            var a = ["[", ""],
            // Note empty string in case there are no serializable members.
                len = o.length,
                i;
            for (i = 0; i < len; i += 1) {
                a.push(doEncode(o[i]), ',');
            }
            // Overwrite trailing comma (or empty string)
            a[a.length - 1] = ']';
            return a.join("");
        },
        encodeObject = function (o) {
            var a = ["{", ""],
            // Note empty string in case there are no serializable members.
                i;
            for (i in o) {
                if (typeof o[i] != 'function' && (!useHasOwn ||( o.hasOwnProperty && o.hasOwnProperty(i)))) {
                    a.push(doEncode(i), ":", doEncode(o[i]), ',');
                }
            }
            // Overwrite trailing comma (or empty string)
            a[a.length - 1] = '}';
            return a.join("");
        };

    this.encodeDate = function (o) {
        return '"' + o.getFullYear() + "-"
            + pad(o.getMonth() + 1) + "-"
            + pad(o.getDate()) + "T"
            + pad(o.getHours()) + ":"
            + pad(o.getMinutes()) + ":"
            + pad(o.getSeconds()) + '"';
    };

    this.encode = doEncode;
    this.decode = doDecode;

})();

function readConfig(configFile) {
    _logger.trace("reading config data from {}", configFile);
    // ensure the data is a javascript string
    var configData = '' + readFileContent(configFile);
    return jsonDecode(configData);
}

function jsonDecode(data) {
    _logger.trace("decoding json data");
    return JSON.decode(data);
}

function jsonEncode(obj) {
    _logger.debug("encoding json data");
    return JSON.encode(obj);
}

function map(list, func) {
    var out = [],
        len = list.length,
        i;
    for (i = 0; i < len; i++) {
        out.push(func(list[i]));
    }
    return out;
}

function each(list, func) {
    var len = list.length,
        i;
    for (i = 0; i < len; i++) {
        func(list[i]);
    }
    return list;
}

function filter(list, func) {
    var newlist = [],
        len = list.length,
        i, item;
    for (i = 0; i < len; i++) {
        item = list[i];
        if (func(item)) {
            newlist.push(item);
        }
    }
    return newlist;
}

function concat(list1, list2) {
    var newlist = [],
        func = function (item) {
            newlist.push(item);
        };
    each(list1, func);
    each(list2, func);
    return newlist;
}

function resolvePath() {
    return new File(joinPath.apply(this, arguments)).getCanonicalPath();
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

function stripSpecialDirNames(path) {
    return path
        .replace("../", "")
        .replace("..\\", "")
        .replace("./", "")
        .replace(".\\", "")
        .replace("~/", "");
}

function readFileContent(file) {
    return FileUtil.readFile(file);
}

function writeFileContent(file, content) {
    FileUtil.writeFile(file, content);
}

function copy(src, dest, filter) {
    if(filter) {
        FileUtil.copy(src, dest, filter);
    } else {
        FileUtil.copy(src, dest);
    }
}

function runAppBuild(proj) {
    var basedir = proj.getProperty("basedir"),
        appPath = proj.getProperty("args.path"),
        envArg = proj.getProperty("args.environment"),
        config = readConfig(resolvePath(appPath, "app.json")),
        environment = (envArg == "native") ? 'package' : envArg,
        destination = proj.getProperty("args.destination") || config.buildPaths[environment],
        v2deps = !!(proj.getProperty("v2deps") == "true"),
        src = appPath,
        sdk = proj.getProperty("framework.dir"),
        archive = proj.getProperty("args.archive") || config.archive || "archive",
        nativePackaging = !!(envArg == 'native'),
        indexHtmlPath = config.indexHtmlPath || 'index.html',
        appUrl = config.url || resolvePath(src, indexHtmlPath),
        jsAssets = config.js || [],
        cssAssets = config.css || [],
        appCache = config.appCache,
        ignore = config.ignore,
        remoteAssets = [],
        extras = config.extras || config.resources,
        appJs, assets, processIndex;

    destination = joinPath(destination, environment);

    if (appUrl.indexOf("file:") != 0 && appUrl.indexOf("http:") != 0) {
        appUrl = 'file:///' + StringUtil.replace(resolvePath(appUrl), '\\', '/');
    }

    // check for build dir being immediate child of application dir
    // native packager can get in to infinite looping when scanning files
    // under this scenario
    var canonicalAppPath = new File(appPath).getCanonicalPath(),
        canonicalDestPath = new File(destination).getCanonicalPath(),
        parent = new File(canonicalDestPath).getParentFile();

    if(parent && parent.getCanonicalPath() == canonicalAppPath) {
        _logger.error("Application : {}", canonicalAppPath);
        _logger.error("Destination : {}", canonicalDestPath);
        _logger.error("Destination path cannot reside one level under the Application directory")
        throw "Destination path cannot reside one level under the Application directory";
    }


    _logger.info("Deploying your application to " + destination);

    PathUtil.ensurePathExists(resolvePath(destination));

    jsAssets = each(
        map(jsAssets, function (asset) {
            if (typeof asset == 'string') {
                asset = { path:asset };
            }
            asset.type = 'js';
            return asset;
        }),
        function (jsAsset) {
            if (jsAsset.bundle) {
                appJs = jsAsset.path;
            }
        });

    if (!appJs) {
        appJs = 'app.js';
    }

    appJs = resolvePath(destination, appJs);

    cssAssets = map(cssAssets, function (asset) {
        if (typeof asset == 'string') {
            asset = { path:asset };
        }
        asset.type = 'css';
        return asset;
    });

    assets = filter(concat(jsAssets, cssAssets), function (asset) {
        return !asset.shared || (environment != 'production');
    });

    _logger.debug("copying all assets");
    each(assets, function (asset) {
        if (asset.remote) {
            asset.bundle = false;
            asset.update = false;
            remoteAssets.push(asset);
        } else {
            file = asset.path;

            // if not in testing mode, and using the new compiler, and this is
            // one of the sencha-touch files, don't copy to output directory
            if(environment != 'testing' &&
                !v2deps &&
                file.indexOf("sencha-touch") != -1) {
                asset.skipFrameworkFile = true;
                return;
            }

            _logger.debug("copying file {}", resolvePath(src, file));

            PathUtil.ensurePathExists(joinPath(destination, file));

            var srcPath = resolvePath(src, file),
                dstPath = resolvePath(destination, file);

            if(srcPath != dstPath) {
                copy(resolvePath(src, file), resolvePath(destination, file));

                _logger.info("Copied {}", file);
            }
        }
    });

    var ignoreFilter = Filter.getFileNameFilter(
        new RegexFilter(ignore).setInclusive(false));

    _logger.debug("copying all extras");
    each(extras, function (extra) {
        var from = resolvePath(src, extra),
            to = resolvePath(destination, extra);
        _logger.debug("copying from {} to {}", from, to);
        if (new File(from).exists()) {
            copy(from, to, ignoreFilter);
            _logger.info("Copied {}", from);
        }
    });

    // build the app

    processIndex = function () {
        _logger.debug("processing page : index.html");
        jsAssets = filter(jsAssets, function(asset){
            return !asset.skipFrameworkFile;
        });

        var appJson = jsonEncode({
                id:config.id,
                js:jsAssets,
                css:cssAssets
            }),
            indexHtml, content, compressor, remotes, microloader;

        writeFileContent(new File(destination, 'app.json'), appJson);
        _logger.info("Generated app.json");

        indexHtml = readFileContent(new File(src, indexHtmlPath));

        if (environment == 'production' && appCache) {
            indexHtml = StringUtil.replace(
                indexHtml,
                '<html manifest=""',
                '<html manifest="cache.appcache"');
        }

        compressor = new ClosureCompressor();
        microloader = (environment == 'production'
            ? 'production'
            : 'testing') +
            '.js';
        _logger.debug("using microloader : {}", microloader);
        content = readFileContent(joinPath(sdk, "microloader", microloader));
        content = compressor.compress(content);
        remotes = [
            '<script type="text/javascript">' +
                content + ';Ext.blink(' +
                (environment == 'production' ? jsonEncode({
                    id:config.id
                }) : appJson) + ')' +
                '</script>'
        ];

        each(remoteAssets, function (asset) {
            var uri = asset.path;

            if (asset.type === 'js') {
                remotes.push(
                    '<script type="text/javascript" src="' +
                        uri +
                        '"></script>');
            } else if (asset.type === 'css') {
                remotes.push(
                    '<link rel="stylesheet" type="text/css" href="' +
                        uri +
                        '" />');
            }
        });

        indexHtml = ('' + indexHtml).replace(
            /<script id="microloader"([^<]+)<\/script>/,
            remotes.join(''));

        _logger.debug("generating new built index.html");
        writeFileContent(resolvePath(destination, indexHtmlPath), indexHtml);
        _logger.info("Embedded microloader into " + indexHtmlPath);
    };

    _logger.info("Resolving your application dependencies (" + appUrl + ")");

    var preprocessor = new Parser(),
        jsCompressor = new YuiJavascriptCompressor(),
        cssCompressor = new YuiCssCompressor(),
        phantomRunner = new PhantomJsRunner(),
        processedAssetCount = 0,
        assetsCount, dependencies, files, file,
        destinationFile, compressor;

    if(v2deps) {
        // if v2deps, use the sencha command 2 sytle dependency resolution mechanism
        // by running the phantomjs dependencies.js script
        var phantomOut = phantomRunner.run([
                resolvePath(basedir, "dependencies.js"),
                appUrl
            ]),
            exitCode = phantomOut.getExitCode(),
            stdout = phantomOut.getOutput(),
            buffer = new StringBuilder();


        if (exitCode > 0) {
            _logger.error("dependencies.js exited with non-zero code : " + exitCode);
            _logger.error(stdout);
            throw new ExBuild("failed gathering dependencies").raise();
        }
        dependencies = jsonDecode(stdout);

        _logger.info("Found " + dependencies.length + " dependencies. Concatenating all into '" + appJs + "'");

        files = map(dependencies, function (dependency) {
            return resolvePath(src, dependency.path);
        });

        files.push(appJs);

        each(files, function (file) {
            buffer.append(FileUtil.readUnicodeFile(resolvePath(file))).append('\n');
        });

        writeFileContent(appJs, buffer.toString());

        // clear the buffer to free memory
        buffer.setLength(0);
    } else {
        // else, use the sencha command 3 compiler to resolve application dependencies
        var ignores="src/locale,src/platform,auth2/Auth.js,scroller/Infinite.js,",
            args = [
                'compile',
                '--ignore=' + ignores,
                '--options=debug:false,logger:no,minVersion:3',
                'union',
                '--recursive',
                '--file=app.js',
                'and',
                'concatenate',
                '-out=' + appJs
            ],
            compiler = new Sencha();

        _logger.info("Compiling app.js and dependencies");
        _logger.debug("running compiler with options : '{}'", args.join(' '));
        compiler.dispatch(args);
        _logger.info("Completed compilation.")
    }


    for (name in config.buildOptions) {
        if (config.buildOptions.hasOwnProperty(name)) {
            preprocessor.setParam(name, config.buildOptions[name]);
        }
    }

    assetsCount = assets.length;

    each(assets, function (asset) {
        file = asset.path;
        destinationFile = resolvePath(destination, file);

        var cleanFile = stripSpecialDirNames(file),
            cleanDestinationFile = resolvePath(destination, cleanFile);

        // adjust the asset path to use the cleaned filename
        asset.path = cleanFile;

        _logger.debug("Assets => Processed : {} Total : {}",
            processedAssetCount, assetsCount);

        if (asset.type == 'js') {
            if (!asset.remote && !asset.skipFrameworkFile) {
                writeFileContent(
                    cleanDestinationFile,
                    preprocessor.parse(readFileContent(destinationFile)));
                _logger.info('Processed local file ' + file);
            } else {
                _logger.info('Processed remote file ' + file);
            }
        }

        if (environment == 'testing') {
            return;
        }

        if (asset.remote || asset.skipFrameworkFile) {
            ++processedAssetCount;
        } else {
            _logger.debug("Minifying " + file);

            compressor = (asset.type == 'js')
                ? jsCompressor
                : cssCompressor;

            writeFileContent(
                cleanDestinationFile,
                compressor.compress(readFileContent(cleanDestinationFile)));

            _logger.info("Minified " + file);

            if (environment == 'production') {
                var content = readFileContent(cleanDestinationFile),
                    version = '' + FileUtil.createChecksum(content);
                asset.version = version;

                _logger.debug("prepending checksum on {}", cleanDestinationFile);
                writeFileContent(
                    cleanDestinationFile,
                    "/*" + version  + "*/" + content);
                content = "";

                _logger.debug("copying destination to archive");

                PathUtil.ensurePathExists(resolvePath(archive, cleanFile, version));
                copy(cleanDestinationFile, resolvePath(archive, cleanFile, version));

                if (asset.update == 'delta') {
                    // generate all the deltas to the other archived versions
                    _logger.debug("generating file deltas");
                    var archivedVersions = new File(joinPath(archive, cleanFile))
                        .listFiles();

                    each(archivedVersions, function (archivedVersion) {
                        archivedVersion = archivedVersion.name;

                        if (archivedVersion == version) {
                            return;
                        }

                        var deltaFile = joinPath(
                            destination,
                            'deltas',
                            cleanFile,
                            archivedVersion + '.json');

                        writeFileContent(deltaFile, '');

                        _logger.debug("Generating delta from {} to {}",
                            archivedVersion,
                            version);

                        var runner = new VcDiffRunner(),
                            args = [
                                'encode',
                                '-json',
                                '-dictionary',
                                joinPath(archive, cleanFile, archivedVersion),
                                '-target',
                                cleanDestinationFile,
                                '-delta',
                                resolvePath(deltaFile),
                                '--stats'
                            ],
                            runnerOut = runner.run(args),
                            exitCode = runnerOut.getExitCode(),
                            stdout = runnerOut.getOutput();

                        if (exitCode > 0) {
                            _logger.error("failed generating diff from {} to {}",
                                archivedVersion,
                                version);
                            _logger.error(stdout);
                            throw new ExBuild("failed generating diff from {0} to {1}",
                                archivedVersion,
                                version).raise();
                        }
                        _logger.info(
                            "Generated delta for: {} from hash: '{}' to hash: '{}'",
                            [cleanFile, archivedVersion, version]);
                    });

                }
            }

            if (++processedAssetCount == assetsCount) {
                _logger.debug("processed all assets, finalizing build...");
                processIndex();

                if (environment == 'production' && appCache) {
                    _logger.info("Generating appcache");
                    appCache.cache = map(appCache.cache, function (cache) {
                        var checksum = '';

                        if (!/^(\/|(.*):\/\/)/.test(cache)) {
                            _logger.info(
                                "Generating checksum for appCache item: {}",
                                cache);

                            checksum = FileUtil.createChecksum(
                                readFileContent(joinPath(destination, cache)));
                        }

                        return {
                            uri:cache,
                            checksum:checksum
                        }
                    });

                    writeAppCache(appCache, joinPath(destination, 'cache.appcache'));
                }

                if (nativePackaging) {
                    _logger.debug("generating native package");
                    var packagerJson = readFileContent(
                            joinPath(src, 'packager.json')),
                        packagerConfig = jsonDecode(packagerJson);

                    if (packagerConfig.platform.match(/iOS/)) {
                        copy(
                            resolvePath(joinPath(src, 'resources', 'icons')),
                            resolvePath(destination),
                            ignoreFilter);
                        copy(
                            resolvePath(joinPath(src, 'resources', 'loading')),
                            resolvePath(destination),
                            ignoreFilter);
                    }

                    // add '' here to coerce to javascript string instead of java string
                    // for json encoding later...
                    packagerConfig.inputPath = destination + '';
                    packagerConfig.outputPath = resolvePath(config.buildPaths['native']) + '';

                    PathUtil.ensurePathExists(packagerConfig.outputPath);

                    writeFileContent(
                        joinPath(src, 'packager.temp.json'),
                        jsonEncode(packagerConfig));

                    _logger.info("Packaging your application as a native app...");

                    var stbuildRunner = new StBuildRunner(),
                        args = ['run', resolvePath(src, 'packager.temp.json')],
                        stbuildOut = stbuildRunner.run(args),
                        exitCode = stbuildOut.getExitCode(),
                        stdout = stbuildOut.getOutput();

                    if (exitCode > 0) {
                        _logger.error("failed running native packager");
                        _logger.error(stdout);
                        throw new ExBuild("failed running native packager")
                            .raise();
                    }
                } else {
                    _logger.debug("skipping native packaging");
                }
            }
        }
    });

    if (environment == 'testing') {
        processIndex();
    }
}

function writeAppCache(appCache, outfile) {
    _logger.debug("generating appcache manifest...");
    // build the appCache file
    var builder = new StringBuilder();

    builder.append("CACHE MANIFEST\n");
    each(appCache.cache, function (cache) {
        builder.append("# " + cache.checksum + "\n");
        builder.append(cache.uri + "\n");
    });

    builder.append("\n\nFALLBACK:\n");

    each(appCache.fallback, function (fallback) {
        builder.append(fallback + '\n');
    });

    builder.append("\n\nNETWORK:\n");

    each(appCache.network, function (network) {
        builder.append(network + '\n');
    });

    writeFileContent(
        outfile,
        builder.toString());

    builder.setLength(0);
}


(function (proj) {
    try {
        _logger.info("building application");
        runAppBuild(proj);
    } catch (err) {
        _logger.error("Exception running app build : " + err);
        throw err;
    }
})(project);