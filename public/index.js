"use strict";

document.getElementById("sj-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var address = document.getElementById("sj-address").value;
    if (!address) return;
    
    if (!/^https?:\/\//i.test(address)) {
        address = "https://" + address;
    }
    
    // Use the hidden prefix and XOR encoding
    var url = "/api/fetch/" + Ultraviolet.codec.xor.encode(address);
    
    var frame = document.getElementById("sj-frame");
    if (!frame) {
        frame = document.createElement("iframe");
        frame.id = "sj-frame";
        frame.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; border:none; z-index:9999; background:white;";
        document.body.appendChild(frame);
    }
    
    frame.src = url;
});
