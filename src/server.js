require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const ClientError = require("./exceptions/ClientError");
// const hapiSocketIo = require("hapi-socket.io");
const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "*",
  },
});

// User
const users = require("./api/users");
const UsersServices = require("./services/UsersServices");
const UsersValidator = require("./validator/users");

// Authentications
const authentications = require("./api/authentications");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsServices = require("./services/AuthenticationsServices");
const AuthenticationsValidator = require("./validator/authentications");

// List Jobs
const listJobs = require("./api/listJobs");
const ListJobsServices = require("./services/ListJobsServices");
const ListJobsValidator = require("./validator/listJobs");

const init = async () => {
  const usersServices = new UsersServices();
  const authenticationsServices = new AuthenticationsServices();
  const listJobsServices = new ListJobsServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Socket
  io.on("connection", (socket) => {
    // console.log(`user connected : ${socket.id}`);
  });

  io.listen(server.listener);

  // register plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  //   mendifiniskan strategy autentekasi jwt
  server.auth.strategy("listJobs_jwt", "jwt", {
    keys: process.env.REFRESH_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      // maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        socketIO: io,
        service: usersServices,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsServices,
        usersServices,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: listJobs,
      options: {
        socketIO: io,
        service: listJobsServices,
        validator: ListJobsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
