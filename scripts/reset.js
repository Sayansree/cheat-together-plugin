/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */
if(typeof reset != 'function'){
    window.reset = async ()=>{
        let p = prompt("password")
        if(p==null)return
        const msg=document.getElementById("statusdisp");
        msg.style.color="lightblue"
        msg.innerHTML= "sending reset request ...";
        fetch('https://cheat-together.herokuapp.com/reset',
        {
            method:'post',
            mode:'cors',
            body : JSON.stringify({'pass':p}),
            headers: {"Content-type": "application/json; charset=UTF-8"},
        }
        ).then((resp)=>{
            if(resp.ok){
                msg.style.color="lightgreen"
            msg.innerHTML= "server reset successful";
            }else{
                msg.style.color="orange"
                msg.innerHTML= "password mismatch";
            }
        })
        .catch(()=>{ 
            msg.style.color="red"
            msg.innerHTML= "connection error";
        })
    }
 }
reset() 
