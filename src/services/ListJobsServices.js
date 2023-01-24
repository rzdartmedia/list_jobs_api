const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class ListJobsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addListJobs({ job, deadline, owner, levelPriority, credentialId }) {
    const id = `jobs-${nanoid(8)}`;
    const status = "progress";
    const dateNow = new Date().toISOString();
    const query = {
      text:
        "INSERT INTO list_jobs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id,
        job,
        deadline,
        owner,
        status,
        levelPriority,
        credentialId,
        dateNow,
        null,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("List Job gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getListJobsByIdUser(userId) {
    const query = {
      text: "SELECT * FROM list_jobs WHERE owner = $1 ORDER BY level_priority",
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getListJobsByIdUserProgress(userId) {
    const query = {
      text: "SELECT * FROM list_jobs WHERE owner = $1 AND status = 'progress'",
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getListJobsById(id) {
    const query = {
      text: "SELECT * FROM list_jobs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Job tidak ditemukan");
    }

    return result.rows[0];
  }

  async getListJobsByIdReturnOwner(id) {
    const query = {
      text: "SELECT owner FROM list_jobs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Job tidak ditemukan");
    }

    return result.rows[0].owner;
  }

  async putListStatusJob({
    jobId,
    status,
    description,
    levelPriority,
    credentialId,
    date,
  }) {
    const query = {
      text: `UPDATE list_jobs SET status = $1, level_priority = $3, updated_at = $4 WHERE id = $2 RETURNING owner`,
      values: [status, jobId, levelPriority, date],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal mengganti status job, job id tidak ada");
    }

    const owner = result.rows[0].owner;

    await this.postJobHistory({
      jobId,
      status,
      description,
      owner,
      levelPriority,
      credentialId,
      date,
    });

    return owner;
  }

  async deleteListStatusJob(id) {
    const query = {
      text: "DELETE FROM list_jobs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus job");
    }
  }

  async postJobHistory({
    jobId,
    status,
    description,
    owner,
    levelPriority,
    credentialId,
    date,
  }) {
    const dateNow = new Date().toISOString();
    const query = {
      text:
        "INSERT INTO job_histories VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING job_id",
      values: [
        jobId,
        status,
        description,
        owner,
        levelPriority,
        credentialId,
        date,
        dateNow,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("History Job gagal ditambahkan");
    }
  }

  async getJobHistoryByJobId(jobId) {
    const query = {
      text: `SELECT 
      job_histories.level_priority AS level_priority,
      job_histories.status AS status,
      job_histories.description AS description,
      job_histories.date AS date,
      job_histories.created_at AS created_at,
      users.username AS user_create FROM job_histories JOIN users 
      ON job_histories.user_updated = users.id
      WHERE job_id = $1 
      UNION
      SELECT 
      level_priority,
      'progress' AS status,
      'create' AS description,
      list_jobs.created_at AS date,
      list_jobs.created_at AS created_at,
      users.username AS user_create FROM list_jobs JOIN users
      ON list_jobs.user_created = users.id
      WHERE list_jobs.id = $1
      ORDER BY created_at DESC`,
      values: [jobId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ListJobsServices;
