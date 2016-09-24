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
    velocity: Math.random() * 2,
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

var force = d3.layout.force()
  .gravity(0)
  .charge(0)
  .nodes(nodes)
  .size([width, height]);

force.on('tick', function() {
  var q = d3.geom.quadtree(nodes);
  var i = 0;
  n = nodes.length;

  // iterate over each node and make it move
  // per its velocity

  q.visit(move);
  svg.selectAll('circle')
    .attr('cx', function(d) { return d.x; } )
    .attr('cy', function(d) { return d.y; } );
  force.resume(); // prevent "cooling down" freezing
});

var move = function(quad, x1, y1, x2, y2) {
  quad.point.x += Math.cos(quad.point.direction) * quad.point.velocity;
  quad.point.y += Math.sin(quad.point.direction) * quad.point.velocity;
  // check for collisons
  if (quad.point.x < 0 || quad.point.x > width) {
    // undo the last change
    quad.point.x = quad.point.px;
    // figure out a new direction
    quad.point.direction = Math.PI - quad.point.direction;
    quad.point.x += Math.cos(quad.point.direction) * quad.point.velocity;
  }

  if (quad.point.y < 0 || quad.point.y > height) {
    //debugger;
    quad.point.y = quad.point.py;
    quad.point.direction = 2* Math.PI - quad.point.direction;
    quad.point.y += Math.sin(quad.point.direction) * quad.point.velocity;
  }

  //return true;
};

force.start();