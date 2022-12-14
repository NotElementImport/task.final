<?php

use \app\assets\UploadAssets;
UploadAssets::register($this);

$this->title = "Upload file";

?>
<div class="container-md bg-light Shadow-l" style="margin-top: 0.7em;">
    <div class="container text-center p-3">

        <audio src="" hidden="true" controls id="Sounds"></audio>

        <form class="gy-2 gx-3 align-items-center p-3 border rounded">
            <div class="row">
                <div class="col-6 mobile-width">
                    <label class="visually-hidden" for="song_name">Song Name : </label>
                    <input type="text" class="form-control" id="song_name" placeholder="Автор - Название">
                </div>
                <div class="col mobile-width">
                    <label class="visually-hidden" for="genres">Preference</label>
                    <select class="form-select" id="genres">
                        <?php $Iterator = 0; ?>
                        <?php foreach($AllGenres as $val): ?>
                            <option value="<?=$val->id?>" <?=($Iterator == 0 ? "selected" : "")?>>Жанр : <?=$val->name?></option>
                            
                            <?php $Iterator += 1; ?>
                        <?php endforeach;?>
                    </select>
                </div>
                <div class="col-auto item_submit">
                    <button id="ButtonUpload" type="button" class="disabled btn btn-primary">Загрузить</button>
                </div>
            </div>
            <label class="FileLoad" ondragover="event.preventDefault();" for="FileUpload">
                <input type="file" ondragover="event.preventDefault();" accept="audio/mp3, audio/wav, audio/ogg" id="FileUpload">
            </label>
        </form>

        <div id="Output">
            
        </div>

    </div>
</div>