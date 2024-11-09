import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { TracksService } from 'src/tracks/tracks.service';
import { IArtist } from './interfaces/artist.interface';
import { AlbumsService } from 'src/albums/albums.service';
import { IAlbum } from 'src/albums/interfaces/album.interface';
import { FavoritesService } from 'src/favorites/favorites.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly dbService: DbService,
  ) {}

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
      this.albumsService.findAll().forEach((album) => {
        if (album.artistId === id) {
          const updatedAlbumData: IAlbum = { ...album, artistId: null };
          this.albumsService.update(album.id, updatedAlbumData);
          return;
        }
      });

      const favArtist = this.favoritesService.findOneArtist(id);
      if (favArtist) this.favoritesService.removeFavArtist(id);

      return await this.dbService.artist.delete({ where: { id } });
    }
  }
}
