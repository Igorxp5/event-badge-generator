$inputPSD.change(function () {
    if (!checkConnection()) return;

    let reader = new FileReader();
    reader.onload = function () {
        let data = Array.from(new Uint8Array(reader.result));
        $inputPSD.readerResult = data;
        socket.emit('send_psd', data);
    }

    let fileURL = $(this).prop('files')[0];
    console.log(fileURL);

    if (fileURL) {
        loadingInputPSD(true);
        setTimeout(() => {
            reader.readAsArrayBuffer(fileURL, 'utf-8');
        }, 1000);
    } else {
        alertBox('Não foi possível realizar a leitura do arquivo!', ALERT_DANGER);
    }
});

$buttonGeneratePDF.click(function() {

});