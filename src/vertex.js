var R             = require('ramda')
  , randomBytes   = require('crypto').randomBytes

/*
 *
 * Vertex def
 *
 */

var Vertex = Object.create({})

/*

  Creates new Vertex.

  @params:
    props :: Object

  @return:
    v     :: Vertex

*/

Vertex.new  = function(props){
  var v     = Object.create(Vertex)
    , edges = []
    , id    = randomBytes(256, function(ex, buf) {
      if (ex) throw ex
      return buf
    })

  Object.defineProperty(v, '_id', {
    get: function(){
      return id
    }
    , enumerable: false
  })

  Object.defineProperty(v, '_edges', {
      get: function(){
      return edges
    }
    , set: function(_edges){
      edges = _edges
    }
    , enumerable: false
  })

  Object.defineProperty(v, '_type', {
      value: 'vertex'
    , enumerable: false
    , writable: false
    , configurable: false
  })

  Object.keys(props).forEach(function(key){
    v[key] = props[key]
  })

  delete v.new

  return v
}


/*

  Add an edge between the 2 vertices.

  @params:
    vertex1  :: Vertex
    vertex2  :: Vertex

  @return:
    vertex   :: Vertex

  @time complexity:
    O(n)    :: n => # of edges in vertex1

*/

Vertex.addEdge = function(v1, v2){

  vertexChecker(v1)
  vertexChecker(v2)

  var edges = v1._edges

  if(!Vertex.hasEdge(v1, v2)){
    edges.push(v2)
  }

  v1._edges = edges

  return v1

}


/*

  Remove an edge between the 2 vertices.

  @params:
    v1   :: Vertex
    v2   :: Vertex

  @return:
    v    :: Vertex

  @time complexity:
    O(n) :: n => # of edges in v1

*/

Vertex.removeEdge = function (v1, v2){

  vertexChecker(v1)
  vertexChecker(v2)

  var edges = v1._edges.splice(R.findIndex(R.propEq('_id', v2._id))(v1._edges), 1)
  v1._edges = edges == -1 ? v1._edges : edges

  return v1
}

/*

  Calculates the number of edges of a vertex.

  @params:
    v1   :: Vertex

  @return:
         :: Number

*/

Vertex.degree = function(v){
  return v._edges.length
}

/*

  Add a non-enumerable property to Vertex.

  @params:
    v           :: Vertex
    property    :: String
    value       :: a

  @return:
    _v          :: Vertex

*/

Vertex.addProperty = function(v, property, value){

  Object.defineProperty(v, property, {
      get: function(){
      return value
    }
    , set: function(_value){
      value = _value
    }
    , enumerable: true
    , writable: true
    , condigurable: false
  })

  return v
}

/*

  Checks whether the param v is a vertex or not.

  @params:
    v1   :: Object

  @return:
         :: Boolean

*/

Vertex.isVertex = function(v){
  return v.type == 'vertex'
}

/*

  Checks whether there's an edge between 2 vertices.

  @params:
    v1   :: Vertex
    v2   :: Vertex

  @return:
         :: Boolean

  @time complexity:
    O(n) :: n => # of edges in v1

*/

Vertex.hasEdge = function(v1, v2){
  return R.findIndex(v2._id)(v1._edges) != -1
}


/*

  Helper Functions

*/

function vertexChecker(v) {
  if(Vertex.isVertex(v)){
    throw new Error("Oops, it's not vertex. Try Vertex.new() before.")
  }
}

module.exports = Object.freeze(Vertex)
