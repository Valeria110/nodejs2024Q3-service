import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { IAlbum } from './interfaces/album.interface';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { ITrack } from 'src/tracks/interfaces/track.interface';

@Injectable()
export class AlbumsService {
  private albums = new Map<string, IAlbum>();

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  findAll() {
    return [...this.albums.values()];
  }

  findOne(id: string) {
    if (!uuidValidate(id)) {
      throw new BadRequestException('Id is not a valid uuid');
    }
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException('Album with this id does not exist');
    }
    return album;
  }

  create(createAlbumDto: CreateAlbumDto) {
    createAlbumDto.artistId &&
      this.artistsService.findOne(createAlbumDto.artistId);

    const albumData: IAlbum = { id: uuidv4(), ...createAlbumDto };
    this.albums.set(albumData.id, albumData);
    return albumData;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);
    if (album) {
      updateAlbumDto.artistId &&
        this.artistsService.findOne(updateAlbumDto.artistId);
      const updatedAlbumData = { ...album, ...updateAlbumDto };
      this.albums.set(id, updatedAlbumData);

      return updatedAlbumData;
    }
  }

  remove(id: string) {
    const album = this.findOne(id);
    if (album) {
      this.albums.delete(id);
      this.tracksService.findAll().forEach((track) => {
        if (track.albumId === id) {
          const updatedTrackData: ITrack = { ...track, albumId: null };
          this.tracksService.update(track.id, updatedTrackData);
        }
      });
    }
  }
}
