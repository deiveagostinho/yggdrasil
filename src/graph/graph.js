var R         = require('ramda')
  , Vertex    = require('../vertex')
  , Iterator  = require('./iterator')

/*
*
* Graph def
*
*/

var Graph = Object.create({})

Graph.new = function(name, desc, vs){
  var vs = vs || []
  var g = Object.create(Graph)

  Object.defineProperty(g, '_vs', {
    get: function(){
      return vs
    }
  })

  Object.defineProperty(g, '_type', {
      value: 'graph'
  })

  g.name = name ? name : undefined
  g.desc = desc ? desc : undefined

  delete g.new

  return Object.freeze(g)
}

Graph.addVertex = function (v){

  var vs = this._vs

  vs.push(
    Vertex.new(v)
  )

  return Graph.new(
    this.name,
    this.desc,
    vs
  )

}

Graph.removeVertex = function (v){

  var vs = this._vs
  var index = R.findIndex(v)(vs)

  // Removes all edges before removing the vertex
  v._edges.forEach(function(n){
    Vertex.removeEdge(n)
  })

  index == -1 ? vs : vs.splice(index,1)

  return Graph.new(
    this.name,
    this.desc,
    vs
  )

}

Graph.addEdge = function (v1, v2){

  var vs = this._vs
  var index = R.findIndex(v1)(vs)

  vs[index] = Vertex.addEdge(v1, v2)

  return Graph.new(
    this.name,
    this.desc,
    vs
  )

}

Graph.removeEgde = function (v1, v2){

  var vs = this._vs
  var index = R.findIndex(v1)(vs)

  vs[index] = Vertex.removeEdge(v1, v2)

  return Graph.new(
    this.name,
    this.desc,
    vs
  )

}

Graph.clean = function (){
  return Graph.new(this.name, this.desc)
}

Graph.degree = function (){
  var degrees = this._vs.map(function(v){
    return v.degree()
  })

  return R.max[degrees]

}

Graph.isGraph = function (){
  return this._type == 'graph'
}

Graph.objectify = function (){
  var vertices = this._vs.map(function(v){
    return R.cloneObj(v)
  })

  var o = Object.create({})

  o.name = this.name ? this.name : undefined
  o.desc = this.desc ? this.desc : undefined
  o.vertices = vertices


  return o
}

Graph.Iterator = Iterator

module.exports = Object.freeze(Graph)
