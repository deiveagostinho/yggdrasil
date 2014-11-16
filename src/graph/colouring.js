var Graph = require('./index')
  , _     = require('underscore')

/*

 Greedy Colouring Algorithm.

 It's known that GCA performs differently depending on how the vertices are ordered within a set.
 That said, the current implementation provides 3 different ordering algorithm for graphs:
    - random sequence
    - largest first
    - lexographic breadth-first search (lex-bfs)
 It's also known that a graph ordered by lex-bfs results in a GCA perfoming optimal for
 Interval and Indifference graphes :+1:.

 @params   g => Graph instance, ordering => Ordering Algorithm function
 @return   new Graph instance, vertices now has color property

*/

var GreedyColouring = function (g, ordering){

  g = ordering(g)

  g.vs.map(function(vertex, index){
      vertex.color = 0

      return vertex
    })

  g.at(0).color = 1

  var colors = [1]

  // O(n+m)
  var _g = g.vs
      .slice(1, g.vs.length)
      .map(function(vertex){
        var neighbors = _.unique(vertex.edges.map(function(elm){
          return g.vs[elm].color
        }))

        var hasMin = _.min(_.difference(colors, neighbors))

        // different from neighbors and of 0
        if(hasMin == Infinity){
          vertex.color = _.max(neighbors) + 1
          colors.push(vertex.color)
        }
        else{
          vertex.color = hasMin
        }

        return vertex

      })

  _g.unshift(g.at(0))

  return new Graph(g.vs)
}

var RandomSequence = function (g){
  var shuffle = function(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x)
    return o
  }

  g.vs = shuffle(g.vs)

  return new Graph(g.vs
    .map(function(elm, index){
      elm.new = index
      return elm
    })).fixEdges()
}

var LargestFirst = function(g){
  return new Graph(_.sortBy(g.vs, function(elm){
    return elm.degree()
  })
  .reverse()
  .map(function(elm, index){
    elm.new = index
    return elm
  })).fixEdges()
}

var LexBFS = function(g){

  var vl = g.vs.map(function(elm){
    return {
      id: elm.id,
      i: g.vs.length - 1 - elm.id,
      label: '_', // initialize all vertices as ∅
      edges: elm.edges
    }
  })

  var vertices = []
  var _vertices = _.clone(vl)
  var q = {}

  vl.label = '_'
  q[vl.label] = vl

  var evaluateVertex = function(v){

    _.difference(v.edges, vertices.map(function(elm){
      return elm.id
    }))
    .forEach(function(w){
        w = _vertices[w]

        var predList = q[w.label + v.i]

        if(predList){
          predList.push(w)
        }
        else {
          predList = [w]
          predList.label = w.label + v.i

          q[predList.label] = predList
        }

        q[w.label] = _.without(q[w.label], w)

        if(q[w.label].length == 0){
           delete q[w.label]
        }

        w.label = w.label + v.i
      })

  }

  while(Object.keys(q).length > 0){
    var lindex = Object.keys(q).sort().reverse()[0]
    var v = q[lindex][0]
    q[lindex] = _.without(q[lindex], v)

    if(q[lindex].length == 0){
      delete q[lindex]
    }

    vertices.push(v)
    evaluateVertex(v)
  }

  return new Graph(
    _.sortBy(vertices, function(elm){
      return elm.label
    })
    .reverse()
    .map(function(elm, index){
      elm.new = index
      return elm
    })
  ).fixEdges()

}


module.exports = {
  greedy    : GreedyColouring,
  rs        : RandomSequence,
  lf        : LargestFirst,
  lexbfs    : LexBFS
}
