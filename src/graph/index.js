var _ = require('underscore')


var Vertex = function (props, id){

  Object.keys(props).forEach(function(key){
    this[key] = props[key]
  })

  this.id = id
}

Vertex.prototype.addEdge = function(vertex){
  this.edges = this.edges || []

  var hasEdge = this.edges
    .filter(function(edge){
      return edge == vertex.id
    })

  if(hasEdge.length == 0){
    this.edges.push(vertex.id)
    vertex.addEdge(this)
  }

}

// removal is expensive :(
Vertex.prototype.removeEdge = function (vertex){
  if(!this.edges){
    return
  }

  var hasEdge = this.edges
    .filter(function(edge){
      return edge == vertex.id
  })

  if(hasEdge.length != 0){
    this.edges
      .forEach(function(edge, index){
        if(edge == vertex.id){
          this.edges = this.edges.splice(index, 1)
        }
      })

    vertex.removeEdge(this)
  }

}

Vertex.prototype.degree = function(){
  return this.edges.length
}

var Graph = function (vertices){
  this.vs = vertices || []
}

Graph.prototype.addVertex = function (vertex){
  return this.vs.push(new Vertex(vertex, this.vs.length))
}

Graph.prototype.removeVertex = function (vertex){
  vertex.edge.forEach(function(key){
    this.vs[key].removeEdge(vertex)
  })

  this.vs.slice(vertex.id, this.vs.length-1).map(function(elm){
    elm.id = elm.id - 1
    return elm
  })

  this.vs = this.vs.splice(vertex.id, 1)
}

Graph.prototype.addEdge = function(vertex1, vertex2){
  vertex1.addEdge(vertex2)
}

Graph.prototype.removeEgde = function(vertex1, vertex2){
  vertex1.removeEdge(vertex2)
}

Graph.prototype.at = function(index){
  return this.vs[index]
}

Graph.prototype.atEdges = function(index){
  return this.vs[index].edges
}

Graph.moveTo = function(vertex, index){
  this.vs[index] = vertex

  vertex.edges.forEach(function(elm){
    this.vs[elm].edges.forEach(function(item){
      item = item == vertex.id ? index : item
    })
  })

  this.vs[index].id = index
}

Graph.prototype.fixEdges = function(){
  var vs = this.vs

  var ids_mapped = _.sortBy(vs, function(item){
      return item.id
    })
    .map(function(item){
      return item.new
    })

  vs.forEach(function(vertex){
    vertex.edges.forEach(function(elm, index){
      vertex.edges[index] = ids_mapped[elm]
    })
    vertex.id = vertex.new
    delete vertex.new
  })

  return this
}

Graph.prototype.clean = function (){
  return new Graph()
}

Graph.prototype.degree = function(){
  var value = {
    max: -Infinity,
    elm: index
  }

  var degrees = this.vs.map(function(elm){
    return elm.degree()
  })

  degrees.forEach(function(item, index){
    if(value.max < item){
      value.max = item
      value.elm = index
    }
  })

  return this.vs[value.elm]
}


module.exports = Graph
