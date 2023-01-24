const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthenticationError = require("../exceptions/AuthenticationError");

class UsersServices {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ lcd, username, password, roleUser }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(8)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const dateNow = new Date().toISOString();
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $6) RETURNING id",
      values: [id, lcd, username, hashedPassword, roleUser, dateNow],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: `SELECT id FROM users WHERE username = $1`,
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(
        `Gagal menambahkan user, username sudah digunakan`
      );
    }
  }

  async getUsersRoleUser() {
    const query = {
      text:
        "SELECT id, lcd, username, role_user FROM users WHERE role_user = $1",
      values: ["user"],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, lcd, username, role_user FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async putPasswordUser({ userId, passwordOld, passwordNew }) {
    const passwordOldUser = await this.getPasswordOldUser(userId);
    const match = await bcrypt.compare(passwordOld, passwordOldUser);

    if (!match) {
      throw new AuthenticationError("Password yang Anda berikan salah");
    }

    const hashedPassword = await bcrypt.hash(passwordNew, 10);
    const query = {
      text: "UPDATE users SET password = $1 WHERE id = $2 RETURNING id",
      values: [hashedPassword, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal mengganti password");
    }
  }

  async getPasswordOldUser(userId) {
    const query = {
      text: "SELECT password FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0].password;
  }

  async verifyUserCredential(dataUsername, password) {
    const query = {
      text: `SELECT id, username, password FROM users WHERE username = $1`,
      values: [dataUsername],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError(
        `username / password yang Anda berikan salah`
      );
    }

    const { id, username, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError(
        "username / password yang Anda berikan salah"
      );
    }

    const data = { userId: id, dataUsername: username };
    return data;
  }
}

module.exports = UsersServices;
