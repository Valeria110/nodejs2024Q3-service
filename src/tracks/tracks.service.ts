import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ITrack } from './interfaces/track.interface';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { ArtistsService } from 'src/artists/artists.service';
import { AlbumsService } from 'src/albums/albums.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TracksService {
  private tracks = new Map<string, ITrack>();

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  findAll(): ITrack[] {
    return [...this.tracks.values()];
  }

  findOne(id: string): ITrack {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException('Track with this id does not exist');
    }

    return track;
  }

  create(createTrackDto: CreateTrackDto): ITrack {
    createTrackDto.artistId &&
      this.artistsService.findOne(createTrackDto.artistId);
    createTrackDto.albumId &&
      this.albumsService.findOne(createTrackDto.albumId);

    const trackId = uuidv4();
    this.tracks.set(trackId, { ...createTrackDto, id: trackId });
    return this.tracks.get(trackId);
  }

  update(id: string, updateTrackDto: UpdateTrackDto): ITrack {
    const track = this.findOne(id);
    if (track) {
      updateTrackDto.artistId &&
        this.artistsService.findOne(updateTrackDto.artistId);
      updateTrackDto.albumId &&
        this.albumsService.findOne(updateTrackDto.albumId);

      const updatedTrackData = { ...track, ...updateTrackDto };
      this.tracks.set(id, updatedTrackData);
      return updatedTrackData;
    }
  }

  remove(id: string) {
    const track = this.findOne(id);
    if (track) {
      const favTrack = this.favoritesService.findOneTrack(id);
      if (favTrack) this.favoritesService.removeFavTrack(id);
      this.tracks.delete(id);
    }
  }
}
