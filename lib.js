"use strict";
/*
various functions
*/
async function getStorage(name,default_value=""){
    try{
        return (await browser.storage.local.get(name))[name] || default_value;
    }
    catch(err){
        return default_value;
    }
}

function getSafeDomain(url){
    try{
        return new URL(url).hostname || url;
    }
    catch(err){
        return url;
    }
}

function isHTTPS(url){
    try{
        return new URL(url).protocol === "https:";
    }
    catch(err){
        return false;
    }
}

function getParty(origin,domain){
    /* this is *very* basic */
    if(origin === ""){
        return "first-party";
    }
    if(origin === domain){
        return "first-party";
    }
    if(domain.endsWith("."+origin)){ // there is a better way
        return "first-party";
    }
    return "third-party";
}

async function getIP(domain){
    if(global.dns_cache[domain]){
        return global.dns_cache[domain];
    }
    else{
        let ipaddrs = (await browser.dns.resolve(domain)).addresses;
        global.dns_cache[domain] = ipaddrs;
        return ipaddrs;
    }
}

async function getCurrentTab(){
    return (await browser.tabs.query({active:true,currentWindow:true}))[0]
}
