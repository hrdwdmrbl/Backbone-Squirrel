const Posts = [
  { id: "1", name: "Bill", age: 35, content: "bill@company.com", user_id: 1, project_id: 2 },
  { id: "2", name: "Donna", age: 32, content: "Amazing blog post 2", user_id: 2, project_id: 1 }
];
const Users = [
  {id: 1, name: "marc"},
  {id: 2, name: "maria"}
];
const Projects = [
  {id: 1, title: 'Project 1', user_id: 1},
  {id: 2, title: 'Project 2', user_id: 2},
  {id: 3, title: 'Project 3', user_id: 1}
];
const Roles = [
  {id: 1, user_id: 1, project_id: 1},
  {id: 2, user_id: 1, project_id: 2},
  {id: 3, user_id: 1, project_id: 3},
  {id: 4, user_id: 2, project_id: 1},
  {id: 5, user_id: 2, project_id: 2}
];
window[config.appName] = {};
window[config.appName].Models = {};
window[config.appName].Models.Project = Backbone.SquirrelModel.extend({
  urlRoot: '/projects',
  idAttribute: 'id',
  Class: 'Project',
  relations: [
    {
      type: 'HasMany',
      key: 'roles',
      relatedModel: 'Role'
    },{
      type: 'HasOne',
      key: 'user',
      relatedModel: 'User'
    }
  ]
});
window[config.appName].Models.User = Backbone.SquirrelModel.extend({
  urlRoot: '/users',
  idAttribute: 'id',
  Class: 'User',
  relations: [
    {
      type: 'HasMany',
      key: 'roles',
      relatedModel: 'Role'
    },{
      type: 'HasMany',
      key: 'projects',
      relatedModel: 'User'
    },{
      type: 'HasMany',
      key: 'posts',
      relatedModel: 'Post'
    }
  ]
});
window[config.appName].Models.Role = Backbone.SquirrelModel.extend({
  urlRoot: '/roles',
  idAttribute: 'id',
  Class: 'Role',
  relations: [
    {
      type: 'HasOne',
      key: 'user',
      relatedModel: 'User'
    },{
      type: 'HasOne',
      key: 'project',
      relatedModel: 'Project'
    }
  ]
});
window[config.appName].Models.Post = Backbone.SquirrelModel.extend({
  urlRoot: '/posts',
  idAttribute: 'id',
  Class: 'Post',
  relations: [
    {
      type: 'HasOne',
      key: 'project',
      relatedModel: 'Project'
    },{
      type: 'HasOne',
      key: 'user',
      relatedModel: 'User'
    }
  ]
});
_.each(Users, function (user) {
  new window[config.appName].Models.User(user);
});
_.each(Posts, function (post) {
  new window[config.appName].Models.Post(post);
});
_.each(Projects, function (project) {
  new window[config.appName].Models.Project(project);
});
_.each(Roles, function (role) {
  new window[config.appName].Models.Role(role);
});