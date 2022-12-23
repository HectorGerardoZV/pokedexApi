import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpAdapter } from 'src/common/interfaces/http-adapter.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
@Injectable()
export class SeedService {
  private readonly axiosInstance: AxiosInstance = axios;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    @Inject(AxiosAdapter)
    private readonly request: HttpAdapter
  ) { }
  public async executeSeed() {
    try {
      await this.pokemonModel.deleteMany({});
      const data = await this.request.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=50');
      const pokemons = data.results.map(pokemon => {
        const { name, url } = pokemon;
        const no = url.split('/')[url.split('/').length - 2];
        const newPokemon = {
          name,
          no: +no
        }
        return newPokemon;
      })
      await this.pokemonModel.insertMany(pokemons);
    } catch (error) {
      console.log(error);
    }
  }
}
