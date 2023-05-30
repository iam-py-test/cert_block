"use strict";

var rulesta = document.getElementById("rules");

(async () => {
    rulesta.value = await getStorage("rules", []);
})();

document.getElementById("reload").addEventListener("click",async function(){
    rulesta.value = await getStorage("rules", []);
});
document.getElementById("save").addEventListener("click",function(){
    browser.storage.local.set({"rules":rulesta.value.split("\n")});
    browser.runtime.sendMessage("update");
});
