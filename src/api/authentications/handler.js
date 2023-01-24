class AuthenticationsHandler {
  constructor({
    authenticationsServices,
    usersServices,
    tokenManager,
    validator,
  }) {
    this._authenticationsService = authenticationsServices;
    this._usersServices = usersServices;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(
      this
    );
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const {
      userId,
      dataUsername,
    } = await this._usersServices.verifyUserCredential(username, password);

    const refreshToken = this._tokenManager.generateRefreshToken({
      userId,
      username: dataUsername,
      id: userId,
    });

    await this._authenticationsService.addRefreshToken(userId, refreshToken);

    const response = h.response({
      status: "success",
      message: "Authentication berhasil ditambahkan",
      data: {
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: "success",
      message: "Refresh token berhasil dihapus",
    };
  }
}

module.exports = AuthenticationsHandler;
