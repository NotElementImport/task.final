<?php

namespace app\assets;

use yii\web\AssetBundle;

class IndexAssets extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [];
    public $js = [
        'https://unpkg.com/wavesurfer.js',
        '/js/home.js'
    ];
    public $depends = [
        'app\assets\MusicAsset'
    ];
}

?>