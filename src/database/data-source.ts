import "reflect-metadata"
import { DataSource } from "typeorm"
import { Auth, People, Films, PeopleInFilms,} from "./entity/models"

const PATH = require("path")

function getDataSource(): DataSource {
    switch (process.env.NODE_ENV) {
        case "production":
            console.log("Database established for production environment")
            let dataProd = new DataSource({
                type: "sqlite",
                database: PATH.join(__dirname, "../database/productiondatabase.sqlite"),
                synchronize: false,
                logging: false,
                entities: [Auth,Films,People,PeopleInFilms],
                migrations: [],
                subscribers: [], 
            });
            dataProd.initialize()
            return dataProd
        case "dev":
            console.log("Database established for dev environment")
            let dataDev = new DataSource({
                type: "sqlite",
                database: PATH.join(__dirname, "../database/devdatabase.sqlite"),
                synchronize: true,
                logging: false,
                entities: [Auth,Films,People,PeopleInFilms],
                migrations: [],
                subscribers: [], 
            });
            dataDev.initialize()
            return dataDev
        case "test":
            console.log("Database established for testing environment")
            let dataTest = new DataSource({
                type: "sqlite",
                database: PATH.join(__dirname, "../database/testdatabase.sqlite"),
                synchronize: true,
                logging: false,
                entities: [Auth,Films,People,PeopleInFilms],
                migrations: [],
                subscribers: [], 
            });
            return dataTest
        default:
            throw new Error("Database will not be exported, no development environment established.");
    }
}

const DataBase = getDataSource();
export default DataBase;
