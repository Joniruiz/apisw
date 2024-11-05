"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterController = void 0;
const common_1 = require("@nestjs/common");
const character_service_1 = require("./character.service");
const starWars_service_1 = require("./starWars.service");
let CharacterController = class CharacterController {
    constructor(characterService, starWarsService) {
        this.characterService = characterService;
        this.starWarsService = starWarsService;
    }
    async findAll() {
        return this.characterService.findAll();
    }
    async getExternalCharacters() {
        return this.starWarsService.getCharacters();
    }
};
exports.CharacterController = CharacterController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('external'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CharacterController.prototype, "getExternalCharacters", null);
exports.CharacterController = CharacterController = __decorate([
    (0, common_1.Controller)('characters'),
    __metadata("design:paramtypes", [character_service_1.CharacterService, typeof (_a = typeof starWars_service_1.StarWarsService !== "undefined" && starWars_service_1.StarWarsService) === "function" ? _a : Object])
], CharacterController);
//# sourceMappingURL=character.controller.js.map