import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface EmployeeAttributes {
    id: number;
    name: string;
    position: string;
    departmentId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmployeeCreationAttributes
    extends Optional<EmployeeAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Employee
    extends Model<EmployeeAttributes, EmployeeCreationAttributes>
    implements EmployeeAttributes {
    public id!: number;
    public name!: string;
    public position!: string;
    public departmentId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function initializeEmployeeModel(sequelize: Sequelize): typeof Employee {
    Employee.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            position: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            departmentId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "departments",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
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
            tableName: "employees",
            timestamps: true,
        }
    );

    return Employee;
}
