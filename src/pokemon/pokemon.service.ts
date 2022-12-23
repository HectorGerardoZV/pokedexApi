import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit:number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('DEFAULT_LIMIT');
  }
  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    try {
      const { name, no } = createPokemonDto;
      const newPokemon = {
        name: name.trim().toLowerCase(),
        no
      }
      const pokemonCreated: Pokemon = await this.pokemonModel.create(newPokemon);
      return pokemonCreated;
    } catch (error) {
      const { code, keyValue } = error;
      if (code === 11000) {
        const key = Object.keys(keyValue)[0];
        const value = keyValue[key];
        throw new BadRequestException(`The pokemon with '${key}' '${value}' already exist`)
      }
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {    
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    
    return await this.pokemonModel.find({})
      .limit(limit)
      .skip(offset * limit)
      .sort({ no: 1 })
      .select('-__v')
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon = null;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }
    else if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findOne({ _id: term });
    }
    else {
      pokemon = await this.pokemonModel.findOne({ name: { $regex: `.*${term.trim().toLowerCase()}.*` } });
    }
    if (!pokemon) throw new NotFoundException('The pokemon with the name, id or number doesn\'t exist');
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const { name, no } = updatePokemonDto;
      const newPokemonInfo = {
        name: name.trim().toLowerCase(),
        no
      }
      const productUpdated = await this.pokemonModel.findOneAndUpdate({ _id: id }, newPokemonInfo, { new: true });
      if (!productUpdated) throw new NotFoundException(`The pokemon with the id ${id} doesn't exist`);
      return productUpdated;
    } catch (error) {
      const { code, keyValue } = error;
      if (code === 11000) {
        const key = Object.keys(keyValue)[0];
        const value = keyValue[key];
        throw new BadRequestException(`The pokemon with '${key}' '${value}' already exist`)
      }
    }

  }

  async remove(id: string): Promise<string> {
    const pokemonDeleted = await this.pokemonModel.findOneAndDelete({ _id: id });
    if (!pokemonDeleted) throw new NotFoundException(`The pokemon with the id ${id} doesn't exist`);
    return 'Pokemon deleted successfully';
  }
}
