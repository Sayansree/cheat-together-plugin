/* 
 * written by Sayansree Paria
 * git hub https://github.com/Sayansree
 * email sayansreeparia@gmail.com
 * 
 */
const openMSFormsTest =(id)=>{
    const testURL = `https://forms.office.com/Pages/ResponsePage.aspx?&id=${id}`
    chrome.tabs.create({url: testURL});
}
const WebMSForm = (id) => {
    // chrome.scripting.executeScript({
    //     target: { tabId: id },
    //     files: ['scripts/embededtest.js']
    //   });
}
const sniffer = ()=> {
    const networkFilters = {
        urls: ["https://forms.office.com/Pages/*"]
    };

    chrome.webRequest.onBeforeRequest.addListener(async (details) => {
        const { tabId, requestId } = details;
        const url= details.url
        console.log(tabId,url)
        switch(url.split('?')[0]){
            case 'https://forms.office.com/Pages/AssignmentsResponsePage.aspx':
                console.log(tabId,'assignment forms detected')
                openMSFormsTest(url.split('id=')[1])
                break;
            
            case 'https://forms.office.com/Pages/TeamsResponsePage.aspx':
                console.log(tabId,'teams forms detected')
                openMSFormsTest(url.split('&id=')[1])
                break;

            case 'https://forms.office.com/Pages/ResponsePage.aspx':
                console.log(tabId,'web forms detected')
                WebMSForm(tabId)
                break;
        }
    }, networkFilters);

}
sniffer()