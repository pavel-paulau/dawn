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

	$.get('api/v1/descriptions', function(data) {
		data.forEach(function(element) {
			descriptions.push(element);
		});
	})
	.done(function() {
		$.each(descriptions, function(i, element) {
			$.get('api/v1/results', {description: element.description, title: element.test_title}, function(results) {
				var rows = [];
				for (var j = 0; j < results.length; j++) {
					rows.push([results[j].build, results[j].value]);
				}

				if (element.test_title.indexOf(element.description) !== -1) {
					chartOptions.title = element.test_title;
				} else if (element.description.indexOf(element.test_title) !== -1) {
					chartOptions.title = element.description;
				} else {
					chartOptions.title = element.description + ", " + element.test_title;
				}

				var div = document.createElement('div');
				div.id = 'chart_div_' + i;
				$('#charts').append(div);

				var chartData = new google.visualization.DataTable();
				chartData.addColumn('string');
				chartData.addColumn('number');
				chartData.addRows(rows);

				var chart = new google.visualization.LineChart(document.getElementById(div.id));
				chart.draw(chartData, chartOptions);
			})
		});
	});
}
