import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface DepartmentAttributes {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DepartmentCreationAttributes
    extends Optional<DepartmentAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Department
    extends Model<DepartmentAttributes, DepartmentCreationAttributes>
    implements DepartmentAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function initializeDepartmentModel(sequelize: Sequelize): typeof Department {
    Department.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            tableName: "departments",
            timestamps: true,
        }
    );

    return Department;
}

