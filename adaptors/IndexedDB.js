Backbone.IndexedDBStore = function() {
  var requestHandler = function(request, callback){
    request.onerror = function(event) {
      console.error("Database error: " + event.target.errorCode);
    };
    request.onsuccess = function(event) {
      self.db = event.target.result;
      Backbone.Events.trigger('dbSetup', self.db);
    };
    request.onupgradeneeded = function(event) {
      self.db = event.target.result;
      Backbone.Events.trigger('onupgradeneeded', self.db);
      if(callback){
        callback(self.db);
      }
    };
    request.onblocked = function(event){
      console.error("Database error: " + event.target.errorCode);
    };
    request.onabort = function(event){
      console.error("Database error: " + event.target.errorCode);
    };
  };
  this.setup = function(){
    requestHandler(window.indexedDB.open(config.dbName));
  }
  this.dumpDB = function(){
    var array = _.map(self.db.objectStoreNames, function(s){ return s; });
    var transaction = Backbone.SquirrelStore.db.transaction(array, 'readonly');
    _.each(self.db.objectStoreNames, function(store){
      var objectStore = transaction.objectStore(store);
      
      var keyRange = IDBKeyRange.lowerBound(0),
          cursorRequest = objectStore.openCursor(keyRange);

      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(result === false){
          return;
        }
        console.log(result.value);
        result.continue();
      };
    });
  };
  this.get = function(table, id){
    if( !_.isUndefined(related) ){
      var transaction = Backbone.SquirrelStore.db.transaction([this.relatedModel], 'readwrite');
      transaction.oncomplete = function(event) {
        console.log("Transaction - All done!");
      };
      transaction.onerror = function(event) {
        console.error(event);
      };
      var objectStore = transaction.objectStore(this.relatedModel);
      var request = objectStore.get(attr);
      request.onsuccess = function(event) {
        response = event.target.result;
        console.log("request - done!");
      };
    }
    var delayReturn = function(){
      if(response){
        return response;
      }else{
        delayReturn();
      }
    };
  };
  this.set = function(table, id, attr){
    //TODO: support options => silent
    //TODO: support a JS object store.
    // Handle both `"key", value` and `{key: value}` -style arguments.
    if (_.isObject(key)) {
      attrs = key;
      options = value;
    } else {
      (attrs = {})[key] = value;
    }

    var transaction = Backbone.SquirrelStore.db.transaction([this.Class], 'readwrite');
    transaction.oncomplete = function(event) {
      console.log("Transaction - All done!");
    };
    transaction.onerror = function(event) {
      console.error(event);
    };

    var objectStore = transaction.objectStore(this.Class);
    var request = objectStore.put(attrs);
    request.onsuccess = function(event) {
      console.log("request - done!");
    };
  };
  this.iterate = function(callback){
    var version = self.db.version +1;
    self.db.close();
    requestHandler(window.indexedDB.open(config.dbName, version), callback);
  };
  this.add = function(table, id, attributes){

    var wait = function(db){
      if(!_.include(db.objectStoreNames, self.Class)){
        Backbone.SquirrelStore.iterate(function(db){
          db.createObjectStore(self.Class, { keyPath: "id" });
        });
      }
    };
    if(!Backbone.SquirrelStore.db){
      Backbone.Events.on('dbSetup', function(db){
        wait(db);
      });
    }else{
      wait(Backbone.SquirrelStore.db);
    }
  };
};