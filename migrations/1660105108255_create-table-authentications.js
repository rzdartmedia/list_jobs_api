exports.up = (pgm) => {
  pgm.createTable("authentications", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      references: "users",
      onDelete: "cascade",
    },
    token: {
      type: "TEXT",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("authentications");
};
