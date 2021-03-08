'use strict';

// add line numbers to textarea
const addLineNumbers = () => {
    const num = document.getElementById('num')
    let s = ''
    for (let i = 1; i < 101; i++) {
        s += `${i}.\n`
    }
    num.value = s
}

// gives caret position
const caretPos = () => {
    if (document.activeElement === box) {
        let posStart = box.selectionStart //number
        let posEnd = box.selectionEnd //number
        let notInitial = (posStart !== 0) && (posEnd !== 0)
        let notSelection = (posStart === posEnd)
        if (notInitial && notSelection) {
            test.innerHTML = `caret pos: ${posStart}`
        } else {
            test.innerHTML = 'initial or selection'
        }
    } else {
        test.innerHTML = 'not focused'
    }
}

// sanitize keywords for use as classname
const sanitizeClass = (c) => {
    return c.replace(/[^A-Za-z0-9]/g, '-')
}

// check if object is empty
const checkEmptyObj = (o) => {
    return (Object.keys(o).length === 0)
}

// searches text box to find no. of occurance of keyword
// updates occurance no.
// if keyword occurence within limit: adds strikethrough in html
const checkRequirement = () => {
    if (!checkEmptyObj(keywords)) {
        for ( const [key,value] of Object.entries(keywords) ) {
            const reKey = RegExp(` ${key} `, 'gi')
            const matchNos = [...box.value.matchAll(reKey)].length
            const el = document.getElementsByClassName(sanitizeClass(key))[0]
            el.querySelector('.occurance').innerHTML = matchNos.toString()
            if (matchNos >= value[0] && matchNos <= value[1]) {
                el.style.textDecoration = 'line-through'
            }
        }    
    } else {
        alert('load keyword file first')
    }
}

// executes on keyup in textbox (word count, suggestions etc.)
const typeInBox = (e) => {
    // word count
    const countArray = box.value.split(' ')
    const realcountArray = countArray.filter(word => {
        return (word !== '' && word.length > 2)
    })
    count.innerHTML = realcountArray.length

    if (!checkEmptyObj(keywords)) {
        // suggestion
        const key = e.which || e.keyCode
        if (key > 64 && key < 91) {
            pressedKeys += String.fromCharCode(key)
            // search for pressedKeys in kw
        }
        // if key is space, clear pressedKeys and check requirement
        if (key === 32) {
            pressedKeys = ''
            // checkRequirement()
        }

        // check requirement

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
    const contents = await readFile(file)
    box.value = contents
}

// save text file
const saveListener = async () => {
    if (fsaa.fileHandle) {
        writeFile(fsaa.fileHandle, box.value)
        alert('saved')
    } else {
        alert('no file open')
    }
}

// generate keyword html components
const kwComponent = (k, v) => {
    const p = document.createElement('p')
    p.className = `kw-item ${sanitizeClass(k)}`
    p.innerHTML = `${key}: `

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
    for ( const [key, value] of Object.entries(keywords.keywords) ) {
        // const keywordStr = `${key}: (${value[0]} - ${value[1]})`
        const component = kwComponent(key, value)
        kw.appendChild(component)
    }
}

// open keyword json file and save value in global variable `kw`
const kwOpenListener = async () => {
    const fileHandle = await getFileHandle()
    const file = await fileHandle.getFile()
    kwFilename.innerHTML = file.name
    const contents = await readFile(file)
    keywords = JSON.parse(contents)
    kwLoad()
}

