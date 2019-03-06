//Constants
const TRANSITION_EFFECT_DURATION = 400;
const ALERT_DEFAULT_TIMEOUT = 5000;
const INTERVAL_LOADING_GENERATE_PDF = 400;

const ALERT_PRIMARY = 'primary';
const ALERT_SUCCESS = 'success';
const ALERT_WARNING = 'warning';
const ALERT_DANGER = 'danger';

//Attributes
let layerIDAttr = 'layer-id';

//Element Selectors
let bodyContentSelector = '#body-content';
let uploadContentSelector = '#upload-container';
let inputPSDContainerSelector = '#input-psd-container';
let inputPSDSelector = '#input-psd';
let inputPSDLoadingSelector = '#loading-input-psd';
let PSDImageContainerSelector = '#psd-image-container';
let PSDImageSelector = '#psd-image';

let formPSDTemplaterSelector = '#form-psd-templater';
let PDFSizePresetSelector = '#pdf-size-preset';
let PDFSizeWidthSelector = '#pdf-size-width';
let PDFSizeHeightSelector = '#pdf-size-height';

let listPSDLayersSelector = '#list-psd-layers';
let noLayersYetSelector = '#no-layers-yet';
let PSDLayerImageDataSelector = '.psd-layer-image-data';
let PSDLayerImageDataLoadingSelector = '.psd-layer-image-data-loading';
let PSDLayerListItemSelector = '.psd-layer-list-item';
let PSDLayerPixelInputFileSelector = '.psd-layer-pixel-input-file';
let PSDLayerIDSelector = '#psd-layer-';
let listPSDLayerInputSelector = '.list-psd-layer-input';

//Help Classes
let loadingClass = 'loading';
let layerImageLoading = 'loading-image';
let layerImageLoaded = 'image-loaded';


let templateContentValuesSelector = '#template-content-values';

let buttonGeneratePDF = '#btn-generate-pdf';
let buttonGeneratePDFLoadingContainerSelector = '#loading-generate-psd-container';
let buttonGeneratePDFLoadingSelector = '#loading-generate-psd';
let PDFFileLinkSelector = '#pdf-file-link';

let resetApllicationSelector = '#reset-application';

//DOM Elements

//Input PSD Container
let $bodyContent = $(bodyContentSelector);
let $uploadContent = $(uploadContentSelector);
let $inputPSDContainer = $(inputPSDContainerSelector);
let $inputPSD = $(inputPSDSelector);
let $inputPSDLoading = $(inputPSDLoadingSelector);
let $PSDImageContainer = $(PSDImageContainerSelector);
let $PSDImage = $(PSDImageSelector);

//Form
let $formPSDTemplater = $(formPSDTemplaterSelector);
let $PDFSizePreset = $(PDFSizePresetSelector);
let $PDFSizeWidth = $(PDFSizeWidthSelector);
let $PDFSizeHeight = $(PDFSizeHeightSelector);

//Layers
let $listPSDLayers = $(listPSDLayersSelector);
let $noLayersYet = $(noLayersYetSelector);

//Content Values
let $templateContentValues = $(templateContentValuesSelector);

//Generate PDF
let $buttonGeneratePDF = $(buttonGeneratePDF);
let $buttonGeneratePDFLoadingContainer = $(buttonGeneratePDFLoadingContainerSelector);
let $buttonGeneratePDFLoading = $(buttonGeneratePDFLoadingSelector);
let $PDFFileLink = $(PDFFileLinkSelector);


//Button to reset application
let $resetApllication = $(resetApllicationSelector);
