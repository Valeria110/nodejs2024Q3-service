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
import { ITrack } from 'src/tracks/interfaces/track.interface';
import { IArtist } from './interfaces/artist.interface';
import { AlbumsService } from 'src/albums/albums.service';
import { IAlbum } from 'src/albums/interfaces/album.interface';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistsService {
  private artists = new Map<string, IArtist>();

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  findAll(): IArtist[] {
    return [...this.artists.values()];
  }

  findOne(id: string): IArtist {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist with this id does not exist');
    }
    return artist;
  }

  create(createArtistDto: CreateArtistDto): IArtist {
    const artistData = { id: uuidv4(), ...createArtistDto };
    this.artists.set(artistData.id, artistData);
    return artistData;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.findOne(id);
    if (artist) {
      const updatedArtistData = { ...artist, ...updateArtistDto };
      this.artists.set(id, updatedArtistData);
      return updatedArtistData;
    }
  }

  remove(id: string) {
    const artist = this.findOne(id);
    if (artist) {
      this.tracksService.findAll().forEach((track) => {
        if (track.artistId === id) {
          const updatedTrackData: ITrack = { ...track, artistId: null };
          this.tracksService.update(track.id, updatedTrackData);
          return;
        }
      });

      this.albumsService.findAll().forEach((album) => {
        if (album.artistId === id) {
          const updatedAlbumData: IAlbum = { ...album, artistId: null };
          this.albumsService.update(album.id, updatedAlbumData);
          return;
        }
      });

      const favArtist = this.favoritesService.findOneArtist(id);
      if (favArtist) this.favoritesService.removeFavArtist(id);
      this.artists.delete(id);
    }
  }
}
