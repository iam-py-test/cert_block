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

async function getCurrentTab(){
    return (await browser.tabs.query({active:true,currentWindow:true}))[0]
}
