module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Request', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    sharedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'shared_user_id',
    },
    labelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'label_id',
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'refused'),
      allowNull: false,
      defaultValue: 'pending',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    tableName: 'labels',
    timestamps: true,
    underscored: true,
  });
};
