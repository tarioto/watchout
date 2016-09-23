// start slingin' some d3 here.
var width = 800;
var height = 640;

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('rect').attr('width', width)
  .attr('height', height).attr('stroke', 'blue')
  .attr('stroke-width', '5px');