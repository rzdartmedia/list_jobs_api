class ListJobsHandler {
  constructor(socketIO, service, validator) {
    this._socket = socketIO;
    this._service = service;
    this._validator = validator;

    this.postListJobsHandler = this.postListJobsHandler.bind(this);
    this.getListJobByIdHandler = this.getListJobByIdHandler.bind(this);
    this.getListJobsByUserIdHandler = this.getListJobsByUserIdHandler.bind(
      this
    );
    this.getListJobsByUserIdProgressHandler = this.getListJobsByUserIdProgressHandler.bind(
      this
    );
    this.putStatusJobHandler = this.putStatusJobHandler.bind(this);
    this.getJobHistoriesByJobIdHandler = this.getJobHistoriesByJobIdHandler.bind(
      this
    );
  }

  async postListJobsHandler(request, h) {
    this._validator.validatePostJobPayload(request.payload);
    const { job, deadline, owner, levelPriority } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const jobId = await this._service.addListJobs({
      job,
      deadline,
      owner,
      levelPriority,
      credentialId,
    });

    const newJobs = await this._service.getListJobsByIdUser(owner);
    await this._socket.emit(`jobs_${owner}`, newJobs);

    const response = h.response({
      status: "success",
      message: "Job berhasil ditambahkan",
      data: {
        jobId,
      },
    });

    response.code(201);
    return response;
  }

  async getListJobByIdHandler(request) {
    const { id } = request.params;
    const job = await this._service.getListJobsById(id);

    return {
      status: "success",
      data: {
        job,
      },
    };
  }

  async getListJobsByUserIdHandler(request) {
    const { userId } = request.params;
    const jobs = await this._service.getListJobsByIdUser(userId);
    return {
      status: "success",
      data: {
        jobs,
      },
    };
  }

  async getListJobsByUserIdProgressHandler(request) {
    const { userId } = request.params;
    const jobs = await this._service.getListJobsByIdUserProgress(userId);
    return {
      status: "success",
      data: {
        jobs,
      },
    };
  }

  async putStatusJobHandler(request) {
    this._validator.validatePutStatusJobPayload(request.payload);
    const { id } = request.params;
    const { status, description, levelPriority, date } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const owner = await this._service.putListStatusJob({
      jobId: id,
      status,
      description,
      levelPriority,
      credentialId,
      date,
    });

    const newJobs = await this._service.getListJobsByIdUser(owner);
    await this._socket.emit(`jobs_${owner}`, newJobs);

    return {
      status: "success",
      message: "Status job berhasil diubah",
    };
  }

  async getJobHistoriesByJobIdHandler(request) {
    const { jobId } = request.params;
    const jobs = await this._service.getJobHistoryByJobId(jobId);
    return {
      status: "success",
      data: {
        jobs,
      },
    };
  }
}

module.exports = ListJobsHandler;
