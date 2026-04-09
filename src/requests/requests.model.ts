import { DataTypes, Model, Optional, Sequelize } from "sequelize";


    export interface RequestAttributes {
       id: number;
       userId: number;
       requestType: string;
       purpose: string;
       status: string;
       createdAt: Date;
       updatedAt: Date;
    }


    //define optional attributes for request creation
    export interface RequestCreationAttributes 
    extends Optional<RequestAttributes, "id" | "createdAt" | "updatedAt"> {}

    export class Request 
    extends Model<RequestAttributes, RequestCreationAttributes>
    implements RequestAttributes {
        public id!: number;
        public userId!: number;
        public requestType!: string;
        public purpose!: string;
        public status!: string;
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    export default function initializeRequestModel(sequelize: Sequelize): typeof Request {
        Request.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                requestType: { 
                    type: DataTypes.STRING,
                    allowNull: false
                },
                purpose: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: 'pending'
                },
                createdAt: {
                    type: DataTypes.DATE
                    // defaultValue: dataTypes.NOW
                    // allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE
                }
            },
             {
                sequelize,
                tableName: "requests",
                timestamps: true
            }
        );
    
        return Request;
    }   