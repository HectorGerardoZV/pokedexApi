import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import {BadRequestException} from '@nestjs/common'

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if(!isValidObjectId(value)) throw new BadRequestException(`${value} isn't a valid MongoId`)
    return value;
  }
}
