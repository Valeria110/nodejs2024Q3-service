import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { DbService } from 'src/db/db.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly dbService: DbService) {}

  async findAll() {
    const [favTracks, favArtists, favAlbums] = await Promise.all([
      this.dbService.favTrack.findMany({ select: { track: true } }),
      this.dbService.favArtist.findMany({ select: { artist: true } }),
      this.dbService.favAlbum.findMany({ select: { album: true } }),
    ]);

    return {
      tracks: favTracks.map(({ track }) => track),
      artists: favArtists.map(({ artist }) => artist),
      albums: favAlbums.map(({ album }) => album),
    };
  }

  async findOneTrack(trackId: string) {
    return await this.dbService.favTrack.findUnique({
      where: { trackId },
    });
  }

  async createFavTrack(trackId: string) {
    if (!uuidValidate(trackId))
      throw new BadRequestException('Id is not a valid uuid');

    const track = await this.dbService.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      throw new UnprocessableEntityException(
        'Track with this id does not exist',
      );
    }
    const favTrack = await this.findOneTrack(trackId);
    if (!favTrack) {
      return await this.dbService.favTrack.create({
        data: { trackId },
      });
    }
  }

  async removeFavTrack(trackId: string) {
    if (!uuidValidate(trackId))
      throw new BadRequestException('Id is not a valid uuid');
    const favTrack = await this.dbService.favTrack.findUnique({
      where: { trackId },
    });

    if (favTrack) {
      return await this.dbService.favTrack.delete({ where: { trackId } });
    } else {
      throw new NotFoundException('Track with this id is not favorite');
    }
  }

  async findOneAlbum(albumId: string) {
    return await this.dbService.favAlbum.findUnique({
      where: { albumId },
    });
  }

  async createFavAlbum(albumId: string) {
    if (!uuidValidate(albumId))
      throw new BadRequestException('Id is not a valid uuid');

    const album = await this.dbService.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new UnprocessableEntityException(
        'Album with this id does not exist',
      );
    }

    const favAlbum = await this.findOneAlbum(albumId);
    if (!favAlbum) {
      return await this.dbService.favAlbum.create({
        data: { albumId },
      });
    }
  }

  async removeFavAlbum(albumId: string) {
    if (!uuidValidate(albumId))
      throw new BadRequestException('Id is not a valid uuid');

    const favAlbum = await this.dbService.favAlbum.findUnique({
      where: { albumId },
    });

    if (favAlbum) {
      return await this.dbService.favAlbum.delete({ where: { albumId } });
    } else {
      throw new NotFoundException('Album with this id is not favorite');
    }
  }

  async findOneArtist(artistId: string) {
    return await this.dbService.favArtist.findUnique({
      where: { artistId },
    });
  }

  async createFavArtist(artistId: string) {
    if (!uuidValidate(artistId))
      throw new BadRequestException('Id is not a valid uuid');

    const artist = await this.dbService.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      throw new UnprocessableEntityException(
        'Artist with this id does not exist',
      );
    }

    const favArtist = await this.findOneArtist(artistId);
    if (!favArtist) {
      return await this.dbService.favArtist.create({
        data: { artistId },
      });
    }
  }

  async removeFavArtist(artistId: string) {
    if (!uuidValidate(artistId))
      throw new BadRequestException('Id is not a valid uuid');

    const favArtist = await this.dbService.favArtist.findUnique({
      where: { artistId },
    });

    if (favArtist) {
      return await this.dbService.favArtist.delete({ where: { artistId } });
    } else {
      throw new NotFoundException('Album with this id is not favorite');
    }
  }
}
