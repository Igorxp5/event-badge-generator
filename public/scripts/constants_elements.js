//Constants
const TRANSITION_EFFECT_DURATION = 400;

const ALERT_PRIMARY = 'primary';
const ALERT_SUCCESS = 'success';
const ALERT_WARNING = 'warning';
const ALERT_DANGER = 'warning';

//DOM Elements

//Input PSD Container
let $bodyContent = $('#body-content');
let $uploadContent = $('#upload-container');
let $inputPSDContainer = $('#input-psd-container');
let $inputPSD = $('#input-psd');
let $inputPSDLoading = $('#loading-input-psd');
let $PSDImageContainer = $('#psd-image-container');
let $PSDImage = $('#psd-image');

//Layers
let $listPSDLayers = $('#list-psd-layers');
let $noLayersYet = $('#no-layers-yet');

//Content Values
let $templateContentValues = $('#template-content-values');

//Generate PDF
let $buttonGeneratePDF = $('#btn-generate-pdf');
let $buttonGeneratePDFLoading = $('#loading-generate-psd');
