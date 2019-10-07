module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    name: {
      unique: true,
      type: DataTypes.STRING,
    },
    headId: {
      type: DataTypes.INTEGER,
    },
    teamId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      allowNull: false,
      defaultValue: 'Active',
      type: DataTypes.ENUM(
        'Active',
        'Inactive'
      )
    },
    location: {
      type: DataTypes.STRING,
    }
  }, {
    defaultScope: {
      where: {
        status: 'Active'
      }
    },
    scopes: {
      all: {
        where: {
          status: { [sequelize.Op.or]: ['Active', 'Inactive'] }
        }
      },
      inactive: {
        where: {
          status: 'Inactive'
        }
      }
    }
  });
  Department.associate = (models) => {
    Department.belongsTo(models.User, {
      foreignKey: 'headId',
      targetKey: 'id',
      as: 'head',
    });
  };
  return Department;
};
