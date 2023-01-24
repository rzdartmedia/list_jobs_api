class UsersHandler {
  constructor(socketIO, service, validator) {
    this._socket = socketIO;
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersRoleUserHandler = this.getUsersRoleUserHandler.bind(this);
    this.putPasswordUserHandler = this.putPasswordUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validatePostUserPayload(request.payload);
    const { lcd, username, password, roleUser } = request.payload;

    const userId = await this._service.addUser({
      lcd,
      username,
      password,
      roleUser,
    });

    const response = h.response({
      status: "success",
      message: "User berhasil ditambahkan",
      data: {
        userId,
      },
    });

    response.code(201);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);

    return {
      status: "success",
      data: {
        user,
      },
    };
  }

  async getUsersRoleUserHandler() {
    const users = await this._service.getUsersRoleUser();
    return {
      status: "success",
      data: {
        users,
      },
    };
  }

  async putPasswordUserHandler(request) {
    this._validator.validatePutUserPayload(request.payload);
    const { id } = request.params;
    const { passwordOld, passwordNew } = request.payload;

    await this._service.putPasswordUser({
      userId: id,
      passwordOld,
      passwordNew,
    });

    return {
      status: "success",
      message: "Password berhasil diubah",
    };
  }
}

module.exports = UsersHandler;
