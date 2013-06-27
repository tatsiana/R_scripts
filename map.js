
var width = 960,
    height = 500,
    centered;

var projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);

var rateById = d3.map();

function quantizeTest (num) {
    if(num < 21){return "q0-9";}
    else if(20< num && num< 37){return "q1-9";}
    else if(36< num && num< 51){return "q2-9";}
    else if(50< num && num< 86){return "q3-9";}
    else if(85< num && num< 116){return "q4-9";}
    else if(115< num && num< 161){return "q5-9";}
    else if(161< num && num< 241){return "q6-9";}
    else if(240< num && num< 391){return "q7-9";}
    else if(390< num){return "q8-9";}
    };
var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").select("#mapArea").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);
    var g = svg.append("g");
  queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "total_data_by_county.csv", function(d) { rateById.set(d.id, +d.rate); })
    .await(ready);

function ready(error,us){
g.append("g")
    .attr("id", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("class", function (d) {
		return quantizeTest(rateById.get(d.id));
    })
    .attr("d", path);

g.append("g")
    .attr("id", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
	.style("fill", "1e-6")
    //.style("fill-opacity", "1e-6")
    .attr("d", path)
	.on("click", clicked);

g.append("path")
    .datum(topojson.mesh(us, us.objects.counties, function (a, b) {
        return a !== b;
    }))
    .attr("id", "county-borders")
    .attr("d", path);

g.append("path")
    .datum(topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
    }))
    .attr("id", "state-borders")
    .attr("d", path);
  }
	
function clicked(d) {
    var x, y, k;

    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }
    g.selectAll("path")
        .classed("active", centered && function (d) {
            return d === centered;
        });

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}
