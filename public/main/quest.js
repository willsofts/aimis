var forum_id = "";
$(function() {
	buildModelers("#modellayer","quest");
	$('#questform').submit(function() {
		if($('#query').val().trim()=="") {
			$('#query').focus();
			return false;
		}
		sendQuery($('#query').val());
		$('#query').val('');
		return false;
	});
	$('#query').bind("keypress",function(e){
		if ((e.keyCode || e.which) == 13) {
			$('#questform').trigger("submit");
			return false;
		}
	}).bind("focus",function() { 
		$("#queryinputlayer").addClass("input-focus");
	}).bind("blur",function() {
		$("#queryinputlayer").removeClass("input-focus");
	}).focus();
	$("#clearlinker").click(function() { $("#listmessages").empty(); });
	$("#addforumlinker").click(function() { 
		//window.open("/gui/forum/entry","table_info_window"); 
		open_program("forum","",null,"/gui/forum/entry",true);
	});
	$("#speechbutton").click(function() { 
		$("#queryinputlayer").addClass("input-focus");
		try { recognition.start(); } catch(ex) { } 
		return false; 
	});
	$("#queryspeechlang").click(function() { 
		$("#queryinputlayer").addClass("input-focus");
		//try { console.log("recognition.stop ..."); recognition.stop(); } catch(ex) { }
		if($(this).text() == "EN") {
			$(this).text("TH");
			changeRecognitionLanguage("th");
		} else {
			$(this).text("EN");
			changeRecognitionLanguage("en");
		}
	});
	const params = new URLSearchParams(window.location.search);
	if(params.has("forumid")) forum_id = params.get("forumid");
	setupCategories();
	bindingSettings();
	loadCategories(forum_id);
	checkOllamaConnection();
});
function buildModelers(container="#modellayer",category="quest") {
	let layer = $(container);
	if(model_categories) {
		let model_quest = model_categories[category];
		model_quest.reverse().forEach((item,index) => {
			let alink = $('<a href="#0" tabindex="-1"></a>');
			let input = $('<input type="radio" name="model" id="model_'+index+'" value="'+item.model+'" data-agent="'+item.agent+'"></input>');
			if(item.default) input.prop("checked",item.default);
			if(item.disabled) input.prop("disabled",item.disabled);
			if(item.class) input.addClass(item.class);
			let label = $('<label for="model_'+index+'"></label>');
			label.html(item.name);
			alink.append(input).append(label);
			layer.prepend(alink);
		});
	}
}
function sendQuery(quest) {
	let li = $('<li>').addClass("fxc li-topic").append($('<span>').addClass("topic topic-quest").text("Question")).append($('<span>').addClass("text text-quest").text(quest));
	$('#listmessages').append(li);
	$(".input-ask").prop('disabled', true);
	questmessages.scrollTo(0,questmessages.scrollHeight);
	$("#waitlayer").show();
	let cat = $("input[name='category']:checked").val();
	let model = $("input[name='model']:checked").val();
	let agent = $("input[name='model']:checked").attr("data-agent");
	let authtoken = getAccessorToken();
	jQuery.ajax({
		url: API_URL+"/api/chat/quest",
		data: {category: cat, model: model, query: quest, agent: agent},
		headers : { "authtoken": authtoken },
		type: "POST",
		dataType: "html",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		error : function(transport,status,errorThrown) {
			$("#waitlayer").hide();
			let err = $('<li>').addClass("fxc").append($('<span>').addClass("topic topic-error").text("Error")).append($('<span>').addClass("text text-error").text(errorThrown));
			$('#listmessages').append(err);
			$(".input-ask").prop('disabled', false);
			$('#query').focus();
		},
		success: function(data,status,transport) {
			$("#waitlayer").hide();
			let json = $.parseJSON(data);
			if(json) {
				displayQueryAnswer(json.query, json.answer, json.error);
				displayDataSet(json.dataset);
			}
			$(".input-ask").prop('disabled', false);
			questmessages.scrollTo(0,questmessages.scrollHeight);
			$('#query').focus();
		}
	});	
}
function displayQueryAnswer(query, answer, error) {
	let span = $('<span>').addClass("typed-out").attr("style","--n:"+answer.length).text(answer);
	let txt =  $('<div>').addClass(error?"typed-container text text-error":"typed-container text text-success").append(span);
	let ans = $('<li>').addClass("fxc").append($('<span>').addClass("topic topic-answer").text("Answer")).append(txt);
	let qry = $('<li>').addClass("fxc li-query").append($('<span>').addClass("topic topic-query").text("Query")).append($('<span>').addClass("text text-query").text(query));
	let queryboxchk = $("#querybox").is(":checked");
	if(!queryboxchk) qry.addClass("fa-hidden");
	$('#listmessages').append(qry).append(ans);
}
function displayDataSet(data) {
	if(data && data.length>0) {
		let dsboxchk = $("#datasetbox").is(":checked");
		let div = $('<div>').addClass("text text-answer table-responsive");
		let li = $('<li>').addClass("fxc li-dataset").append($('<span>').addClass("topic topic-answer").text("")).append(div);
		if(!dsboxchk) li.addClass("fa-hidden");
		$('#listmessages').append(li);
		let table = $('<table>').addClass("tables table-data table-bordered");
		let rowhead = $('<tr>');
		let first = data[0];
		for(let key in first) {
			rowhead.append($('<th>').text(key));
		}
		table.append($('<thead>').append(rowhead));
		let tbody = $('<tbody>');
		$(data).each(function(index, item) {
			let tr = $('<tr>');
			for(let key in item) {
				tr.append($('<td>').text(item[key]));
			}
			tbody.append(tr);
		});
		table.append(tbody);
		div.append(table);
	}
}
function setupCategories(categories) {
	buildCategories(categories);
	setupSelectedCategories(categories);
}
function setupSelectedCategories(categories) {
	$("label.label-cat").each(function(index,element) {
		$(element).click(function() {
			$("label.label-cat").removeClass("cat-selected").closest("div").find("label.cat-pointer").html("&#160;&#160;");
			$(this).addClass("cat-selected").closest("div").find("label.cat-pointer").html("&#187;");
			buildExamples($(this).closest("div").find("input[name='category']").val(),categories);
		});
	});
	buildExamples($("input[name='category']:checked").val(),categories);
}
function buildCategories(categories) {
	if(!categories) categories = system_categories;
	let ul = $("#categorylisting").empty();
	for(let cat in categories) {
		let info = categories[cat];
		let catname = info.title.replaceAll(' ','').toLowerCase();
		let li = $('<li>');
		let div = $('<div>').addClass("category-info");
		let pointer = $('<label>').addClass("cat-pointer").html("&#160;&#160;");
		let input = $('<input>').attr({type: "radio", class: "cat-radio", name: "category", id: cat, value: cat});
		let span = $('<span>').addClass("span-cat").append(pointer).append(input);
		let label = $('<label>').addClass("label-cat").attr("for",cat).text(info.title);
		if(info.selected) {
			pointer.html("&#187;");
			input.attr("checked","checked");
			label.addClass("cat-selected");
		}
		//div.append(span).append(label);
		let table = $('<table>').addClass("table-cat");
		let tr = $('<tr>');
		let td1 = $('<td>').addClass("first");
		let td2 = $('<td>').addClass("second");
		td1.append(span);
		td2.append(label);
		tr.append(td1).append(td2);
		table.append(tr);
		div.append(table);
		let menu = $('<div>').addClass("menu dropdown cat-menu");
		let m = $('<span>').addClass("m dropbtn").html("&#8942;");
		let content = $('<div>').addClass("dropdown-content cat-content");
		let link1 = $('<a>').attr("href","#0").addClass("info-linker").attr("data-cat",cat).text("Setting");
		let link2 = $('<a>').attr("href","#0").addClass("info-downloader").attr("data-cat",cat).attr("target","table_info_window").attr("download",catname+"_schema.sql").text("Download");
		let link3 = $('<a>').attr("href","#0").addClass("info-history").attr("data-cat",cat).attr("data-title",info.title).text("History");
		let link4 = $('<a>').attr("href","#0").addClass("info-reset").attr("data-cat",cat).attr("data-title",info.title).text("Reset");
		link1.click(function() {
			let cat = $(this).attr("data-cat");
			open_program("forum","","forumid="+cat,"/gui/forum/view",true);
			return false;
		});
		link2.click(function() {
			let cat = $(this).attr("data-cat");
			let url = "/api/tableinfo/html?category="+cat;
			$(this).attr("href",url);
		});
		link3.click(function() {
			let cat = $(this).attr("data-cat");
			let title = $(this).attr("data-title");
			open_program("chathistory","","query="+cat+"&title="+title,"/gui/chat/view",true);
			return false;
		});
		link4.click(function() {
			let cat = $(this).attr("data-cat");
			confirmResetCategory(cat,$(this).attr("data-title"));
			return false;
		});
		content.append(link1).append(link2).append(link3).append(link4);
		menu.append(m).append(content);
		li.append(div).append(menu);
		ul.append(li);
	}
}
function buildExamples(cat,categories) {
	if(!categories) categories = system_categories;
	console.log("buildExamples",cat);
	let info = categories[cat];
	let ul = $("#examplelisting").empty();
	if(!info) return;
	$(info.questions).each(function(index,element) {
		let li = $('<li>').text(element.question);
		ul.append(li);
		li.click(function() { 
			$("#query").val(li.text()).focus();
		});
	});
}
function bindingCategories() {
	$("a.info-linker").each(function(index,element) {
		$(element).click(function() {
			let cat = $(this).attr("data-cat");
			$("#infocategory").val(cat);
			$("#infoform").submit();
			return false;
		});
	});
	$("a.info-downloader").each(function(index,element) {
		$(element).click(function() {
			let cat = $(this).attr("data-cat");
			let url = "/api/tableinfo/html?category="+cat;
			$(this).attr("href",url);
		});
	});
}
function bindingSettings() {
	$("#querybox").change(function() {
		let chk = $(this).is(":checked");
		$("li.li-query").each(function(index,element) {
			if(chk) $(element).removeClass("fa-hidden");
			else $(element).addClass("fa-hidden");
		});
	});
	$("#datasetbox").change(function() {
		let chk = $(this).is(":checked");
		$("li.li-dataset").each(function(index,element) {
			if(chk) $(element).removeClass("fa-hidden");
			else $(element).addClass("fa-hidden");
		});
	});
}
function loadCategories(forumid) {
	if(!forumid) forumid = "";
	$("#waitlayer").show();
	let authtoken = getAccessorToken();
	jQuery.ajax({
		url: API_URL+"/api/forum/list",
		type: "POST",
		data: {group: "DB", forumid: forumid},
		headers : { "authtoken": authtoken },
		dataType: "html",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		error : function(transport,status,errorThrown) {
			$("#waitlayer").hide();
		},
		success: function(data,status,transport) {
			$("#waitlayer").hide();
			let json = $.parseJSON(data);
			if(json) {
				if(json.body.dataset) {
					setupCategories(json.body.dataset);
				}
			}
		}
	});	
}
function checkOllamaConnection(){
	try {
		let authtoken = getAccessorToken();
		jQuery.ajax({
			url: API_URL+"/api/fetch/ollamacheck",
			headers : { "authtoken": authtoken },
			type: "GET",
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			error : function(transport,status,errorThrown) {
				console.log(data);
				console.log(status);
			},
			success: function(data,status,transport) {
				console.log("checkOllamaConnection",data);
				if (data.body && data.body.data){
					if (data.body.data.trim().toLowerCase()=="ollama is running"){
						$("input",$("#modellayer")).each(function(index,element) {
							let e = $(element);
							if(e.hasClass("llama")) {
								e.removeAttr("disabled");
							}
						});
					}
				}
			}
		});
	}
	catch (error) {
		console.log(`checkOllamaConnection error: ${error}`);
		console.log(error);
	}
}
function getConfig() { 
	let authtoken = getAccessorToken();
	return jQuery.ajax({
		url: API_URL+"/api/fetch/config?name=API_OLLAMA_HOST",
		headers : { "authtoken": authtoken },
		type: "POST",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		error : function(transport,status,errorThrown) {
		},
		success: function(data,status,transport) {
		}
	});
} 


