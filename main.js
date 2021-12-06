var data1 =[{name:'iPhone',size:0.16},
{name:'3G',size:0.2},
{name:'3GS',size:0.2},
{name:'4/4S',size:0.38},
{name:'5',size:0.33},
{name:'5C',size:0.26},
{name:'5S/SE',size:0.3},
{name:'6',size:0.41},
{name:'6 Plus',size:0.47},
{name:'6S',size:0.41},
{name:'6S Plus',size:0.47},
{name:'7',size:0.58},
{name:'7 Plus',size:0.9},
{name:'8',size:0.58},
{name:'8 Plus',size:0.82},
{name:'X',size:2.21},
{name:'XR',size:0.94},
{name:'XS Max',size:2.19},
{name:'11',size:2.3},
{name:'11 Pro Max',size:3.57},
{name:'SE(gen2)',size:0.58},
{name:'12',size:2.3},
{name:'12 Pro',size:3.66},
{name:'12 Pro Max',size:4.7},
{name:'13',size:2.95},
{name:'13 Pro/Pro Max',size:5.69}]

var data2 =[{name:'iPhone',size:0.16},
{name:'3G',size:0.2},
{name:'3GS',size:0.2},
{name:'4S',size:0.38},
{name:'5S',size:0.3},
{name:'6 Plus',size:0.47},
{name:'6S Plus',size:0.47},
{name:'7 Plus',size:0.9},
{name:'8 Plus',size:0.82},
{name:'X',size:2.21},
{name:'XS Max',size:2.19},
{name:'11 Pro Max',size:3.57},
{name:'12 Pro Max',size:4.7},
{name:'13 Pro/Pro Max',size:5.69},]

//any better way to impert data??

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


// Initialise a X axis:
var xScale = d3.scalePoint()
  .domain(data1.map(function(d) {
      return d.name
  }))
  .range([50, width - 50])
  .padding(0.5);
var xAxis = d3.axisBottom(xScale);
svg.append("g")
  .attr("transform", "translate(0,310)")
  .attr("class","myXaxis")

// Initialize an Y axis
var yScale = d3.scaleLinear()
  .domain([0, d3.max(data1, function(d) {
      return d.size
  }) * 1.1])
  .range([height - 50, 10]);
var yAxis = d3.axisLeft(yScale);
svg.append("g")
  .attr("transform", "translate(50,0)")
  .attr("class","myYaxis")

//y axis lable
svg.append("text")
.transition()
    .duration(3000)
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("dy", ".75em")
    .attr("dx", "-3em")
    .attr("transform", "rotate(-90)")
    .text("Camera Module Size(cm^2)");

//update
function update(data) {

// Create the X axis:
xScale.domain(data.map(function(d){return d.name;}));
svg.selectAll(".myXaxis").transition()
    .duration(3000)
    .call(xAxis);
  

// Create the Y axis:
yScale.domain([0, d3.max(data1, function(d) { return d.size }) * 1.1]);
svg.selectAll(".myYaxis")
    .transition()
    .duration(3000)
    .call(yAxis);

//create a lisener rect
svg
    .append('rect')
    .style("fill", "blue")
    .style("pointer-events", "all")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr('width', width - margin.left - margin.right - 20)
    .attr('height', height - margin.top - margin.bottom - 20)
    .style("opacity", 0)
     .on('mouseover', mouseover)
     .on('mousemove', mousemove)
     .on('mouseout', mouseout);

// Create the circle that travels along the curve of chart
var focus = svg
.append('g')
.append('circle')
  .style("fill", "none")
  .attr("stroke", "black")
  .attr('r', 4)
  .style("opacity", 0)

// Create the text that travels along the curve of chart
var focusText = svg
.append('g')
.append('text')
  .style("opacity", 0)
  .attr("text-anchor", "left")
  .attr("alignment-baseline", "middle")


//update value
var u = svg.selectAll(".lineTest")
    .data([data], function(d){ return d.name });

u
    .enter()
    .append("path")
    .attr("class","lineTest")
    .merge(u)
    .transition()
    .duration(3000)
    .attr("d", d3.line()
      .x(function(d) { return xScale(d.name); })
      .y(function(d) { return yScale(d.size); }))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2.5)

// What happens when the mouse move -> show the annotations at the right positions.
function mouseover() {
        focus.style("opacity", 1)
        focusText.style("opacity",1)
      }

function mouseout() {
        focus.style("opacity", 0)
        focusText.style("opacity", 0)
      }

function mousemove() {
        var xPos = d3.mouse(this)[0]
        var domain = xScale.domain()
        var range = xScale.range()
        var rangePoints = d3.range(range[0], range[1], xScale.step())
        var yPos = domain[d3.bisect(rangePoints, xPos)]
        var size = 0;
        data.forEach(function(element) {
          if (element.name == yPos) {
              size = element.size
          }
      })
        focus
        .attr("cx", xScale(yPos))
        .attr("cy", yScale(size))
        focusText
      .html("" + yPos   )
      .attr("x", xScale(yPos)-15)
      .attr("y", yScale(size)-15)
      }

 }

update(data1)