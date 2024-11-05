import { Character } from 'src/database/models/character.model';
export declare class CharacterService {
    private characterModel;
    constructor(characterModel: typeof Character);
    findAll(): Promise<Character[]>;
    create(data: Partial<Character>): Promise<Character>;
}
