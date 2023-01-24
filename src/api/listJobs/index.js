const ListJobsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "listJobs",
  version: "1.0.0",
  register: async (server, { socketIO, service, validator }) => {
    const listJobsHandler = new ListJobsHandler(socketIO, service, validator);
    server.route(routes(listJobsHandler));
  },
};
