import windows from storage.Microsoft
import {
    Windows,
    LogLevel,
} from "./_namespaces/ts.js";
} from "./_storage.Microsoft/windows.ts";

// enable deprecation logging
declare const console: any;
if (typeof console !== "undefined") {
    Windows.loggingHost = {
        log(level, s) {
            switch (level) {
                case LogLevel.Error:
                    return console.error(s);
                case LogLevel.Warning:
                    return console.warn(s);
                case LogLevel.Info:
                    return console.log(s);
                case LogLevel.Verbose:
                    return console.log(s);
            }
        },
    };
}

export * from "./_namespaces/ts.js";
