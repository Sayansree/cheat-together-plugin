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
                    let p =document.getElementsByClassName("__question__")
                    if(p.length==0){
                        console.log('no questions found')
                    }else{
                        s=[]
                        for( q of p){
                            ques={}
                            qs=q.getElementsByClassName("office-form-question-title")[0]
                            ques.points=qs.getElementsByClassName("office-form-theme-quiz-point")[0]
                            ques.points=(ques.points)?ques.points.innerText:""
                            qs=qs.getElementsByClassName('text-format-content')[0]
                            ques.qtext=(qs)?qs.innerText:""
                            ques.img=q.getElementsByClassName('office-form-theme-image-container-border')[0]
                            ques.img=(ques.img)?{'available':true,'src': ques.img.firstElementChild.src}:{'available':false}
                            q=q.getElementsByClassName('office-form-question-element')[0]
                            qs=q.getElementsByTagName('input')
                            if(qs.length==0){
                                qs=q.getElementsByTagName('textarea')
                                if(qs.length==0)continue
                                ques.qid=qs[0].attributes['aria-labelledby'].value.split('_')[1]
                                ques.ans={'type':'textarea'}
                            }else if(qs.length==1){
                                ques.qid=qs[0].attributes['aria-labelledby'].value.split('_')[1]
                                ques.ans={'type':'text'}
                            }else{
                                let options=[]
                                for( a of qs){
                                    options.push(a.value)
                                }
                                ques.qid=qs[0].name
                                ques.ans={'type':qs[0].type,'options':options}
                            }
                            s.push(ques)
                        }
                        console.log("question data",s)
                        const msg=document.getElementById("statusdisp");
                        if(s.length!=0){
                            msg.innerText="";
                            s[0].testname=msg.parentElement.innerText.trim();
                            msg.innerText="Question parsing successful";
                            msg.style.color="lightgreen"
                            return s

                        }else{
                            console.log('parsing error') 
                            dsp=msg.innerText
                            msg.innerText="";
                            s[0].testname=msg.parentElement.innerText.trim();
                            msg.innerText="Question parsing error";
                            msg.style.color="orange"
                            return null
                        }
                    }

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
                    if(s)
                        sendResponse({ok:true,data:s});
                    else
                        sendResponse({ok:false});
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