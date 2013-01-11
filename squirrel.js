const config = {
  dbName: 'TestDatabase2',
  appName: 'Test',
  dbVersion: 1
};

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

Backbone.Store = function() {
  var self = this;
  this._collections = [];
  this._models = [];

  this.setup = function(){};

  this.dumpDB = function(){
    _.each(this._models, function(mo){
      console.log('Class: '+mo.Class, mo.attributes);
    });
  };
  this.get = function (table, id) {

    return _.find(this._models, function(model){
      return model.Class === table && model.attributes.id === id;
    });
  };
  this.set = function(table, id, attr){};
  this.add = function(mo){
    //TODO: check for duplicates
    _.sortedIndex(this._models, model, function(mo){
      return mo.Class;
    });
  };
  this.setup.apply(this, arguments);
};

Backbone.SquirrelStore = new Backbone.Store();

Backbone.SquirrelModel = Backbone.Model.extend({
  constructor: function( attributes, options ) {
    var self = this,
        args = arguments;
    //TODO: check for an existing copy of model. If so
    //      then, just return that model. Else, create
    //      a new instance and return it.
    Backbone.SquirrelStore.add(this);
  },
  // trigger: function( eventName ) {
  //   Backbone.Model.prototype.trigger.apply( this, arguments );
  // },
  change: function( options ) { //TODO: should include option to include related attributes, provided a hash of those values to return
    Backbone.Model.prototype.change.apply( this, arguments );
  },
  toJSON: function(options) {
    var depth;
    if(_.isNumber(options)){
      depth = options;
    }else if(_.isObject(options)){
      
    }
    return _.extend(this.attributes, this.relations.map(function(rel){
      if(rel.type === 'HasMany'){
        return Backbone.SquirrelStore.get( rel.relatedModel, {this.Class.toLocaleLowerCase()+'_id': this.attributes.id} );
      }else if(rel.type === 'HasOne'){
        return Backbone.SquirrelStore.get( rel.relatedModel, this[rel.relatedModel.toLocaleLowerCase()+'_id']);
      }
    }));
  },
  set: function( key, value, options ) {
    var eventName = 'before'+':'+this.Class+':'+'update',
        attrs;
    Backbone.Events.trigger(eventName, arguments);
    if(this.before_update){
      this.before_update(eventName, arguments);
    }

    if (_.isObject(key)) {
      attrs = key;
      options = value;
    } else {
      (attrs = {})[key] = value;
    }

    var keys = _.map(this.relations, function(rel){ return rel.key; });
    _.each(Object.keys(attrs), function(attr){
      if(_.any(keys, function(key){ return key === attr; })){
        if( _.isArray(attrs[attr]) ){
          _.each(attrs[attr], function(element){
            var model = new window[config.appName].Models[attr](element);
            Backbone.SquirrelStore.add(model);
          });
        }else{
          var model = new window[config.appName].Models[attr](attrs[attr]);
          Backbone.SquirrelStore.add(model);
        }
        delete attrs[attr];
      }
    });

    if(Backbone.SquirrelStore.set){
      Backbone.SquirrelStore.set(table, id, attr);
    }

    Backbone.Model.prototype.change.apply( this, arguments );

    eventName = 'after'+':'+this.Class+':'+'update';
    Backbone.Events.trigger(eventName, arguments);
    if(this.after_update){
      this.after_update(eventName, arguments);
    }
  },
  get: function(attr){
    var response = Backbone.Model.prototype.change.apply( this, arguments );
    if(response === undefined || response === null){
      var related = _.where(this.relations, {key: attr});
      if(related){
        if(related.type === 'HasOne'){
          var id = this.get(attr+'_id');
          if(id){
            response = Backbone.SquirrelStore.get(related.relatedModel, id);
          }
        }else if(related.type === 'HasMany'){
          var table = related.relatedModel;
          response = Backbone.SquirrelStore.get(table, {this.Class.toLocaleLowerCase()+'_id': id});
        }else{
          throw 'Unknown Related Type.';
        }
      }
    }
    return response;
  }
  // setup: function( superModel ) {
  //   console.log('');
  // },
  // build: function( attributes, options ) {
  //   console.log('');
  // }
});
Backbone.SquirrelCollection = Backbone.Collection.extend({
  // constructor: function( attributes, options ) {
  //   console.log('');
  // }
});