let blinker;
function blinking() {
    $('#blinker').fadeOut(500);
    $('#blinker').fadeIn(500);
}
function createRecognition(lang) {
	if(!lang) lang = 'th';
	let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
	recognition.lang = lang;
	recognition.onstart = function() {
		console.log("recognition start: lang="+recognition.lang);
		blinker = setInterval(blinking, 1000);
	};
	recognition.onresult = function(event) {
		const transcript = event.results[0][0].transcript;
		$("#query").val(transcript);
	};
	recognition.onend = function() {
		console.log("recognition end: lang="+recognition.lang);
		if(blinker) clearInterval(blinker);
	};
	return recognition;
}
const recognition = createRecognition('th');
function changeRecognitionLanguage(newLang) {
    try { console.log("change recognition language : "+newLang); recognition.stop(); } catch(ex) { }
    recognition.lang = newLang;
}
function confirmResetCategory(cat,title) {
	if(!confirm("Do you want to reset "+title+" ?")) return false;
	let authtoken = getAccessorToken();
	jQuery.ajax({
		url: API_URL+"/api/chat/reset",
		data: {category: cat},
		headers : { "authtoken": authtoken },
		type: "POST",
		dataType: "html",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		error : function(transport,status,errorThrown) {
			$("#waitlayer").hide();
			let err = $('<li>').addClass("fxc").append($('<span>').addClass("topic topic-error").text("Error")).append($('<span>').addClass("text text-error").text(errorThrown));
			$('#listmessages').append(err);
			$(".input-ask").prop('disabled', false);
			$('#query').focus();
		},
		success: function(data,status,transport) {
			$("#waitlayer").hide();
			let json = $.parseJSON(data);
			if(json) {
				displayQueryAnswer(json.query+" "+title, json.answer, json.error);
			}
			questmessages.scrollTo(0,questmessages.scrollHeight);
		}
	});	
}
