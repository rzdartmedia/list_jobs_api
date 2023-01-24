exports.up = (pgm) => {
  pgm.createTable("job_histories", {
    job_id: {
      type: "VARCHAR(50)",
      references: "list_jobs",
    },
    status: {
      type: "VARCHAR",
      notNull: true,
    },
    description: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
    },
    level_priority: {
      type: "VARCHAR",
      notNull: true,
    },
    user_updated: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
    },
    date: {
      type: "DATE",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("job_histories");
};
