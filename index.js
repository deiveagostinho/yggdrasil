module.exports = {
  Graph: require('./src/graph')
}

var Graph = require('./src/graph').Graph

var g = Graph.new('yay', 'my yay graph')

g = g
  .addVertex({oops: 'oops'})
  .addVertex({wow: 'wow'})

var it = Graph.Iterator.new(g)

console.log(it.next().get());
