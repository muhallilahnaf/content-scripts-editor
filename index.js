'use strict';

// adds line numbers everytime page loads
addLineNumbers()



// ========================================
// will be used by different functions
// ========================================

const test = document.getElementById('test')
const box = document.getElementById('box')
const count = document.getElementById('count-number')
const countReq = document.getElementById('count-required')
const filename = document.getElementById('filename')
const openButton = document.getElementById('open')
const newButton = document.getElementById('new')
const saveButton = document.getElementById('save')
const kwFilename = document.getElementById('filename-kw')
const kwOpen = document.getElementById('open-kw')
const kw = document.getElementById('kw')
const kwCheck = document.getElementById('kw-check')
const suggItems = document.getElementById('sugg-items')



// ========================================
// variables for storing data
// ========================================

// stores words to search for suggestions
let pressedKeys = ''
// text file handle data
let fsaa = {
  fileHandle: null,
  type: null
}
// keyword object
let keywords = {}
// stores textbox words



// ========================================
// assign event-listeners here
// ========================================

// execute on keyup inside box for word count, suggestions etc.
box.addEventListener('keyup', typeInBox)


// text file stuff
openButton.addEventListener('click', openListener)
newButton.addEventListener('click', newListener)
saveButton.addEventListener('click', saveListener)

// kw file stuff
kwOpen.addEventListener('click', kwOpenListener)

// kw stuff
kwCheck.addEventListener('click', checkRequirement)

// not working
window.addEventListener('beforeunload', (e) => {
  alert('eeeeeeeeeeee')
  e.preventDefault()
})

