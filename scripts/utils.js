/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */
if(window.location.href.split('?')[0].toLowerCase()=='https://forms.office.com/pages/responsepage.aspx'){
    if(typeof autofill != 'function'){
        window.autofill= (ansOBJ) =>{
            ctr=0
            for( q of ansOBJ){
                if(q.ans){
                    if(q.type=='text'){
                        let tb=document.querySelector(`input[aria-labelledby=QuestionId_${q.qid}]`)
                        tb.value=q.ans
                        tb.dispatchEvent(new Event("input"))
                        if(q.ans!="")ctr++
                    }else if(q.type=='textarea'){
                        let tb=document.querySelector(`textarea[aria-labelledby=QuestionId_${q.qid}]`)
                        tb.value=q.ans
                        tb.dispatchEvent(new Event("input"))
                        if(q.ans!="")ctr++
                    }else if(q.type=='radio'){
                        ans = document.querySelectorAll(`input[type="radio"][name="${q.qid}"]`)
                        for( a of ans){
                            if(a.value.replace(/ /g,"")==q.ans.replace(/ /g,"")){
                                a.click()
                                a.checked=true  
                            }
                        }
                        if(q.ans!="")ctr++
                    }else if(q.type=='checkbox'){
                        opn = document.querySelectorAll(`input[type="checkbox"][name="${q.qid}"]`)
                        for( op of opn){
                            if(q.ans.find((v)=>v.replace(/ /g,"")==op.value.replace(/ /g,""))){
                                if(!op.checked){
                                    op.click()
                                    op.checked=true  
                                }
                            }else{
                                if(op.checked){
                                    op.click()
                                    op.checked=false  
                                }
    
                            }
                        }
                        if(q.ans.length!=0)ctr++
                    }
                }
            }
            console.log("autofillSuccessful",ansOBJ)
            const msg=document.getElementById("statusdisp");
            msg.style.color="lightgreen"
            msg.innerHTML= `autofill successful! ${ctr}/${ansOBJ.length} answers filled`;
            return ctr;
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
                    qmath=(q.getElementsByClassName('question-title-container')[0]||q.getElementsByClassName('question-title-box')[0])
                    qmath=qmath.getElementsByTagName('script')[0]
                    ques.math=(qmath)?`$$${qmath.innerText}$$`:""
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
                            math=a.nextSibling.getElementsByTagName('script')[0]
                            options.push({val:a.value,math:math!=null})
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
                    s[0].testurl=window.location.href
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
    if(typeof label != 'function'){
        window.label= () =>{
            if(document.getElementById('statusdisp')==null){
                let k=document.getElementsByClassName("office-form-title heading-1")[0]
                if(k){
                    k=k.getElementsByTagName('span')[0]
                    k.innerHTML=k.innerHTML+`\t\t<data id = "statusdisp" style="color: darkgray; font-size:smaller">plugin ready</data>`
                    return true;
                
                }else
                    return false;
            }else
                return true       
        }
    }
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse)=> {
        switch (request.type){
            case "autofill":    sendResponse({num:autofill(request.ans)})
                                break;
            case "upload":      s=extract()
                                if(s)
                                    sendResponse({ok:true,data:s});
                                else
                                    sendResponse({ok:false});
                                break;
            case "popup":       sendResponse({ok:label()})
                                break;
        }
    });
}
