import { Request, Response } from "express";
import DataBase from "../../database/data-source";
import { Films, People, PeopleInFilms} from "../../database/entity/models";
import { refillFilmsInDB, refillPeopleForThisFilm,updateFilmCharactersStatus, getPeopleIdFromDbWhitFilmId} from "../utils/film.utils"

export const getFilmById = async (req:Request, res:Response)=>{
    let filmId:number = parseInt(req.params.id)
    if(!isNaN(filmId)){
      await refillPeopleForThisFilm(res,filmId)
      let filmsRepository = await DataBase.getRepository(Films)
      let film = await filmsRepository.findOneBy({id: filmId})
      if (film === null) {
        res.status(404).json({error: `Movie not found ${req.params.id}.`})
      }else{
        let peopleIds = await getPeopleIdFromDbWhitFilmId(film.id)
        let peopleRepository = await DataBase.getRepository(People)
        let characters = await peopleRepository 
          .createQueryBuilder("film")
          .where("id IN (:...ids)", { ids: peopleIds })
          .getMany();
        if(characters.length > 0){
          res.json({film: film, "characters": characters})
        }else{
          res.json({film: film, error: "Bad Gateway."})
        }
      }
    }else{
      res.status(400).json({error: `The request "${req.params.id}" is incorrect.`})
    }
  }

export const getFilmsByName = async (req:Request, res:Response) => {
    console.log("Searched movie name:", req.query.searchFilm)
    let someFilms:string = String(req.query.searchFilm);

    let filmsRepository = await DataBase.getRepository(Films)
    let films = await filmsRepository
      .createQueryBuilder("film")
      .where("LOWER(film.title) LIKE LOWER(:title)", { title: `%${someFilms}%` })
      .getMany();
    if(films.length > 0){
      res.json({results: films})
    }else{
      res.status(404).json({error: `No movies found for your search "${req.query.searchFilm}"`})
    }
  }

export const getFilmsAll = async (req:Request, res:Response) => {
  try{
    await refillFilmsInDB(res)
    let filmsRepository = await DataBase.getRepository(Films)
    let films = await filmsRepository.find()
    res.json({results: films})
  }catch{
    res.status(502).json({error: "Bad Gateway"})
  }
}

export const delFilmById = async (req:Request, res:Response)=>{
    let filmId = parseInt(req.params.id);
    if(!isNaN(filmId)){
      let filmsRepository = await DataBase.getRepository(Films)
      let film = await filmsRepository.findOneBy({id: filmId})
      if(film){
        let charactersIdsToDelete = await getPeopleIdFromDbWhitFilmId(film.id);
        if(charactersIdsToDelete.length > 0){
          try{
            let peopleRepository = await DataBase.getRepository(People)
            await peopleRepository.createQueryBuilder()
              .delete()
              .from(People)
              .where("id IN (:...charactersIdsToDelete)", { charactersIdsToDelete })
              .execute();
            let filmId = [film.id]
            let peopleInFilmsRepository = await DataBase.getRepository(PeopleInFilms)
            await peopleInFilmsRepository.createQueryBuilder()
              .delete()
              .from(PeopleInFilms)
              .where("film_id IN (:...filmId)", { filmId })
              .execute();
            await updateFilmCharactersStatus(film.id,false)
            let films = await filmsRepository.find()
            res.json({results: films, message: `The characters of the movie ${film.title} were removed successfully.`});
          }catch{
            res.status(503).json({error: "The server is not ready to handle the request."})
          }
        }else{
          res.status(404).json({error: `The film ${film.title}, does not have associated characters to eliminate.`})
        }
      }else{
        res.status(404).json({error: `The film with id ${req.params.id} to delete not found.`})
      }
    }else{
      res.status(400).json({error: `The request "${req.params.id}" is incorrect.`})
    }
  }

export const delFilmsAll = async(req:Request,res:Response) =>{
    try{
      var filmsRepository = await DataBase.getRepository(Films)
      var peopleInFilmsRepository = await DataBase.getRepository(PeopleInFilms)
      var peopleRepository = await DataBase.getRepository(People)
      let films = await filmsRepository.find()
      let peopleInFilms = await peopleInFilmsRepository.find()
      let people = await peopleRepository.find()
      if(films.length === 0 && peopleInFilms.length === 0 && people.length === 0){
        res.status(404).json({error:"Database has not movies to delete."})
      }else{
        await filmsRepository
          .createQueryBuilder()
          .delete()
          .execute();
        await peopleRepository
            .createQueryBuilder()
            .delete()
            .execute();
        await peopleInFilmsRepository
            .createQueryBuilder()
            .delete()
            .execute();
        res.json({message:"Movies were deleted successfully"})
      }
    }catch{
      res.status(503).json({error:"The server is not ready to handle the request."})
    }
  }