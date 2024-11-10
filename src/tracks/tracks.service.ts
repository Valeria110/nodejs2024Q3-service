import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as uuidValidate } from 'uuid';
import { DbService } from 'src/db/db.service';

@Injectable()
export class TracksService {
  constructor(private readonly dbService: DbService) {}

  async findAll() {
    return await this.dbService.track.findMany();
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const track = await this.dbService.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException('Track with this id does not exist');
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto) {
    createTrackDto.artistId &&
      (await this.dbService.artist.findUnique({
        where: { id: createTrackDto.artistId },
      }));

    createTrackDto.albumId &&
      (await this.dbService.album.findUnique({
        where: { id: createTrackDto.albumId },
      }));

    return await this.dbService.track.create({ data: createTrackDto });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);
    if (track) {
      updateTrackDto.artistId &&
        (await this.dbService.artist.findUnique({
          where: { id: updateTrackDto.artistId },
        }));

      updateTrackDto.albumId &&
        (await this.dbService.album.findUnique({
          where: { id: updateTrackDto.albumId },
        }));

      return await this.dbService.track.update({
        where: { id },
        data: updateTrackDto,
      });
    }
  }

  async remove(id: string) {
    const track = await this.findOne(id);
    if (track) {
      return await this.dbService.track.delete({ where: { id } });
    }
  }
}
