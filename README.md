# /wajha

An agent skill for app developers. You will run `/wajha` inside your app folder and get a `.wajha` project for the [Wajha](https://github.com/M-Alkassem/Wajha) app: a chosen template, your screenshots, and written and translated headlines.

> **Status: not built yet.** You cannot install or use this skill today. Install steps will come when it is ready.

## About Wajha

[Wajha](https://github.com/M-Alkassem/Wajha) is a free, open source, offline app for making App Store and Google Play screenshots. All credit for the app goes to its authors.

This skill is a separate project and is not part of the Wajha app. The idea started in [Wajha issue 3](https://github.com/M-Alkassem/Wajha/issues/3), where the Wajha owner said a separate repo that links back to Wajha would be best.

## Planned

This is how the first version will work:

1. You put your screenshots in a folder.
2. You run `/wajha` in your app folder.
3. The AI agent reads your code, picks a template, and writes the headlines and translations.
4. A small script checks the data and builds `wajha-output/<app>.wajha`.
5. You open the file in the Wajha app, check it, and click Export.

You will need the Wajha app, but not its source code.

The planned command looks like this. The flags may change.

```
/wajha --langs en,ar --tone "playful"
```

The first version will not take screenshots for you, and it will not export the final images. Those are ideas for later versions.
