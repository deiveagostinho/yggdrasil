var graph       = require('./src/graph/index')
  , colouring   = require('./src/graph/colouring')


// exports Yggdrasil
var Yggdrasil = {
  graph: {
    Graph: graph,
    colouring: colouring
  },
  tree: {}
}

module.exports = Yggdrasil
