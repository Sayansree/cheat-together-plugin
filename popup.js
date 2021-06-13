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
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/reset.js'],
    });
  });
  window.onload= async()=>{
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    fetch('https://oversmart-counter.herokuapp.com/stats',
    {
        method:'get',
        mode:'cors',
        headers: {"Content-type": "application/json; charset=UTF-8"},
    }
    ).then((resp)=>resp.json())
    .then((resp)=>{
            if(v.innerText<resp.latestVersion){
              v.innerText=`newer version of Cheat Together Plugin is available
              <a href="https://oversmart-counter.herokuapp.com/plugin">upgrade from v${resp.latestVersion} to v${v.innerText}</a>`
              v.style.color='yellow'
            }else{
              v.innerText=`You are using latest version of Cheat Together Plugin v${v.innerText}`
              v.style.color='green'
            }
        })
    .catch(()=>{ 
        v.innerText=`unable to establish connection with Cheat Together Server, CONNECTION FAILED`
        v.style.color='red'
    })
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/embededtest.js']
    });
  }