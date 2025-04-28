var mouseX = 0;
var mouseY = 0;
$(function(){
	$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
	try { startApplication("forumlog"); }catch(ex) { }
	initialApplication();
});
function initialApplication() {
	setupComponents();
}
function setupComponents() {
	$("#searchbutton").click(function(evt) { 
		resetFilters();
		search(); 
		return false;
	});
	$("#resetbutton").click(function(evt) { 
		clearingFields(); 
		return false;
	});
}
function resetFilters() {
	try {
		fssearchform.page.value = "1";
		fssearchform.orderBy.value = "";
		fssearchform.orderDir.value = "";
	} catch(ex) { }
}
function clearingFields() {
	fssearchform.reset();
	$("#datatablebody").empty();
	$("#fschapterlayer").empty();
}
function search(aform) {
	if(!aform) aform = fssearchform;
	let formdata = serializeDataForm(aform);
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/forumlog/search",
		data: formdata.jsondata,
		headers : formdata.headers,
		type: "POST",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) { 
			submitFailure(transport,status,errorThrown);  
		},
		success: function(data,status,transport){ 
			searchComplete(transport,data);
		}
	});	
}
function searchComplete(xhr,data) {
	$("#listpanel").data("searchfilters",createParameters(fssearchform));
	stopWaiting();
	$("#listpanel").html(data);
	setupDataTable();
}
function submitChapter(aform,index) {
	let formdata = serializeDataForm(aform, $("#listpanel").data("searchfilters"));
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/forumlog/search",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		contentType: defaultContentType,
		dataType: "html",
		error : function(transport,status,errorThrown) { 
			submitFailure(transport,status,errorThrown);  
		},
		success: function(data,status,transport){ 
			stopWaiting();
			$("#listpanel").html(data); 
			setupDataTable();
		}
	});
}
function submitOrder(src,sorter) {
	let aform = fssortform;
	aform.orderBy.value = sorter;
	let fs_params = fetchParameters($("#listpanel").data("searchfilters"));
	let formdata = serializeDataForm(aform, $("#listpanel").data("searchfilters"));
	startWaiting();
	jQuery.ajax({
		url: API_URL+"/api/forumlog/search",
		data: formdata.jsondata,
		headers: formdata.headers,
		type: "POST",
		contentType: defaultContentType,
		dataType: "html",
		error : function(transport,status,errorThrown) { 
			submitFailure(transport,status,errorThrown);  
		},
		success: function(data,status,transport){ 
			stopWaiting();
			$("#listpanel").html(data); 
			setupDataTable();
		}
	});
	return false;
}
function setupDataTable() {
	setupPageSorting("datatable",submitOrder);
	setupPagination("fschapterlayer",submitChapter,fschapterform,fssearchform);
}
