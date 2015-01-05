var Graph = require('./graph')
  , R     = require('ramda')

/*

 Greedy Coloring Algorithm.

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

var Color = Object.create({})

Color.GreedyColoring = function (g, ord){

  var _g = ord(g)
  var it = Graph.Iterator.new(_g)
  var colors = [1]

  _g.iterate(function(v){
    v.extend({
      color: 0
    })
  })

  it
    .get()
    .color = 1

  // O(n+m)
  var vs = _g.vs
      .map(function(vertex){
        if(vertex != it.get()){

          var neighbors = R.uniq(
            vertex.edges.map(function(elm){
              return elm.color
            })
          )

          var hasMin = R.min(R.difference(colors, neighbors))

          // different from neighbors and 0
          if(hasMin == Infinity){
            vertex.color = R.max(neighbors) + 1
            colors.push(vertex.color)
          }
          else{
            vertex.color = hasMin
          }

          return vertex
        }

      })

  return Graph.new(
    _g.name,
    _g.desc,
    vs
  )
}

Color.RandomSequence = function (g){
  var shuffle = function(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x)
    return o
  }

  var vs = shuffle(g._vs)

  return Graph.new(
    g.name,
    g.desc,
    vs
  )
}

Color.LargestFirst = function(g){
  return Graph.new(
    g.name,
    g.desc,
    R.sortBy(g._vs, function(vertex){
      return vertex.degree()
    })
    .reverse()
  )
}

Color.LexBFS = function(g){

  var vl = g.map(function(v, index){
    return {
      id: index,
      i: g._vs.length - 1 - index,
      label: '∅', // initialize all vertices as ∅
      edges: v.edges,
      v: v
    }
  })

  var vertices = []
  var _vertices = R.clone(vl)
  var q = {}

  vl.label = '∅'
  q[vl.label] = vl

  var evaluateVertex = function(v){

    R.difference(v.edges, vertices.map(function(v){
      return v.id
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

  return Graph.new(
    g.name,
    g.desc,
    R.sortBy(vertices, function(elm){
      return elm.label
    })
    .reverse()
    .map(function(elm){
      return elm.v
    })
  )
}


module.exports = Object.freeze(Color)
