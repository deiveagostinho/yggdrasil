var R         = require('ramda')

var Iterator = Object.create({})

Iterator.new = function(g, index){
  var index = index || 0
    , i = Object.create(Iterator)

  Object.defineProperty(i, '_i', {
    get: function(){
      return index
    }
  })

  Object.defineProperty(i, '_g', {
    get: function(){
      return g
    }
  })

  delete i.new

  return Object.freeze(i)
}

Iterator.get = function(){
  return this._g._vs[this._i]
}

Iterator.next = function(){
  return Iterator.new(this._g, this._i + 1)
}

Iterator.prev = function(){
  return Iterator.new(this._g, this._i - 1)
}

Iterator.hasNext = function(){
  return this._i < this._g.length
}

Iterator.hasPrev = function(){
  return this._i > 0
}

module.exports = Object.freeze(Iterator)
