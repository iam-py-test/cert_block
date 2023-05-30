"use strict";

var rulesta = document.getElementById("rules");
var disabled_domains = document.getElementById("disabled_domains");

(async () => {
    rulesta.value = await getStorage("rules", []);
    disabled_domains.value = (await getStorage("disabled_domains", [])).join("\n");
})();

document.getElementById("reload").addEventListener("click",async function(){
    rulesta.value = await getStorage("rules", []);
    disabled_domains.value = (await getStorage("disabled_domains", [])).join("\n")
});
document.getElementById("save").addEventListener("click",function(){
    browser.storage.local.set({"rules":rulesta.value.split("\n"),"disabled_domains":disabled_domains.value.split("\n")});
    browser.runtime.sendMessage("update");
});
document.getElementById("reset").addEventListener("click",function(){
    browser.storage.local.remove("disabled_domains");
    browser.storage.local.remove("rules");
    browser.storage.local.set({"rules":[]});
    browser.storage.local.set({"disabled_domains":[]});
    browser.runtime.reload();
})
