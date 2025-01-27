var mouseX = 0;
var mouseY = 0;
$(function() {
	$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
	try { startApplication("page_register"); }catch(ex) { }
	initialApplication();
});
function initialApplication() {
	setupComponents();
	setupAlertComponents();
}
function setupComponents() {
	$("#submitbutton").click(function() { 
		send();
		return false;
	});
	$("#loginlink").click(function() { loginLinkClick(); });
}
function clearingFields() {
	$("#registmail_label").html("");
	register_form.reset();
}
function validForm() {
	clearAlerts();
	var validator = null;
	if($.trim($("#site").val())=="") {
		$("#site").parent().addClass("has-error");
		$("#site_alert").show();
		if(!validator) validator = "site";
	}
	if($.trim($("#email").val())=="") {
		$("#email").parent().addClass("has-error");
		$("#email_alert").show();
		if(!validator) validator = "email";
	}
	if($.trim($("#usernaming").val())=="") {
		$("#usernaming").parent().addClass("has-error");
		$("#usernaming_alert").show();
		if(!validator) validator = "usernaming";
	}
	if(validator) {
		$("#"+validator).focus();
		setTimeout(function() { 
			$("#"+validator).parent().addClass("has-error");
			$("#"+validator+"_alert").show();
		},100);
		return false;
	}
	return true;
}
function send(aform) {
	if(!aform) aform = register_form;
	if(!validForm()) return false;
	let email = $("#email").val();
	let naming = $("#usernaming").val();
	let name = naming;
	let surname = "";
	let idx = naming.indexOf(" ");
	if(idx>0) {
		name = naming.substring(0,idx).trim();
		surname = naming.substring(idx+1).trim();
	}
	let formdata = {
		site: $("#site").val(),
		email : email,
		username : email,
		usertname : name,
		usertsurname : surname,
		userename : name,
		useresurname: surname,
		displayname: naming,
	};
	console.log("register data:",formdata);
	//confirmSend(function() {
		startWaiting();
		jQuery.ajax({
			url: API_URL+"/api/register/insert",
			type: "POST",
			data: formdata,
			dataType: "html",
			contentType: defaultContentType,
			error : function(transport,status,errorThrown) { 
				submitFailure(transport,status,errorThrown); 
			},
			success: function(data,status,transport){ 
				stopWaiting();
				$("#registmail_label").html(email);
				$("#page_register").hide();
				$("#page_register_success").show();
				/*
				sendsucces(function() {
					$("#page_register").hide();
					$("#page_register_success").show();
				});	*/
			}
		});	
	//});
	return false;
}
function sendsucces(callback,params) {
	alertbox("QS0204",callback,null,params);	
}
function loginLinkClick() {
	try {
		window.parent.logInClick();
		return;
	} catch(ex) {
		window.open(BASE_URL+"/index","_self");
	}	
}
