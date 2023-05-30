"use strict";
const enable_button = document.getElementById("enabled");

(async () => {
    let disabled_domains = await getStorage("disabled_domains", []);
    let cdomain = getSafeDomain((await getCurrentTab()).url);
    document.getElementById("csite").textContent = cdomain;
    if(disabled_domains.includes(cdomain)){
        enable_button.textContent = "Disabled";
    }
    else{
        enable_button.textContent = "Enabled";
    }
})()

enable_button.addEventListener("click", async function(){
    let disabled_domains = await getStorage("disabled_domains", []);
    console.log(disabled_domains);
    let cdomain = getSafeDomain((await getCurrentTab()).url);
    if(disabled_domains.includes(cdomain)){
        let enddomains = [];
        disabled_domains.forEach(function(d){ // I don't like this; it isn't a great solution
            console.log(d);
            if(d !== cdomain && d !== ""){
                enddomains.push(d);
            }
        })
        disabled_domains = enddomains;
    }
    else{
        disabled_domains.push(cdomain);
    }
    if(disabled_domains.includes(cdomain)){
        enable_button.textContent = "Disabled";
    }
    else{
        enable_button.textContent = "Enabled";
    }
    console.log(disabled_domains);
    browser.storage.local.set({"disabled_domains": disabled_domains});
    browser.runtime.sendMessage('update_disabled_list');
})
