import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class TracksService {
  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly dbService: DbService,
  ) {}

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
      this.albumsService.findOne(createTrackDto.albumId);

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
        this.albumsService.findOne(updateTrackDto.albumId);

      return await this.dbService.track.update({
        where: { id },
        data: updateTrackDto,
      });
    }
  }

  async remove(id: string) {
    const track = await this.findOne(id);
    if (track) {
      const favTrack = this.favoritesService.findOneTrack(id);
      if (favTrack) this.favoritesService.removeFavTrack(id);
      return await this.dbService.track.delete({ where: { id } });
    }
  }
}
