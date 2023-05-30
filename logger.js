"use strict";
const logElm = document.getElementById("log");

function logEntry(hash,event,domain){
    let loge = document.createElement("p");
    loge.textContent = `${event} - ${hash} - ${domain}`;
    if(event === "blocked"){
        loge.style.color = "red";
    }
    logElm.appendChild(loge);
}

browser.runtime.onMessage.addListener(async function(data){
    console.log(data);
    if(typeof data !== "object"){
        return;
    }
    if(!data.event){
        return;
    }
    logEntry(data.hash,data.event,data.domain);
});