// start slingin' some d3 here.
var width = 800;
var height = 640;

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('rect').attr('width', width)
  .attr('height', height).attr('stroke', 'blue')
  .attr('stroke-width', '5px');

var nodes = d3.range(1).map(function() {
  return {
    radius: Math.random() * 10 + 5,
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
    velocity: Math.random() * 10,
    direction: Math.random() * 2 * Math.PI
  };
});

svg.selectAll('circle')
  .data(nodes)
  .enter().append('circle')
  .attr('r', function(d) { return d.radius; })
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .style('fill', function(d, i) { return 'hsl(' + Math.random() * 360 + ', 50%, 50%)'; });