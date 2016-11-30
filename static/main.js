google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawCharts);

var chartOptions = {
	hAxis: {
		textStyle: {
			fontSize: 12
		},
		slantedText: false,
		maxAlternation: 1
	},
	vAxis: {
		minValue: 0,
		titleTextStyle: {
			italic: false
		},
		textStyle: {
			fontSize: 12
		},
		gridlines: {
        	count: 6
        },
        minorGridlines: {
        	count: 1
        }
	},
	legend: {
		position: 'none',
	},
	chartArea: {
		width: '90%'
	},
	colors: ['#a11'],
	curveType: 'function',
	pointsVisible: true,
	interpolateNulls: false,
	pointShape: 'diamond',
	height: 300
};

function drawCharts() {
	var charts = {};
	var descriptions = [];

	var target = document.getElementById('spinner');
	var spinner = new Spinner({scale: 2}).spin(target);

	$.get('api/v1/descriptions', function(data) {
		data.forEach(function(element) {
			descriptions.push(element);
		});
	})
	.done(function() {
		var allCharts = [];

		var xhrs = [];
		$.each(descriptions, function(i, element) {
			var xhr = $.get('api/v1/results', element, function(results) {
				var rows = [];
				for (var j = 0; j < results.length; j++) {
					rows.push([results[j].build, results[j].value]);
				}

				var title;
				if (element.test_title.indexOf(element.description) !== -1) {
					title = element.test_title;
				} else if (element.description.indexOf(element.test_title) !== -1) {
					title = element.description;
				} else {
					title = element.description + ", " + element.test_title;
				}

				var chartData = new google.visualization.DataTable();
				chartData.addColumn('string');
				chartData.addColumn('number');
				chartData.addRows(rows);

				allCharts[i] = {title: title, data: chartData};
			});

			xhrs.push(xhr);
		});

		$.when.apply($, xhrs).done(function(){
			spinner.stop();
			$("#spinner" ).remove();

			$.each(allCharts, function(i, chart) {
				chartOptions.title = chart.title;

				var div = document.createElement('div');
				div.id = 'chart_div_' + i;
				$('#charts').append(div);

				var lineChart = new google.visualization.LineChart(document.getElementById(div.id));
				lineChart.draw(chart.data, chartOptions);
			});
		});
	});
}
