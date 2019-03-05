$(document).ready(function() {
    setPDFSizeByPreset();
});

$inputPSD.change(function () {
    if (!checkConnection()) return;

    let reader = new FileReader();
    reader.onload = function () {
        let data = Array.from(new Uint8Array(reader.result));
        $inputPSD.readerResult = data;
        socket.emit('send_psd', data);
    }

    let fileURL = $(this).prop('files')[0];

    if (fileURL) {
        loadingInputPSD(true, function() {
            reader.readAsArrayBuffer(fileURL, 'utf-8');
        });
    } else {
        alertBox('Não foi possível realizar a leitura do arquivo!', ALERT_DANGER);
    }
});

$PDFSizePreset.change(setPDFSizeByPreset);
$PDFSizeWidth.change(setPresetByPSDSizeInput);
$PDFSizeWidth.keyup(setPresetByPSDSizeInput);
$PDFSizeHeight.change(setPresetByPSDSizeInput);
$PDFSizeHeight.keyup(setPresetByPSDSizeInput);

$formPSDTemplater.submit(function(event) {
    if(validateToGeneratePDF()) {
        loadingGeneratePDF(true);
        let inputLayerAndData = getInputLayersAndData();
        socket.emit('send_input_layers_data', inputLayerAndData);
    }
    event.preventDefault();
    return false;
})

$buttonGeneratePDF.click(function() {
    $formPSDTemplater.submit();
});