var config = {
    connStringLocal : "http://unisvc-srvr/hrservices/api/",
    connStringPublic : "https://svc.unifrutti.net.ph/hrservices/api/",
    // connStringLocal: "http://localhost:30983/api/",
    // connStringPublic: "http://localhost/ulma/api/",
    connString: "",
    user: "",
    password: "",   
    rootPath: "",
}
    


$(document).ready(function() {
    
    //Check connection
    checkConnectionLocal();

})

function UrlExists(url, cb){

    jQuery.ajax({
        url:      url,
        dataType: 'text',
        type:     'GET',
        complete:  function(xhr){
            $("body").removeClass("loading"); 

            if(typeof cb === 'function') {
               cb.apply(this, [xhr.status]);
            }
        }
    });

}



function checkConnectionLocal() {
    
    UrlExists(config.connStringLocal, function(status) {
        if(status === 200) {
            // -- Execute code if successful --
            config.connString = config.connStringLocal;
            // console.log(config.connString);
            $("#lbl-constatus").html("Local").css("color","green");
        } else if(status === 404) {
            // -- Execute code if not successful --
        }else{
            // -- Execute code if status doesn't match above --
            //Use connection string public
            checkConnectionPublic();
        }
    });
    
}


function checkConnectionPublic(){
    UrlExists(config.connStringPublic, function(status) {
        if(status === 200) {
            // -- Execute code if successful --
            config.connString = config.connStringPublic;    
            // console.log(config.connString);
            $("#lbl-constatus").html("Internet").css("color","green");
        }else{
            // -- Execute code if status doesn't match above --
            //Use connection string public
            $("#lbl-constatus").html("No Connection").css("color","red");
            console.log("Please make sure you are connected in Unifrutti Network or in the Internet");
        }
    });
}



Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

