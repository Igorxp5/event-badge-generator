//Constants
const TRANSITION_EFFECT_DURATION = 400;
const ALERT_DEFAULT_TIMEOUT = 5000;

const ALERT_PRIMARY = 'primary';
const ALERT_SUCCESS = 'success';
const ALERT_WARNING = 'warning';
const ALERT_DANGER = 'danger';

//DOM Elements

//Input PSD Container
let $bodyContent = $('#body-content');
let $uploadContent = $('#upload-container');
let $inputPSDContainer = $('#input-psd-container');
let $inputPSD = $('#input-psd');
let $inputPSDLoading = $('#loading-input-psd');
let $PSDImageContainer = $('#psd-image-container');
let $PSDImage = $('#psd-image');

//Form
let $formPSDTemplater = $('#form-psd-templater');
let $PDFSizePreset = $('#pdf-size-preset');
let $PDFSizeWidth = $('#pdf-size-width');
let $PDFSizeHeight = $('#pdf-size-height');

//Layers
let $listPSDLayers = $('#list-psd-layers');
let $noLayersYet = $('#no-layers-yet');

//Content Values
let $templateContentValues = $('#template-content-values');

//Generate PDF
let $buttonGeneratePDF = $('#btn-generate-pdf');
let $buttonGeneratePDFLoading = $('#loading-generate-psd');
