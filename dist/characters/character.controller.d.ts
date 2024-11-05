import { CharacterService } from './character.service';
import { Character } from '../database/models/character.model';
import { StarWarsService } from './starWars.service';
export declare class CharacterController {
    private readonly characterService;
    private readonly starWarsService;
    constructor(characterService: CharacterService, starWarsService: StarWarsService);
    findAll(): Promise<Character[]>;
    getExternalCharacters(): Promise<any>;
}
