const routes = (handler) => [
  {
    method: "POST",
    path: "/listJobs",
    handler: handler.postListJobsHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
  {
    method: "GET",
    path: "/listJobs/{id}",
    handler: handler.getListJobByIdHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
  {
    method: "GET",
    path: "/listJobs/user/{userId}",
    handler: handler.getListJobsByUserIdHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
  {
    method: "GET",
    path: "/listJobs/progress/{userId}",
    handler: handler.getListJobsByUserIdProgressHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
  {
    method: "PUT",
    path: "/listJobs/status/{id}",
    handler: handler.putStatusJobHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
  {
    method: "GET",
    path: "/listJobs/history/{jobId}",
    handler: handler.getJobHistoriesByJobIdHandler,
    options: {
      auth: "listJobs_jwt",
    },
  },
];

module.exports = routes;
