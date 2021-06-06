/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */

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
        return s
    }
}
if(typeof upload != 'function'){
    window.upload= async () =>{
        s=extract()
        const msg=document.getElementById("statusdisp");
        if (s==null||s.length==0){
            msg.style.color="yellow"
            msg.innerHTML= "question extraction failed";
            return
        }
        p = prompt("password")
        if(p!=null){
        
        msg.style.color="blue"
        msg.innerHTML= "uploading...";
        fetch('https://cheat-together.herokuapp.com/upload',
        {
            method:'post',
            mode:'cors',
            body : JSON.stringify({'pass':p,'data':s}),
            headers: {"Content-type": "application/json; charset=UTF-8"},
        }
        ).then((resp)=>{
            if(resp.ok){
                msg.style.color="lightgreen"
                msg.innerHTML= "upload successful";
            } else{
                msg.style.color="orange"
                msg.innerHTML= "password mismatch";
            }
        })
        .catch(()=>{ 
            console.log("connetion error")
            msg.style.color="orange"
            msg.innerHTML= "connection error";
        })}
    }
}
upload()