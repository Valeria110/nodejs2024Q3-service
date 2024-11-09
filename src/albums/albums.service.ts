import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from 'src/favorites/favorites.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly dbService: DbService,
  ) {}

  async findAll() {
    return await this.dbService.album.findMany();
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const album = await this.dbService.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album with this id does not exist');
    }
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto) {
    createAlbumDto.artistId &&
      (await this.dbService.artist.findUnique({
        where: { id: createAlbumDto.artistId },
      }));

    return await this.dbService.album.create({ data: createAlbumDto });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findOne(id);
    if (album) {
      updateAlbumDto.artistId &&
        (await this.dbService.artist.findUnique({
          where: { id: updateAlbumDto.artistId },
        }));
      return await this.dbService.album.update({
        where: { id },
        data: updateAlbumDto,
      });
    }
  }

  async remove(id: string) {
    const album = await this.findOne(id);
    if (album) {
      const favAlbum = this.favoritesService.findOneAlbum(id);
      if (favAlbum) this.favoritesService.removeFavAlbum(id);

      return await this.dbService.album.delete({ where: { id } });
    }
  }
}
