'use strict';

// ========================================
// this script depends on helpers.js
// ========================================

// add line numbers to textarea
const addLineNumbers = () => {
    const num = document.getElementById('num')
    let s = ''

    for (let i = 1; i < 1000; i++) {
        s += `${i}.\n`
    }

    num.value = s
}


// not using now
// toggle sidebar
const toggleSidebar = () => {

    if (showSidebar) {
        fixed.style.visibility = 'visible'

        if (document.documentElement.clientWidth <= 1024) {
            editor.style.width = 'calc(100vw - 300px)'
            header.style.width = 'calc(100vw - 300px)'
        } else {
            editor.style.width = 'calc(100vw - 350px)'
            header.style.width = 'calc(100vw - 350px)'
        }

        sidebarButton.innerHTML = '=>'
    } else {
        fixed.style.visibility = 'hidden'
        editor.style.width = '90vw'
        header.style.width = '90vw'
        sidebarButton.innerHTML = '<='
    }
}


// not using now
// get window size and show message
const confirmWindowSize = () => {
    if (document.documentElement.clientWidth < 992) {
        showSidebar = !confirm('UI not optimal for small window/screen, hide sidebar?')
    }
    toggleSidebar()
}


// searches text box to find no. of occurance of keyword
// updates occurance no.
// if keyword occurence within limit: adds strikethrough in html
const checkRequirement = () => {

    for (const [key, value] of Object.entries(keywords.keywords)) {
        const reKey = RegExp(`\\b${key}\\b`, 'gi')
        const matchNos = [...box.value.matchAll(reKey)].length

        const el = document.querySelector(`.kw-item.${sanitizeClass(key)}`)
        el.querySelector('.occurance').innerHTML = matchNos.toString()

        if (matchNos >= value[0] && matchNos <= value[1]) {
            el.style.textDecoration = 'line-through'
        }
    }

}


// executes on keyup in textbox (word count, suggestions etc.)
const typeInBox = (e) => {

    // suggestion
    if (!isKeywordsEmpty) {
        clearSuggs()
        searchSugg()
        wordCount()
        // const key = e.which || e.keyCode

        // if key is alphanumeric, 
        // search pressedKeys and populate sugg-items div

        // if key is backspace, 
        // change pressedKeys and search pressedKeys and populate sugg-items div

        // if key is space, 
        // clear pressedKeys and check requirement
        if (key === 32) {
            pressedKeys = ''
            clearSuggs()
            checkRequirement()
        }
    }
}


// open text file and paste value in box
const openListener = async () => {
    savePrevious()
    const fileHandle = await getFileHandle()
    setFsaa(fileHandle, 'open')

    const file = await fileHandle.getFile()
    filename.innerHTML = file.name

    const contents = await readFile(file)
    box.value = contents
}


// open new text file and paste value in box
const newListener = async () => {
    savePrevious()

    const fileHandle = await getNewFileHandle()
    setFsaa(fileHandle, 'new')

    const file = await fileHandle.getFile()
    filename.innerHTML = file.name

    // const contents = await readFile(file)
    // box.value = contents
}


// save text file
const saveListener = async () => {

    if (fsaa.fileHandle) {
        writeFile(fsaa.fileHandle, box.value)
        setSavedAt()
        alert('saved')
    } else {
        alert('no file open')
    }
}


// open keyword json file and save value in global variable `keyword`
const kwOpenListener = async () => {
    const fileHandle = await getFileHandle()

    const file = await fileHandle.getFile()
    kwFilename.innerHTML = file.name

    const contents = await readFile(file)
    const tmpKeywords = JSON.parse(contents)

    const kwValid = validateKeywords(tmpKeywords)

    if (kwValid === 'valid') {
        isKeywordsEmpty = false
        kwCreate(tmpKeywords)
        wordCountLoad()
        kwLoad()
    } else {
        // show error message of kwValid
    }
}
