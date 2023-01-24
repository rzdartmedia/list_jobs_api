const UsersHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "users",
  version: "1.0.0",
  register: async (server, { socketIO, service, validator }) => {
    const usersHandler = new UsersHandler(socketIO, service, validator);
    server.route(routes(usersHandler));
  },
};
