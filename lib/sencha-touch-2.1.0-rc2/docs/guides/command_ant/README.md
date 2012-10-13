# Ant Integration

In addition to the command line interface described in the [Getting Started](#/guide/command)
guide, Sencha Command also provides direct interfaces for use in Ant.

{@img ../command/sencha-command-128.png}

[Ant](http://ant.apache.org/) has long been a pillar of the Java development community,
but at its core, Ant is an XML-based, cross-platform scripting platform. We call it a
"platform" rather than a "language" because Ant can easily incorporate libraries of code
in JAR form, or you can use one of the many supported scripting languages as part of your
Ant script.

Ant can, of course, call other programs (like Sencha Command), passing arguments and
processing exit codes, but what Ant is particularly good at is manipulating files. This
is because Ant was designed for use with build scripts.

As touched on in the [Advanced Sencha Cmd](#/guide/command_advanced) guide, Sencha Cmd
is delivered as a JAR file and it exposes its core functionality as an Ant Library (or
`antlib`). The command line level of Sencha Command, as well as SDK-specific processing
are implemented on top of this layer. So anything you can do in one, you can do in the
other.

{@img ../command_advanced/sencha-command-diagram.png}

If you are using Ant, it is better to interface to Sencha Command at this level rather
than make repeated calls through the command line interface.

    <taskdef resource="com/sencha/ant/antlib.xml" 
             classpath="${sencha.command.dir}/sencha.jar"/>

## x-sencha-command

This command is equivalent to the command line interface. The arguments are placed in the
body text of this tag, one argument per line. Spaces are trimmed at both ends, so indent
level is not significant. A good use of indentation is to clarify the command structure,
like this:

    <x-sencha-command>
        compile
            --classpath=app,sdk/src
            page
                --in=app/index.html
                --out=build/index.html
    </x-sencha-command>

Because each line is an argument, spaces are not special and should not be escaped or quoted.

Ant properties are expanded, so the following (fairly conventional style) also works:

    <x-sencha-command>
        compile
            --classpath=${app.dir},${sdk.dir}/src
            page
                --in=${app.dir}/index.html
                --out=${build.dir}/index.html
    </x-sencha-command>

Finally, comments are supported so you can document the command or disable parts temporarily
without deleting them. Also, blank lines are skipped:

    <x-sencha-command>
        compile
            # Include the app folder and the sdk/src folder
            --classpath=${app.dir},${sdk.dir}/src

            # Turn off debugging (comment next line to leave debug enabled):
            # --debug=false

            page
                # The application main page:
                --in=${app.dir}/index.html

                # The compiled page goes in build folder along with "all-classes.js":
                --out=${build.dir}/index.html
    </x-sencha-command>

## x-generate

This task generates output from templates in two basic modes: `file` and `dir`. That is,
the template generator can be given a single source file or a source folder.

### Template Engines

The name of the template file determines the template engine used. Currently there are
two supported template engines:

 * `.vm` = [Velocity](http://velocity.apache.org/engine/devel/user-guide.html)
 * `.tpl` = [XTemplate](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.XTemplate)

For example, `foo.js.vm` would be used to generate `foo.js` using the Velocity engine,
while `foo.js.tpl` uses XTemplate.

### Sacred Files

When generating code, files fall into two basic categories: machine maintained and user
maintained. It is preferable, however, to provide a starter or skeleton file at initial
generation even for files that will be ultimately user maintained.

This is called a "sacred" file and is identified by the source file extension of `.default`.
That is, the source file is just a default and will not replace an existing file.

For example, one might want to generate a starter `readme.txt` file but preserve whatever
the user might have changed during a later regeneration. To do so, the source file would
be named `readme.txt.default`.

There are times when a sacred file is also a template. This is done by adding both
extensions, for example, `readme.txt.vm.default`. This `readme.txt` file is a sacred file
that is initially generated using Velocity.

### Parameters

Template generation requires data, or parameters. The simplest form of parameter uses the
`param` attribute:

    <x-generate ...>
        <param name="bar" value="42" />
    </x-generate>

Parameters can also be loaded from a file, like so:

    <x-generate ...>
        <load file="data.properties"/>
    </x-generate>

The following file types are understood automatically:

 * `.cfg` or `.properties` = A standard Java Properties file.
 * `.json` = A JSON data file.

If the file does not have one of these extensions, but is a properties file or JSON, you
can specify the `type` attribute as `json` or `properties`, like so:

    <x-generate ...>
        <load file="data.props" type="properties" />
        <load file="data" type="json" />
    </x-generate>

*Note*: Parameters are applied in the order specified. Duplicate names are replaced if
they are encountered.

### x-generate file tofile

The simplest form of `x-generate` is using the `file` attribute to transform a single
template file to a specified output file:

    <x-generate file="foo.js.vm" tofile="build/foo.js">
        <param name="bar" value="42" />
    </x-generate>

The source filename determines how the process will proceed (which template engine to use
and if it is sacred), but that is all.

### x-generate file todir

In many cases, you can leave off the target filename and just specify the folder, like this:

    <x-generate file="foo.js.vm" todir="build">
        <param name="bar" value="42" />
    </x-generate>

This will generate `foo.js` (using Velocity) in the `build` folder.

Beyond avoiding redundancy, this form also allows the source filename to be a template,
for example:

    <x-generate file="${name}.js.vm" todir="build">
        <param name="name" value="foobar" />
        <param name="bar" value="42" />
    </x-generate>

The source file exists with the specified name (that is, `${name}.js.vm`), but this name
is transformed using the Velocity engine and the provided parameters to determine the
target filename.

In the above case, `foobar.js` is generated in the `build` directory.

### x-generate dir todir

The final form of `x-generate` operates on a source folder, and generates content in the
target folder, for example:

    <x-generate dir="templates/foo" todir="build/foo">
        <param name="bar" value="42" />
        <load file="data.json"/>
    </x-generate>

In this form, the generator recursively reads files and subfolders in `templates/foo` and
applies the appropriate template engine. It also preserves sacred files.All file and folder
names are processed as Velocity templates.

## x-compress-js - TODO

Compresses JavaScript source according to the following options (attributes):

    srcfile: The source file to compress.
    outfile: The output file to generate (defaults to srcfile).
    charset: The charset of the input/output files.
    header: Optional text to include in a comment block at the start of the file.
    linebreak: The column number at which to break lines (default is -1, to not break lines).
    obfuscate: False to not obfuscate local symbols (default is true).
    disableoptimizations: True to disable all built-in optimizations.
    preservesemi: True to preserve all semicolons.
    verbose: True to enable extra diagnostic messages.

## x-compress-css - TODO

Compresses CSS source according to the following options (attributes):

    srcfile: The source file to compress.
    outfile: The output file to generate (defaults to srcfile).
    charset: The charset of the input/output files.
    header: Optional text to include in a comment block at the start of the file.
    linebreak: The column number at which to break lines.
    verbose: True to enable extra diagnostic messages.

## x-strip-js - TODO

This task removes comments (line and/or block) from a JS file. The following options are
supported:

    srcfile: The source file to strip
    outfile: The output file to generate (defaults to srcfile).
    header: Optional text to include in a comment block at the start of the file.
    blockcomments : True (the default) to strip block comments ("/* ... */").
    linecomments  : True (the default) to strip line comments ("//").
    keepfirstcomment : True (the default) to keep the first comment in the JS file.
        This is typically a copyright.
    whitespace : True to also strip whitespace.

## sencha ant - TODO

To help setting up properties that reference Sencha Command (e.g., "sencha.command.dir"),
Sencha Command provides an "ant" command that mimics the normal Ant command line.

    sencha ant -Dfoo=bar build

The following subset of the Ant command line is supported:

    -diagnostics           print information that might be helpful to
                           diagnose or report problems.
    -debug, -d             print debugging information
    -lib <path>            specifies a path to search for jars and classes
    -logfile <file>        use given file for log
      -l     <file>                ''
    -logger <classname>    the class which is to perform logging
    -listener <classname>  add an instance of class as a project listener
    -noinput               do not allow interactive input
    -buildfile <file>      use given buildfile
      -file    <file>              ''
      -f       <file>              ''
    -D<property>=<value>   use value for given property
    -keep-going, -k        execute all targets that do not depend
                           on failed target(s)
    -propertyfile <name>   load all properties from file with -D
                           properties taking precedence
    -inputhandler <class>  the class which will handle input requests
    -nice  number          A niceness value for the main thread:
                           1 (lowest) to 10 (highest); 5 is the default
    -nouserlib             Run ant without using the jar files from
                           ${user.home}/.ant/lib
    -noclasspath           Run ant without using CLASSPATH
    -autoproxy             Java1.5+: use the OS proxy settings

The following Ant switches are "inherited" certain Sencha Command configuration properties
or switches:

    -quiet, -q             sencha -quiet ant
    -verbose, -v           sencha -debug ant
    -emacs, -e             sencha -plain ant

The following Ant switches are not supported:

    -find <file>           (s)earch for buildfile towards the root of
      -s  <file>           the filesystem and use it
