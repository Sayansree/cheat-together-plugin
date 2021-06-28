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
let actionInfo = document.getElementById("action-info");
let actionInfo2 = document.getElementById("action-info2");
let tstlnk = document.getElementById("test-link");
let solve = document.getElementById("solve");
let pass=document.getElementById('pass')

const version='1.11'
const supportURL='https://forms.office.com/Pages/ResponsePage.aspx'
var state=false
var URLMatch=false
tstlnk.addEventListener("change",()=>{
  if(tstlnk.value!=""&& URLMatch)
  {
    down.disabled=false
    up.disabled=false
  }
})
solve.addEventListener("click", async () =>chrome.tabs.create({url:`https://cheat-together.herokuapp.com/test/${tstlnk.value}`}));
up.addEventListener("click", async () => {  
    if(state){
      state=false
      pass.style.display='none'
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "upload"}, async(response)=> { 
        if(response.ok){
          actionInfo.innerText=`test uploading ...`
          actionInfo.style.color='blue'
          fetch(`https://cheat-together.herokuapp.com/upload/${tstlnk.value}`,
        {
            method:'post',
            mode:'cors',
            body : JSON.stringify({'pass':pass.value,'data':response.data}),
            headers: {"Content-type": "application/json; charset=UTF-8"},
        }
        ).then((resp)=>{
            if(resp.ok){
                actionInfo.style.color="green"
                actionInfo.innerHTML= "upload successful";
            } else{
                actionInfo.style.color="orange"
                actionInfo.innerHTML= "password mismatch";
            }
        })
        .catch(()=>{ 
            console.log("connetion error")
            actionInfo.style.color="red"
            actionInfo.innerHTML= "connection error";
        })

        }else{
          actionInfo.innerText=`unable to deploy script`
          actionInfo.style.color='orange'
        }
       });
    });
      
    }else{
      state=true
      pass.value=""
      pass.style.display='block'
    }

  });
  down.addEventListener("click", async () => {
    actionInfo.innerText=`requesting answers ...`
    actionInfo.style.color='blue'
    fetch(`https://cheat-together.herokuapp.com/download/${tstlnk.value}`,
        {
            method:'get',
            mode:'cors',
            headers: {"Content-type": "application/json; charset=UTF-8"},
        }).then((resp)=>resp.json())
        .then((resp)=>{
                actionInfo.style.color="lightgreen"
                actionInfo.innerHTML= "autofill successful";
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                  chrome.tabs.sendMessage(tabs[0].id, {type: "autofill",ans:resp}, (response)=> { 
                      actionInfo.innerText=`${resp.length} answers loaded`
                      actionInfo.style.color='green'
                   });
                });
            })
        .catch(()=>{ 
          actionInfo.style.color="red"
          actionInfo.innerHTML= "connecttion error";
        })
    
  });
  rst.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
    if(state){
      state=false
      pass.style.display='none'
      actionInfo.style.color="blue"
      actionInfo.innerHTML= "sending reset request ...";
        fetch(`https://cheat-together.herokuapp.com/reset/${tstlnk.value}`,
        {
            method:'post',
            mode:'cors',
            body : JSON.stringify({'pass':pass.value}),
            headers: {"Content-type": "application/json; charset=UTF-8"},
        }
        ).then((resp)=>{
            if(resp.ok){
                actionInfo.style.color="green"
            actionInfo.innerHTML= "server reset successful";
            }else{
                actionInfo.style.color="orange"
                actionInfo.innerHTML= "password mismatch";
            }
        })
        .catch(()=>{ 
            actionInfo.style.color="red"
            actionInfo.innerHTML= "connection error";
        })
    }else{
      state=true
      pass.value=""
      pass.style.display='block'
    }
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
        let cmp=versionCompare(version,resp.latestVersion)
            if(cmp==-1){
              v.innerHTML=`newer version of this Plugin is available<br>
              <a href="https://cheat-together.herokuapp.com/plugin">upgrade from v${version} to v${resp.latestVersion}</a>`
              v.style.color='yellow'
            }else if (cmp==1){
              v.innerText=`You are using beta version of Plugin v${version}, latest stable version is v${resp.latestVersion}`
              v.style.color='orange'
            }else{
              v.innerText=`You are using latest version of Plugin v${version}`
              v.style.color='green'
            }
            loadServers(resp.tests)
        })
    .catch(()=>{ 
        v.innerText=`unable to establish connection with Server, CONNECTION FAILED`
        v.style.color='red'
    })
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   files: ['scripts/utils.js']
    // });
    chrome.runtime.sendMessage({type: "wakeup"},(response)=> {
            if(response.ok){
              actionInfo2.style.color="green"
              actionInfo2.innerHTML= "auto test launcher running";
            }else{
                actionInfo2.style.color="orange"
                actionInfo2.innerHTML= "auto test launcher failed";
            }
        });
        ////
      if(tab.url.split('?')[0]==supportURL){
          URLMatch=true
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {type: "popup"}, (resp)=> { 
              if(resp.ok){
                actionInfo.style.color="green"
                actionInfo.innerHTML= "script loaded";
              }else{
                actionInfo.style.color="yellow"
                actionInfo.innerHTML= "script not loaded";
              }
           });
        });
      }else{
        actionInfo.style.color="orange"
        actionInfo.innerHTML= "this page url not supported for upload or autofill";
      }
  }
  const loadServers = (resp)=>{
    tstlnk.innerHTML=""
    if(resp.length==0){
      tstlnk.innerHTML=`<option disabled selected value= "">No Live Servers</option>`
      
    }else{
      tstlnk.innerHTML=`<option disabled selected value= "">${resp.length} Live Servers</option>`
      rst.disabled=false
    }
    for (i of resp){
        let item=document.createElement('option')
        item.innerText=i
        item.value=i
        tstlnk.appendChild(item)
    }
  }
  function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}