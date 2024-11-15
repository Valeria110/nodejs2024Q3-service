/*
  Warnings:

  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavAlbumToFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavArtistToFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FavTrackToFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "_FavAlbumToFavorites" DROP CONSTRAINT "_FavAlbumToFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavAlbumToFavorites" DROP CONSTRAINT "_FavAlbumToFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_FavArtistToFavorites" DROP CONSTRAINT "_FavArtistToFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavArtistToFavorites" DROP CONSTRAINT "_FavArtistToFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_FavTrackToFavorites" DROP CONSTRAINT "_FavTrackToFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_FavTrackToFavorites" DROP CONSTRAINT "_FavTrackToFavorites_B_fkey";

-- DropTable
DROP TABLE "Favorites";

-- DropTable
DROP TABLE "_FavAlbumToFavorites";

-- DropTable
DROP TABLE "_FavArtistToFavorites";

-- DropTable
DROP TABLE "_FavTrackToFavorites";
