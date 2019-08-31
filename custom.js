$(document).ready(function(e){
	$("#divLoading").show();
	const api = "http://api.metawealth.in:8000/api/v1/invest/instrumentslist/liquid/?format=json";
	$.ajax({
		url : api,
		method : "GET",
		data : null,
		dataType : "json",
		success:function(data)
		{
			var details = "";
			var tradingsymbol_details = "";
			var i = 0;
				details +="<option value=''>~Select Name~</option>";
			for(var i=0;i<data['instruments'].length;i++)
			{
				details +="<option value='"+data['instruments'][i]['tradingsymbol']+"'>"+data['instruments'][i]['name']+"</option>";
				tradingsymbol_details +="<div id='"+data['instruments'][i]['tradingsymbol']+"' style='display:none;' class='hide'>"+
											"<table class='table table-striped table-bordered table-hover table-sm text-center'>";
					for(var key in data['instruments'][i])
					{
						tradingsymbol_details +="<tr>"+
													"<td><b>"+toTitleCase(key.replace(/\_/g,' '))+"</b></td>"+
													"<td>"+data['instruments'][i][key]+"</td>"+
												"</tr>";
					}
				tradingsymbol_details +=	"</table>"+
										"</div>";
			}
			$("#tradingsymbol").html(details);
			$("#tradingsymbol_details").html(tradingsymbol_details);
			$("#divLoading").hide();
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(thrownError);
			$("#divLoading").hide();
		}
	});
	$("#btn_fetch_graph").click(function(e){
		$(".hide").each(function(){
			$(this).css("display", "none");
		});
		var tradingsymbol = $("#tradingsymbol").val();
		if(tradingsymbol == "")
		{
			alert("Please Select a Name");
		}
		else
		{
			$("#divLoading").show();
			var dataPoints = [];
			var options =  {
				animationEnabled: true,
				theme: "light2",
				zoomEnabled: true,
				title: {
					text: "Price History",
					titleFontSize: 20,
				},
				axisX: {
					valueFormatString: "DD-MM-YY",
				},
				axisY: {
					title: "INR",
					titleFontSize: 15,
					includeZero: false
				},
				data: [
					{
					type: "spline", 
					yValueFormatString: "RS #,###.##",
					dataPoints: dataPoints
					}
				]
			};
			function addData(data)
			{
				$("#Divgraph").show();
				if(data['history'].length > 0)
				{
					for (var i = 0; i < data['history'].length; i++) {
						var dateeee = data['history'][i]['date'].replace(/\-/g,'.');
						var price = parseFloat(data['history'][i]['price']);
						dataPoints.push({
							x: (new Date(dateeee).getTime() * 1000),
							y: price
						});
					}
					$("#chartContainer").CanvasJSChart(options);
					$("#divLoading").hide();
				}
				else
				{
					$("#divLoading").hide();
					$("#Divgraph").hide();
					alert("No Price History Found");
				}
				$("#"+tradingsymbol).show();
			}
			$.getJSON("http://api.metawealth.in:8000/api/v1/invest/history/"+tradingsymbol+"/?format=json", addData);
		}
	});
});
function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}