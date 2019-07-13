# Keytar VS Code Extensions

`npm install` & `npm start`

This repository demonstrates a weird Keytar issue where when loaded dynamically
using `require` from a `node` file, the library seemingly works (doesn't work,
but doesn't throw an error either) and just before the process exits, it throws
a junk exception:

```
# Fatal error in , line 0
# Check failed: receiver->IsJSFunction().
# FailureMessage Object: 000000B5BCDBDA20npm
# errno 3221225477
```

(In the `electron` repro the file name and line number is okay.)

The `require` seems to go through and resolves to the correct instance whose
methods `setPassword` and `findPassword` both work as well, but then it crashes.

Funnily enough, when the last line of code is `process.exit(0)`, it doesn't crash,
even though there is no more code in either case. It's almost as if some sort of
a destructor ran and in it the library threw the exception and `process.exit`
prevented it from running thus leaking the library.

Of course this workaround doesn't help because the `findPassword` method still
returns `undefined`.

I have filed a Keytar [GitHub issue](https://github.com/atom/node-keytar/issues/106)
for this problem linking to this repro.

---

In https://github.com/microsoft/vscode/issues/68738 it is shown how to use VS
Code's bundled Keytar which might be an acceptable workaround / fallback mechanism.
