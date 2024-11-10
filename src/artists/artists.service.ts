import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as uuidValidate } from 'uuid';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ArtistsService {
  constructor(private readonly dbService: DbService) {}

  async findAll() {
    return await this.dbService.artist.findMany();
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const artist = await this.dbService.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException('Artist with this id does not exist');
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto) {
    return await this.dbService.artist.create({ data: createArtistDto });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    if (artist) {
      return await this.dbService.artist.update({
        where: { id },
        data: updateArtistDto,
      });
    }
  }

  async remove(id: string) {
    const artist = await this.findOne(id);
    if (artist) {
      return await this.dbService.artist.delete({ where: { id } });
    }
  }
}
