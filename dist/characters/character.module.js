"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const character_model_1 = require("../database/models/character.model");
const character_service_1 = require("./character.service");
const character_controller_1 = require("./character.controller");
const axios_1 = require("@nestjs/axios");
const starWars_service_1 = require("./starWars.service");
let CharacterModule = class CharacterModule {
};
exports.CharacterModule = CharacterModule;
exports.CharacterModule = CharacterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([character_model_1.Character]),
            axios_1.HttpModule,
        ],
        controllers: [character_controller_1.CharacterController],
        providers: [character_service_1.CharacterService, starWars_service_1.StarWarsService],
    })
], CharacterModule);
//# sourceMappingURL=character.module.js.map