var Events = function() {
  this.events = {};
}

Events.prototype.eventCall = function(name, args) {
  if (!this.events.hasOwnProperty(name)) {
    console.log('has no listener fo "'+name+'"')
  }
  this.events[name].forEach(function(o,i,a){
    o.func.call(o.thisArg, args);
  })
};
Events.prototype.eventSign = function(name, func, thisArg) {
  if (!this.events.hasOwnProperty(name)) {
    this.events[name] = [];
  }
  this.events[name].push({func:func, thisArg: thisArg})
};
var parseEvents = new Events();