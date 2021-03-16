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


// generate suggestion item html components
const suggItemComponent = (k, v) => {
    const p = document.createElement('p')
    p.className = `sugg-item ${sanitizeClass(k)}`
    p.innerHTML = `${k}: (${v[0]} - ${v[1]})`
    return p
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
const searchPressedKeys = () => {
    const word = getWordByPos(caretPos())

    if (word !== '') {

        for (const [keyword, value] of Object.entries(keywords.keywords)) {

            if (checkPressedKeysPresence(word, keyword)) {
                const component = suggItemComponent(keyword, value)
                suggItems.appendChild(component)
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
const kwComponent = (k, v) => {
    const p = document.createElement('p')
    p.className = `kw-item ${sanitizeClass(k)}`
    p.innerHTML = `${k}: `

    const span = document.createElement('span')
    span.className = 'occurance'
    span.innerHTML = '0'

    p.appendChild(span)
    p.innerHTML += ` (${v[0]} - ${v[1]})`
    return p
}


// load stuff to html after keyword json file loads
const kwLoad = () => {
    // paste required word count
    const kount = keywords.wordCount // array
    countReq.innerHTML = ` / (${kount[0]}-${kount[1]})`

    // paste keywords
    for (const [key, value] of Object.entries(keywords.keywords)) {
        const component = kwComponent(key, value)
        kw.appendChild(component)
    }
}


