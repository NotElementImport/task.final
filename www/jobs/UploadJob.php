<?php
namespace app\jobs;

use app\models\MusicPlaylist;
use app\models\MusicPoll;
use yii\base\BaseObject;
use yii\queue\JobInterface;
use FFMpeg\FFMpeg;

class UploadJob extends BaseObject implements JobInterface
{
    public $name;
    public $file;
    public $genre;
    public $userid;

    public function execute($queue)
    {
        MusicPoll::RemoveFromPoll($this->userid);

        $OriginalPath = __DIR__.'/../web'.$this->file;

        $CompressMP3 = FFMpeg::create([
            'timeout' => 0
        ]);

        //Safe mode;
        if(file_exists($OriginalPath))
        {
            $Audio = $CompressMP3->open(__DIR__.'/../web'.$this->file);
            $Format = new \FFMpeg\Format\Audio\Mp3();
            $Format->setAudioKiloBitrate(128);
    
            $CompressPath = __DIR__.'/../web/uploads/'.$this->name.'.mp3';
    
            $Audio->save($Format, $CompressPath);

            unlink($OriginalPath);

            $OutputPath = '/uploads/'.$this->name.'.mp3';

            MusicPlaylist::AddToPlaylist($this->name, $OutputPath, $this->genre, $this->userid);
        }
    }
}