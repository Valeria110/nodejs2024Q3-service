import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IFavs } from './interfaces/favs.interface';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';
import { validate as uuidValidate } from 'uuid';
import { IArtist } from 'src/artists/interfaces/artist.interface';
import { IAlbum } from 'src/albums/interfaces/album.interface';
import { ITrack } from 'src/tracks/interfaces/track.interface';

@Injectable()
export class FavoritesService {
  private favArtists = new Map<string, IArtist>();
  private favAlbums = new Map<string, IAlbum>();
  private favTracks = new Map<string, ITrack>();
  private favs: IFavs = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  findAll() {
    return this.favs;
  }

  findOneTrack(trackId: string) {
    return this.favTracks.get(trackId);
  }

  createFavTrack(trackId: string) {
    if (!uuidValidate(trackId))
      throw new BadRequestException('Id is not a valid uuid');
    if (!this.tracksService.findAll().some((track) => track.id === trackId)) {
      throw new UnprocessableEntityException(
        'Track with this id does not exist',
      );
    }

    const track = this.tracksService.findOne(trackId);
    if (!this.favTracks.has(trackId)) {
      this.favTracks.set(trackId, track);
      this.favs.tracks = [...this.favTracks.values()];
      return this.favs.tracks;
    }
  }

  removeFavTrack(trackId: string) {
    if (!uuidValidate(trackId))
      throw new BadRequestException('Id is not a valid uuid');

    if (this.favTracks.has(trackId)) {
      this.favTracks.delete(trackId);
      this.favs.tracks = [...this.favTracks.values()];
    } else {
      throw new NotFoundException('Track with this id is not favorite');
    }
  }

  findOneAlbum(albumId: string) {
    return this.favAlbums.get(albumId);
  }

  createFavAlbum(albumId: string) {
    if (!uuidValidate(albumId))
      throw new BadRequestException('Id is not a valid uuid');
    if (!this.albumsService.findAll().some((album) => album.id === albumId)) {
      throw new UnprocessableEntityException(
        'Album with this id does not exist',
      );
    }

    const album = this.albumsService.findOne(albumId);
    if (!this.favAlbums.has(albumId)) {
      this.favAlbums.set(albumId, album);
      this.favs.albums = [...this.favAlbums.values()];
      return this.favs.albums;
    }
  }

  removeFavAlbum(albumId: string) {
    if (!uuidValidate(albumId))
      throw new BadRequestException('Id is not a valid uuid');

    if (this.favAlbums.has(albumId)) {
      this.favAlbums.delete(albumId);
      this.favs.albums = [...this.favAlbums.values()];
    } else {
      throw new NotFoundException('Album with this id is not favorite');
    }
  }

  findOneArtist(artistId: string) {
    return this.favArtists.get(artistId);
  }

  createFavArtist(artistId: string) {
    if (!uuidValidate(artistId))
      throw new BadRequestException('Id is not a valid uuid');
    if (
      !this.artistsService.findAll().some((artist) => artist.id === artistId)
    ) {
      throw new UnprocessableEntityException(
        'Artist with this id does not exist',
      );
    }

    const artist = this.artistsService.findOne(artistId);
    if (!this.favArtists.has(artistId)) {
      this.favArtists.set(artistId, artist);
      this.favs.artists = [...this.favArtists.values()];
      return this.favs.artists;
    }
  }

  removeFavArtist(artistId: string) {
    if (!uuidValidate(artistId))
      throw new BadRequestException('Id is not a valid uuid');

    if (this.favArtists.has(artistId)) {
      this.favArtists.delete(artistId);
      this.favs.artists = [...this.favArtists.values()];
    } else {
      throw new NotFoundException('Album with this id is not favorite');
    }
  }
}
