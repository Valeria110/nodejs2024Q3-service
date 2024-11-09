import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Get('track/:id')
  findOneTrack(@Param('id') id: string) {
    return this.favoritesService.findOneTrack(id);
  }

  @Post('track/:id')
  createFavTrack(@Param('id') id: string) {
    return this.favoritesService.createFavTrack(id);
  }

  @HttpCode(204)
  @Delete('track/:id')
  removeFavTrack(@Param('id') id: string) {
    return this.favoritesService.removeFavTrack(id);
  }

  @Get('album/:id')
  findOneAlbum(@Param('id') id: string) {
    return this.favoritesService.findOneAlbum(id);
  }

  @Post('album/:id')
  createFavAlbum(@Param('id') id: string) {
    return this.favoritesService.createFavAlbum(id);
  }

  @HttpCode(204)
  @Delete('album/:id')
  removeFavAlbum(@Param('id') id: string) {
    return this.favoritesService.removeFavAlbum(id);
  }

  @Get('artist/:id')
  findOneArtist(@Param('id') id: string) {
    return this.favoritesService.findOneArtist(id);
  }

  @Post('artist/:id')
  createFavArtist(@Param('id') id: string) {
    return this.favoritesService.createFavArtist(id);
  }

  @HttpCode(204)
  @Delete('artist/:id')
  removeFavArtist(@Param('id') id: string) {
    return this.favoritesService.removeFavArtist(id);
  }
}
