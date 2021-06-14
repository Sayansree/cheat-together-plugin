/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */

if(typeof autofill != 'function'){
    window.autofill= (ansOBJ) =>{
        for( q of ansOBJ){
            ans = document.getElementsByName(q.qid)
            for( a of ans){
                if(a.value.replace(/ /g,"")==q.ans.replace(/ /g,"")){
                    a.click()
                    a.checked=true
                    
                }
            }
        }
        console.log("autofillSuccessful")
    }
}
if(typeof download != 'function'){
    window.download= async (ans)=>{
        const msg=document.getElementById("statusdisp");
        msg.style.color="lightblue"
        msg.innerHTML= "answers loaded";
        if(confirm(`autofill ${ans.length} answers ?`)){
            autofill(ans)
            msg.style.color="lightgreen"
            msg.innerHTML= "autofill successful";
        }else{
            msg.style.color="orange"
            msg.innerHTML= "autofill aborted";
        }
    }

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse)=> {
      if (request.type == "autofill"){
        download(request.ans)
        sendResponse({ok:true});
      }
    });
}