/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */
if(typeof checkembeded != 'function'){
    window.checkembeded= () =>{
        let p =document.getElementsByTagName("iframe")
        if(p.length!=0){
            url=p[0].src
            if(`https://forms.office.com/Pages/TeamsResponsePage.aspx`==url.split('?')[0]){
                url=`https://forms.office.com/Pages/ResponsePage.aspx?&id=${url.split('&id=')[1]}`
                alert("opening the test directly on google where extention can work")
                window.open(url, '_blank').focus();
                return
            }
        }else
        {
        let k=document.getElementsByClassName("office-form-title heading-1")[0].getElementsByTagName('span')[0]
        k.innerHTML=k.innerHTML+`\t\t<data id = "statusdisp" style="color: darkgray; font-size:smaller">script loaded</data>`
        }
        return false
    }
    checkembeded()
}
