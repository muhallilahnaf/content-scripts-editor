# Custom Suggestions Text Editor

[Link](https://muhallilahnaf.github.io/content-scripts-editor/)

A browser-based text editor where you can load your own keywords with no. of times each keyword should be used.

It will suggest keyword(s) based on what you type, and check if requirements have been fulfilled.

It also shows a word count (considers all words which are 3 letters or above).

Both your writing and keywords are loaded from local files.
Writings can be saved, loaded, and new writing files can be created.
Keyword files are read-only.

- **Dependency:** [File System Access API](https://wicg.github.io/file-system-access/)
- **Browsers tested:** Chrome Desktop (v88), Edge Desktop (v89)
- **Writing file format:** .txt
- **Keyword file format:** .json, as follows:
```json
{
    "wordCount": [99, 100],
    "keywords": {
        "keyword1": [2, 6],
        "keyword2": [6, 9],
        "anotherOne": [4, 20],
        "andAnother": [13, 37]
    }
}
```
here, first item in the array is the *minimum* count, second item in the array is the *maximum* count.

## Things not available yet

- **dark theme**
- **support for small screens (smartphones, tablets etc.)**
- **interaction with suggestions using keyboard**

