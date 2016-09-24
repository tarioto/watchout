// start slingin' some d3 here.
var width = 800;
var height = 640;

var score = [
  {
    name: 'Current score',
    value: 0
  },
  {
    name: 'High score',
    value: 0
  },
  {
    name: 'Collisons',
    value: 0
  }
];

var scoreboard = d3.select('.scoreboard').selectAll('div')
  .data(score).enter().append('div');

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.append('rect').attr('width', width)
  .attr('height', height).attr('stroke', 'blue')
  .attr('stroke-width', '5px');

var nodes = d3.range(11).map(function() {
  return {
    radius: Math.random() * 10 + 5,
    x: Math.floor(Math.random() * width * .75) + .125 * width,
    y: Math.floor(Math.random() * height * .75) + .125 * height,
    velocity: Math.random() + 0.5,
    direction: Math.random() * 2 * Math.PI
  };
});

var player = nodes[0];
player.radius = 25;
player.x = width / 2;
player.y = height / 2;
player.velocity = 0;
player.direction = 0;
player.fixed = true;

var dragmove = function(d) {
  if (d === player) {
    d3.select(this)
      .attr('cx', d.px = Math.max(d.radius, Math.min(width - d.radius, d3.event.x)))
      .attr('cy', d.py = Math.max(d.radius, Math.min(height - d.radius, d3.event.y)));
  }
};


var drag = d3.behavior.drag()
  .origin(function(d) { return d; })
  .on('drag', dragmove);


svg.selectAll('circle')
  .data(nodes)
  .enter().append('circle')
  .attr('r', function(d) { return d.radius; })
  .attr('cx', function(d) { return d.x; })
  .attr('cy', function(d) { return d.y; })
  .style('fill', function(d, i) { return 'hsl(' + Math.random() * 360 + ', 50%, 50%)'; })
  .call(drag);


var force = d3.layout.force()
  .gravity(0)
  .charge(0)
  .nodes(nodes)
  .size([width, height]);

force.on('tick', function() {
  score[0].value++;
  if (score[0].value > score[1].value) {
    score[1].value = score[0].value;
  }

  scoreboard.data(score).text(function(d) {
    var score = d.name !== 'Collisons' ? Math.floor(d.value / 10) : d.value;
    return d.name + ' ' + score;
  });

  var q = d3.geom.quadtree(nodes, width, height);
  var i = 0;
  n = nodes.length;

  // iterate over each node and make it move
  // per its velocity

  q.visit(collisionDetector(player));
  svg.selectAll('circle')
    .attr('cx', function(d) { return d.x; } )
    .attr('cy', function(d) { return d.y; } );
  force.resume(); // prevent "cooling down" freezing
});

var lastCollisionTime = Date.now();


var collisionDetector = function(player) {
  var player = player;

  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== player)) {
      quad.point.x += Math.cos(quad.point.direction) * quad.point.velocity;
      quad.point.y += Math.sin(quad.point.direction) * quad.point.velocity;
      // check for collisons
      if ((quad.point.x - quad.point.radius) < 0 || (quad.point.x + quad.point.radius) > width) {
        
        // undo the last change
        quad.point.x = quad.point.px;
        // figure out a new direction
        quad.point.direction = Math.PI - quad.point.direction;
        quad.point.x += Math.cos(quad.point.direction) * quad.point.velocity;
      }

      if (quad.point.y - quad.point.radius < 0 || quad.point.y + quad.point.radius > height) {
        
        quad.point.y = quad.point.py;
        quad.point.direction = 2 * Math.PI - quad.point.direction;
        quad.point.y += Math.sin(quad.point.direction) * quad.point.velocity;
      }
    //check for collision with player
      var xDist = player.x - quad.point.x;
      var yDist = player.y - quad.point.y;
      var dist = Math.sqrt(xDist * xDist + yDist * yDist);

      if (dist < player.radius + quad.point.radius && Date.now() - 500 > lastCollisionTime) {
        lastCollisionTime = Date.now();
        score[2].value++;
        // need some way to not keep adding as collision
        // is happening
        score[0].value = 0;
      }
    }

    return false;
  };

};

force.start();
