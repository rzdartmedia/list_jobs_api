const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: handler.getUserByIdHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
  {
    method: "GET",
    path: "/users",
    handler: handler.getUsersRoleUserHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
  {
    method: "PUT",
    path: "/users/password/{id}",
    handler: handler.putPasswordUserHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
];

module.exports = routes;
