
const s = document.createElement('script')
s.src = chrome.runtime.getURL("scripts/inject.js")
console.log(s.src)
s.onload = async () => s.remove()
(document.head || document.documentElement).appendChild(s)