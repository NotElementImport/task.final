// const Modal = {
//     modal : new bootstrap.Modal('#modal', { keyboard: false }),

//     modal_header : document.getElementById('modal-header'),

//     modal_text : document.getElementById('modal-text'),

//     show_with_text : (header = "Test Header", text = "Test Text") =>{
//         Modal.modal_header.innerHTML = header;
//         Modal.modal_text.innerHTML = text;

//         Modal.modal.show();
//     },

//     hide : () => {
//         Modal.modal.hide();
//     }
// };

const AudioPlayer = {
    AllSources : [],

    _SourcePlay : -1,
    _SourceElement : null,
    
    DropInfoPlaying : () => { AudioPlayer._SourcePlay = -1; AudioPlayer._SourceElement = null; },

    SourcePlay : (id_source) => { AudioPlayer.AllSources[id_source].play(); },
    SourcePause : (id_source) => { AudioPlayer.AllSources[id_source].pause(); },
    SourceStop : (id_source) => { AudioPlayer.AllSources[id_source].seekTo(0); AudioPlayer.AllSources[id_source].pause(); },

    TurnOffCurrentOldSource : () => { AudioPlayer.AllSources[AudioPlayer._SourcePlay].pause(); AudioPlayer.ChangeIconPlayElement(AudioPlayer._SourceElement, 'play'); },

    IsPlayingSource : () => (AudioPlayer._SourcePlay != -1 && AudioPlayer._SourceElement != null ? true : false),
    IsPlayingId : (id_source) => (AudioPlayer._SourcePlay == id_source ? true : false),

    ChangeIconPlayElement : (element, type) => { element.childNodes[1].setAttribute('class', `bi bi-${type}`); },

    ToggleAudio : (id_source, element) => {

        AudioPlayer.SourcePlay(id_source);

        AudioPlayer.ChangeIconPlayElement(element, 'pause');

        if(AudioPlayer.IsPlayingSource() && !AudioPlayer.IsPlayingId(id_source))
        {
            AudioPlayer.TurnOffCurrentOldSource();
        }
        else if (AudioPlayer.IsPlayingId(id_source))
        {
            AudioPlayer.TurnOffCurrentOldSource();

            AudioPlayer.DropInfoPlaying();

            return;
        }

        AudioPlayer._SourcePlay = id_source;
        AudioPlayer._SourceElement = element;

    },

    StopAudio : (id_source, element) => {
        if (AudioPlayer.IsPlayingId(id_source))
        {
            AudioPlayer.TurnOffCurrentOldSource();
            AudioPlayer.DropInfoPlaying();
        }

        AudioPlayer.SourceStop(id_source);
    }

};

const FormElements = {
    page : Number.parseInt(document.querySelector('[page]').getAttribute("page")),
    csrf : {
        param_name :  document.querySelector('meta[name=csrf-param]').getAttribute("content"),
        param_value : document.querySelector('meta[name=csrf-token]').getAttribute("content")
    },
    
    genres : document.getElementById('genres'),
    genres_value : () => FormElements.genres.options[FormElements.genres.selectedIndex].value,

    track_playlist : document.getElementById('track_playlist'),
    track_playlist_set_data : (new_data) => { FormElements.track_playlist.innerHTML = new_data; },

    form_submit : () => {
        let Form = new FormData();

        Form.append(FormElements.csrf.param_name, FormElements.csrf.param_value);

        Form.append('page', FormElements.page);
        Form.append('genre', FormElements.genres_value());

        return Form;
    }
};

const RequestLoadTrack = async () => {
    fetch('/',
        {
            method : 'post',
            body : FormElements.form_submit()
        }
    ).then(e => e.json()).then(e =>{
        FormElements.track_playlist_set_data('');
        
        AdaptTracks(e);
    });
};

RequestLoadTrack();

let UniqElementId = 0;
const AdaptTracks = async (json_data) => {
    UniqElementId = 0;

    json_data.forEach(data => {
        let RootForTemplate = document.createElement('div');
        RootForTemplate.setAttribute('class','card mb-3');

        let Template = `
            <div class="row g-0">
                <div class="div-img border-end rounded-start col-md-3" style="background-image: url('${data.image}');">
                    
                </div>
                <div class="col">
                    <div class="card-body" style="text-align: left;">
                        <h5 class="card-title p-2">${data.name}</h5>
                        <div class="p-2 border rounded">
                            <div class="WaveForm${UniqElementId}" style="height: 128px; position: relative;">
                                <div class="duration Shadow border rounded">
                                    <span id="Duration${UniqElementId}"> </span>
                                </div>
                                <div class="controller row g-0">
                                    <div class="col">
                                        <button onclick="AudioPlayer.ToggleAudio(${UniqElementId}, this)" class="t_load${UniqElementId} disabled btn btn-primary Shadow circle ButtonToggle${UniqElementId}">
                                            <i class="bi bi-play"></i>
                                        </button>
                                        <button onclick="AudioPlayer.StopAudio(${UniqElementId}, this)" class="t_load${UniqElementId} disabled btn btn-light Shadow circle border">
                                            <i class="bi bi-stop"></i>
                                        </button>
                                    </div>   
                                    <div class="col text-end" style="pointer-events: none;">
                                        <small class="text-muted background Shadow border rounded"> ${data.genre} </small>
                                    </div>
                                </div>
                                <span class="message-on-middle" id="t_load${UniqElementId}">
                                    Загрузка ...
                                </span>
                            </div>
                        </div>
                        <small class="text-muted"> Загружено: ${data.who} </small>
                    </div>
                </div>
            </div>
        `;
        RootForTemplate.innerHTML = Template;
        FormElements.track_playlist.appendChild(RootForTemplate);

        ProccesTrack(data.track);

        UniqElementId += 1;
    });
};

const ProccesTrack = (track) => {
    const AllElementsInTemplate = {
        ButtonPausePlay : document.getElementsByClassName(`ButtonToggle${UniqElementId}`)[0],
        LoadTitle : document.getElementById(`t_load${UniqElementId}`),
        DurationInfo : document.getElementById(`Duration${UniqElementId}`),
        AllButtons : document.querySelectorAll(`button.t_load${UniqElementId}`)
    };

    let Wave = WaveSurfer.create({
        container: document.getElementsByClassName(`WaveForm${UniqElementId}`)[0],
        waveColor: '#0d6efd',
        progressColor: 'purple',
        backend : 'MediaElementWebAudio',
        barWidth: 2,
        barHeight: 1,
        barGap: null
    });

    Wave.on('error', function (e) { 
        console.log(e);
    });

    Wave.on('finish', function () { 
        StopAudio(UniqElementId, ButtonToggle);
    });

    Wave.on('ready', function () {
        console.log();
        let Duration = Math.floor(Wave.getDuration());
        let Minute = Math.floor(Duration * (1 / 60));

        AllElementsInTemplate.AllButtons.forEach(Element => {
            Element.classList.remove('disabled', `t_load${UniqElementId}`);
        });

        AllElementsInTemplate.LoadTitle.remove();

        AllElementsInTemplate.DurationInfo.innerHTML = Minute + ":" + (Duration % 60);
    });

    AudioPlayer.AllSources.push(
        Wave
    );
    
    Wave.load(track);
};