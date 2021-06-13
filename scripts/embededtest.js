/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */
if(typeof checkembeded != 'function'){
    window.checkembeded= () =>{
        if(window.location.href.split('?')[0]=='https://forms.office.com/Pages/ResponsePage.aspx'){
            let k=document.getElementsByClassName("office-form-title heading-1")
            if(k)
             k=k[0].getElementsByTagName('span')[0]
            else
             return
            if(document.getElementById('statusdisp')==null)
                k.innerHTML=k.innerHTML+`\t\t<data id = "statusdisp" style="color: darkgray; font-size:smaller">plugin ready</data>`
         }
    }
}

checkembeded()