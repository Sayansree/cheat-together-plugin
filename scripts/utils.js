/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */
if(typeof checkembeded != 'function'){
    window.checkembeded= () =>{
        if(window.location.href.split('?')[0]=='https://forms.office.com/Pages/ResponsePage.aspx'){
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
            if(typeof extract != 'function'){
                window.extract= () =>{
                    let p =document.getElementsByClassName("question-title-box")
                    s=[]
                    console.log(p)
                    for( q of p){
                        ques=q.getElementsByClassName("text-format-content")[0].innerHTML+"\n"
                        qid=q.id.split('_')[1]
                        ans = document.getElementsByName(qid)
                        let option=[]
                        for( a of ans){
                            option.push(a.value)
                        }
                        s.push({'qtext':ques,'qid':qid, 'ans':option})
                    }
                    console.log(s)
                    if(s.length!=0){
                        dsp=document.getElementById('statusdisp').innerText
                        document.getElementById('statusdisp').innerText="";
                        s[0].testname=document.getElementById('statusdisp').parentElement.innerText.trim();
                        document.getElementById('statusdisp').innerText=dsp;
                    
                    }
                    return s
                }
            }
            if(typeof download != 'function'){
                window.download= async (ans)=>{
                    
                }
            
            
            }
            chrome.runtime.onMessage.addListener(async (request, sender, sendResponse)=> {
                if (request.type == "autofill"){
                    const msg=document.getElementById("statusdisp");
                    autofill(request.ans)
                    msg.style.color="lightgreen"
                    msg.innerHTML= `autofill successful! ${ans.length} answers filled`;
                }
              });
            chrome.runtime.onMessage.addListener( (message, sender, sendResponse) =>{
                if(message.type=='upload'){
                    s=extract()
                    const msg=document.getElementById("statusdisp");
                    msg.style.color="lightgreen"
                    msg.innerHTML= "question extracted";
                    sendResponse({ok:true,data:s});
                }
            }
        );
            let k=document.getElementsByClassName("office-form-title heading-1")
            if(k.length!=0)
             k=k[0].getElementsByTagName('span')[0]
            else
             return
            if(document.getElementById('statusdisp')==null)
                k.innerHTML=k.innerHTML+`\t\t<data id = "statusdisp" style="color: darkgray; font-size:smaller">plugin ready</data>`
         }
    }
}

checkembeded()