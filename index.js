'use strict';

// ========================================
// this script depends on all other scripts
// should be loaded last
// ========================================


// adds line numbers everytime page loads
addLineNumbers()


// ========================================
// html elements; will be used by different functions
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
const savedAtTime = document.getElementById('saved-at-time')
const fixed = document.getElementById('fixed')
const editor = document.getElementById('editor')
const header = document.getElementById('header')
const sidebarButton = document.getElementById('toggle-sidebar')



// ========================================
// global variables for storing data
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
// keyword object status
let isKeywordsEmpty = true
// store text save time
let savedAt = ''
let showSidebar = true



// ========================================
// assign event-listeners here
// ========================================

// if window-width < 992px, show message
// confirmWindowSize()


// execute on keyup inside box for word count, suggestions etc.
box.addEventListener('keyup', typeInBox)


// sidebar button
// sidebarButton.addEventListener('click', () => {
//   showSidebar = !showSidebar
//   toggleSidebar()
// })


// text file stuff
openButton.addEventListener('click', openListener)
newButton.addEventListener('click', newListener)
saveButton.addEventListener('click', saveListener)

// kw file stuff
kwOpen.addEventListener('click', kwOpenListener)

// kw stuff
kwCheck.addEventListener('click', checkRequirement)

// not working
// window.addEventListener('beforeunload', (e) => {
//   alert('eeeeeeeeeeee')
//   e.preventDefault()
// })

