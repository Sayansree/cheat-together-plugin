/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */
let up = document.getElementById("up");
let down = document.getElementById("down");
let rst = document.getElementById("rst");
let v = document.getElementById("version-info");
const version=1.6
up.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/upload.js']
    });
  });
  down.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/download.js'],
    });
  });
  rst.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "getCount"}, function(count) {
          console.log("got")
      });
  });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/reset.js'],
    });
  });
  window.onload= async()=>{
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    v.innerText=`checking for updates ...`
              v.style.color='blue'
    fetch('https://cheat-together.herokuapp.com/stats',
    {
        method:'get',
        mode:'cors',
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }
    ).then((resp)=>resp.json())
    .then((resp)=>{
            if(version<resp.latestVersion){
              v.innerHTML=`newer version of this Plugin is available
              <a href="https://cheat-together.herokuapp.com/plugin">upgrade from v${resp.latestVersion} to v${version}</a>`
              v.style.color='yellow'
            }else{
              v.innerText=`You are using latest version of Cheat Together Plugin v${version}`
              v.style.color='green'
            }
        })
    .catch(()=>{ 
        v.innerText=`unable to establish connection with Server, CONNECTION FAILED`
        v.style.color='red'
    })
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/embededtest.js']
    });
  }