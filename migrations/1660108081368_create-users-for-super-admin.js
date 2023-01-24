exports.up = (pgm) => {
  pgm.sql(`INSERT INTO users VALUES('admin-00000001', 'lcd0', 
        'superadmin', '$2a$12$1fLZ7X4E70M3.zMyNX22DeYoF/V76tJh4xExG9DYY/BS5UYrcqnTm', 'super admin', '2022-05-30 13:06:49',
        '2022-05-30 13:06:49')`);
};

exports.down = (pgm) => {
  pgm.sql(`DELETE FROM users WHERE id = 'admin-00000001'`);
};
