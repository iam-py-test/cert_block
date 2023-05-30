var global = {
    "block_rules":[],
    "settings":{
        "enabled":true // TODO
    },
    "disabled_domains":[]
};

browser.runtime.onMessage.addListener(async function(data){
    console.log(data);
    if(data === "update"){
        global["block_rules"] = await getStorage("rules", []);
    }
    if(data === "disable"){
        global["settings"]["enabled"] = false;
    }
    if(data === "enable"){
        global["settings"]["enabled"] = true;
    }
    if(data === "update_disabled_list"){
        global["disabled_domains"] = await getStorage("disabled_domains", []);
    }
});

browser.webRequest.onHeadersReceived.addListener(async function(req){
        try{
            if(global["settings"]["enabled"] === false){
                return {cancel:false};
            }
            var event_msg = "not filtered";
            var domain = getSafeDomain(req.url);
            if(global["disabled_domains"].includes(domain)){
                return {cancel: false};
            }
            if(global["block_rules"].length === 0 || typeof global["block_rules"] !== "object"){
                global["block_rules"] = await getStorage('rules', []);
            }
            let blocked = false;
            console.log(req);
            if(isHTTPS(req.url)){
                let secinfo = await browser.webRequest.getSecurityInfo(req.requestId, {certificateChain: true});
                console.log(secinfo);
                var blocked_hash = "";
                let cert = secinfo.certificates[0];
                console.log(cert);
                let hash = cert.fingerprint.sha256;
                console.log(hash);
                blocked_hash = hash;
                if(global["block_rules"].includes(hash)){
                    blocked = true;
                }
                if(global["block_rules"].includes(cert.fingerprint.sha1)){
                    blocked = true;
                    blocked_hash = cert.fingerprint.sha1;
                }
                event_msg = blocked ? "blocked":"not blocked";
            }
            else{
                event_msg = "not filtered"
                blocked_hash = "not HTTPS"
            }
            
            console.log(blocked);
            try{
                browser.runtime.sendMessage({
                    "event": event_msg,
                    "hash": blocked_hash,
                    "domain":domain,
                    "url": req.url
                });
            }
            catch(err){}
            
            return {cancel: blocked};
        }
        catch(err){
            console.error(err);
            return {cancel:false}
        }        
},{"urls":["<all_urls>"]},["blocking"]
);