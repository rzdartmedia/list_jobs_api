exports.up = (pgm) => {
  pgm.createTable("list_jobs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    job: {
      type: "TEXT",
      notNull: true,
    },
    deadline: {
      type: "DATE",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
    },
    status: {
      type: "VARCHAR",
      notNull: true,
    },
    level_priority: {
      type: "VARCHAR",
      notNull: true,
    },
    user_created: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
    },
    updated_at: {
      type: "DATE",
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("list_jobs");
};
