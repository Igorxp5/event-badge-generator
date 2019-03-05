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

$formPSDTemplater.submit(function(event) {
    validateToGeneratePDF();
    let inputLayerAndData = getInputLayersAndData();
    socket.emit('send_input_layres_data', inputLayerAndData);
    event.preventDefault();
    return false;
})

$buttonGeneratePDF.click(function() {
    $formPSDTemplater.submit();
});