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
    window.download= async ()=>{
        const msg=document.getElementById("statusdisp");
        msg.style.color="lightblue"
        msg.innerHTML= "loading answers ....";
        fetch('https://cheat-together.herokuapp.com/download',
        {
            method:'get',
            mode:'cors',
            headers: {"Content-type": "application/json; charset=UTF-8"},
        }).then((resp)=>resp.json())
        .then((resp)=>{
                if(confirm("Do you want to autofill the answers from server?")){
                    autofill(resp)
                    msg.style.color="lightgreen"
                    msg.innerHTML= "autofill successful";
                }else{
                    msg.style.color="lightgreen"
                    msg.innerHTML= "download successful";
                }
            })
        .catch(()=>{ 
            msg.style.color="red"
            msg.innerHTML= "connecttion error";
        })
    }
}
download()