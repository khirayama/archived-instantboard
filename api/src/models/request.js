/* eslint new-cap: 0 */
module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'member_id',
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
    tableName: 'requests',
    timestamps: true,
    underscored: true,
  });

  Request.accept = function (options) {
    const LabelStatus = sequelize.models.LabelStatus;

    return new Promise(resolve => {
      Request.update({
        status: 'accepted',
      }, options).then(request => {
        LabelStatus.count({
          where: {userId: request.memberId},
        }).then(count => {
          LabelStatus.create({
            userId: request.memberId,
            labelId: request.labelId,
            priority: count,
            visibled: true,
          });
          resolve();
        });
      });
    });
  };

  return Request;
};
