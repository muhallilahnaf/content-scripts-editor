'use strict';

// ========================================
// this script depends on fs-helpers.js
// ========================================


// sanitize keywords for use as classname
const sanitizeClass = (c) => {
    let s = c.replace(/[^A-Za-z0-9]/g, '-')

    if (!isNaN(s[0])) {
        s = `NaN${s}`
    }

    return s
}


// check if object is empty
const checkEmptyObj = (o) => {
    return (Object.keys(o).length === 0)
}


// returns caret position
const caretPos = () => {

    if (document.activeElement === box) {
        const posStart = box.selectionStart
        const posEnd = box.selectionEnd
        const notInitial = (posStart !== 0) && (posEnd !== 0)
        const notSelection = (posStart === posEnd)

        if (notInitial && notSelection) {
            return posStart
        }
    }
    return null
}


// get word at caret position
const getWordByPos = (p) => {

    if (!p) return ''

    let left = box.value.substring(0, p);
    let right = box.value.substring(p);

    left = left.replace(/^.+ /g, "");
    right = right.replace(/ .+$/g, "");

    return left + right;
}


// check if suggestion is already present in suggestion items div
const checkSuggPresence = (k) => {

    if (suggItems.querySelector(`.${sanitizeClass(k)}`)) {
        return true
    }

    return false
}


// check if pressedKeys is included in keyword
const checkPressedKeysPresence = (w, k) => {

    if (k.includes(w.toLowerCase())) {
        return true
    }

    return false
}


// check if pressed key is alphanumeric (a-z and 0-9)
const isAlphanumericKey = (key) => {

    if (key > 64 && key < 91) {
        // a-z
        return true
    }

    if (key > 47 && key < 58) {
        // 0-9
        return true
    }

    return false
}


// clear suggestions
const clearSuggs = () => {

    while (suggItems.firstChild) {
        suggItems.firstChild.remove()
    }
}


// find word count and display in html
const wordCount = () => {
    const countArray = box.value.split(' ')

    const realcountArray = countArray.filter(word => {
        return (word !== '' && word.length > 2)
    })

    count.innerHTML = realcountArray.length
}


// search for pressedKeys in keywords and append in sugg-items div
const searchSugg = () => {
    const word = getWordByPos(caretPos())

    if (word !== '') {

        for (const [keyword, value] of Object.entries(keywords.keywords)) {

            if (checkPressedKeysPresence(word, keyword)) {
                suggItems.appendChild(value.suggComponent)
            }
        }
    }
}


// populate `fsaa` global variable with data for text file
const setFsaa = async (fileHandle, type) => {

    if (await verifyPermission(fileHandle, true)) {
        fsaa.fileHandle = fileHandle
        fsaa.type = type
    } else {
        alert('permission denied')
    }
}


// save current file before opening new one
const savePrevious = async () => {

    if (fsaa.fileHandle) {
        await writeFile(fsaa.fileHandle, box.value)
        alert('previous file saved')
    }
}


// change savedAt value and load in html
const setSavedAt = () => {
    savedAt = new Date().toLocaleTimeString()
    savedAtTime.innerHTML = savedAt
}


// generate keyword html components
const createComponent = (k, v, s) => {
    const p = document.createElement('p')
    const q = sanitizeClass(k)
    p.className = (s === 'kw') ? `kw-item ${q}` : `sugg-item ${q}`

    const span1 = document.createElement('span')
    span1.className = 'left'
    span1.innerHTML = '0'

    const span2 = document.createElement('span')
    span2.className = 'keyword'
    span2.innerHTML = ` ${k} `

    const span3 = document.createElement('span')
    span3.className = 'occurance'
    span3.innerHTML = '0'

    const span4 = document.createElement('span')
    span4.className = 'minmax'
    span4.innerHTML = ` (${v[0]} - ${v[1]})`

    p.appendChild(span1)
    p.appendChild(span2)

    if (s === 'kw') {
        p.appendChild(span3)
        p.appendChild(span4)
    }

    return p
}


// create `keyword` dict
const kwCreate = (t) => {
    keywords.wordCount = t.wordCount
    let kwObj = {}


    for (const [key, value] of Object.entries(t.keywords)) {
        let tmpObj = {
            min: value[0],
            max: value[1],
            occurance: 0,
            fulfilled: false,
            left: 0,
            kwComponent: createComponent(key, value, 'kw'),
            suggComponent: createComponent(key, value, 'sugg')
        }
        kwObj[key] = tmpObj
    }

    keywords.keywords = kwObj
}


// load word count in HTML
const wordCountLoad = () => {
    const kount = keywords.wordCount
    countReq.innerHTML = ` / (${kount[0]} - ${kount[1]})`
    wordCount()
}


// load kw in HTML
const kwLoad = () => {

    for (const [key, value] of Object.entries(keywords.keywords)) {
        kw.appendChild(value.kwComponent)
    }
}


// validate value array
const isValueArray = (a) => {

    if (!Array.isArray(a) || a.length !== 2) return false
    if (!Number.isInteger(a[0]) || !Number.isInteger(a[1])) return false
    if (a[0] >= a[1]) return false

    return true
}


// validate keywords json file
const validateKeywords = (f) => {

    // validate wordCount
    if (!f.wordCount) return 'word count does not exist'
    if (!isValueArray(f.wordCount)) return 'word count should be of type array'

    // validate keywords
    for (const [keyword, value] of Object.entries(f.keywords)) {

        if (!isValueArray(value)) return 'word count should be of type array'
    }

    return 'valid'
}