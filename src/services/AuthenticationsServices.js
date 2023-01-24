const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");

class AuthenticationsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(userId, token) {
    const id = `auth-${nanoid(8)}`;
    const query = {
      text: "INSERT INTO authentications VALUES($1, $2, $3)",
      values: [id, userId, token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsServices;
