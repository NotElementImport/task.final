<?php

namespace app\models;

use yii\db\ActiveRecord;

class MusicPlaylist extends ActiveRecord
{
    public static function tableName()
    {
        return "music_playlist";
    }

    public static function AddToPlaylist(string $NameSong, string $PathToSong, string $Genre, int $iduser = null, string $image = null)
    {
        $AppMusic = new MusicPlaylist();
        $AppMusic->songname = $NameSong;
        $AppMusic->songfile = $PathToSong;
        $AppMusic->imagefile = ($image == null ? '/uploads/null.webp' : $image);
        $AppMusic->genre = $Genre;
        $AppMusic->whoupload = ($iduser == null ? \Yii::$app->user->getId() : $iduser);

        if(!$AppMusic->save())
        {
            return -1;
        }

        return 0;
    }

    public static function CountPagesFromDataPlaylist($GenreId, $Limit)
    {
        $Count = MusicPlaylist::find() -> where( ($GenreId != 0 ? "genre = $GenreId" : '') ) -> count();

        return ( $Count > $Limit ? ceil( $Count * (1 / $Limit)) : 0 );
    }

    public static function GetFromPlaylist($GenreId = 0, $OffsetIndex = 0, $Limit = 5)
    {
        /*
        SELECT 
            music_playlist.songname as name, 
            music_playlist.songfile as track, 
            genres.name, 
            music_playlist.imagefile as image 
        FROM music_playlist 
        LEFT JOIN 
            genres 
                ON music_playlist.genre = genres.id
        LEFT JOIN 
            user 
                ON music_playlist.whoupload = user.id
        LIMIT 5 
        OFFSET 0
        */

        $DataTo = (new \yii\db\Query())->select(
            [
                'music_playlist.songname AS name',
                'music_playlist.songfile as track',
                'genres.name as genre',
                'music_playlist.imagefile as image',
                'user.username as who',
            ]
        )->from(
            'music_playlist'
        )->leftJoin(
            'genres',
            'music_playlist.genre = genres.id'
        )->leftJoin(
            'user',
            'music_playlist.whoupload = user.id'
        )->where(
            ($GenreId != 0 ? "music_playlist.genre = $GenreId" : '')
        )->orderBy(
            'music_playlist.id DESC'
        )->limit(
            $Limit
        )->offset(
            $OffsetIndex * $Limit
        )->all();

        return json_encode($DataTo);
    }
}

?>