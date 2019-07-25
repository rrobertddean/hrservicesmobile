$(document).ready(function() {

    //set input date value to today
    $('#inputFrom, #inputTo').val(new Date().toDateInputValue());
 
    //Check connection string if null every 0.5s;
    //Sometimes confing.connString is not rendered yet in function.js
    interval = setInterval(function(){
        if (config.connString != "") {
            clearInterval(interval);

            //Get Leave Types and populate into combobox
            getLeaveTypes();

       }
    },250);
 

})


function getLeaveTypes() {
    $.get(config.connString+"get",
        {
            action: "getLeaveType"
        }
    ).done(function(response,status) {
        var result = JSON.parse(response);
        console.log(result);

        $.each(result,function(i,field){
            $("#leaveType").append("<option value='"+field["LeaveCode"]+"\'>"+field["LeaveCode"]+"</option>");
        })
    })
    .fail(function () {
        $("#lbl-constatus").html("No Connection").css("color","red");
        $("#modalCheckConnection").modal();
    })
}


function submitForm() {
    
   



    var activeTabLeave = $("#pills-leaves").hasClass("active");
    var activeTabObt = $("#pills-obt").hasClass("active");

    var empid = $("#inputEmpId").val();
    var email = $("#inputEmail").val();
    var ltype = $("#leaveType").val();
    var frdate = $("#inputFrom").val();
    var todate = $("#inputTo").val();

    var qdays = $("#inputDurationDays").val();
    var qhrs = $("#inputDurationHours").val();
    var reason = $("#leaveReason").val();
    var approver = $("#inputApprover").val();
    
    var dest = $("#obtDestination").val();
    var purpose = $("#obtPurpose").val();

    var isSatInt;
    var isSat = $("#satCheckbox").prop('checked');
    if (isSat) 
        isSatInt = 1;
    else 
        isSatInt = 0;
    
    var isSunInt;
    var isSun = $("#sunCheckbox").prop('checked');
    if (isSun) 
        isSunInt = 1;
    else 
        isSunInt = 0;
   


    //Leave Application
    if (activeTabLeave) {   

         //validation approver
        if ($.trim($("#inputApprover").val()) == "") {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            $("#lblMessage").html("- Approver cannot be empty").css("color","red");
            return;
        }

        //validation reason
        if ($.trim($("#leaveReason").val()) == "") {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            $("#lblMessage").html("- Reason cannot be empty").css("color","red");
            return;
        }


        
        $.post(config.connString+"post",
            {
                action : "addLeaveTrans",
                empid : empid ,
                email : email ,
                ltype : ltype ,
                frdate : frdate ,
                todate : todate ,
                qdays : qdays ,
                qhrs : qhrs , 
                reason : reason , 
                approver : approver ,
                isSat : isSatInt , 
                isSun : isSunInt
            }
        ).done(function(response,status) {
            if (response =="1") {
                // $("#lblmodalmessage").html("Succesfully submitted leave application").css("color","green");
                // $("#modalMessage").modal("toggle");
                window.location.href="application.html";
            }else {
                $("#lblmodalmessage").html("Database Error").css("color","red");
                $("#modalMessage").modal("toggle");
            }

           

        }).fail(function() {
            $("#lbl-constatus").html("No Connection").css("color","red");
            $("#modalCheckConnection").modal();
        })



    }
    //OBT Application
    else if (activeTabObt) {

        //validation destination
        if ($.trim($("#obtDestination").val()) == "") {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            $("#lblMessage").html("- Destination cannot be empty").css("color","red");
            return;
        }

        //validation purpose
        if ($.trim($("#obtPurpose").val()) == "") {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            $("#lblMessage").html("- Purpose cannot be empty").css("color","red");
            return;
        }



        $.post(config.connString+"post",
            {
                action : "addOBTrans",
                empid : empid ,
                email : email ,
                frdate : frdate ,
                todate : todate ,
                dest : dest,
                purpose: purpose,
                approver : approver ,
                qdays : qdays ,
                qhrs : qhrs , 
                isSat : isSatInt , 
                isSun : isSunInt
            }
        ).done(function(response,status) {
            if (response =="1") {
                // $("#lblmodalmessage").html("Succesfully submitted leave application").css("color","green");
                // $("#modalMessage").modal("toggle");
                window.location.href="application.html";
            }else {
                $("#lblmodalmessage").html("Database Error").css("color","red");
                $("#modalMessage").modal("toggle");
            }

           

        }).fail(function() {
            $("#lbl-constatus").html("No Connection").css("color","red");
            $("#modalCheckConnection").modal();
        })
    }

}