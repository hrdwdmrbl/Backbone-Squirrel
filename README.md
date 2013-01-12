Backbone-Squirrel
=================

An offline, relational store of nuts for BB. 

Insprited by Backbone-Relational.

Goals
======

1. Store JSON request results between sessions.
2. Cut down on server requests by re-using data between sessions.
3. Cut down on server requests by only seeking changes in data.
4. Reliably control relations between data via SQL-type relationships.
5. Mimic rails style ActiveRecord callbacks.
6. Provide an intuitive front-end data-store that compliments an SQL backend.
7. Storage service agnostic (webSQL, LocalStorage, IndexedDB) via adaptors.
8. Sync data between object store and backend to seemlessly transition from online to offline.
9. Tested.
