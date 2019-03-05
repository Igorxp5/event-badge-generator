//Exceptions
class InvalidQuantityColsError extends Error {}


//
function checkConnection() {
    let connected = socket.connected;
    if (!connected) {
        alert('Você ainda não está conectado ao servidor.');
    }
    return connected;
}

function alertBox(text, type, timeout) {
    if (timeout === undefined) {
        timeout = 3000;
    }

    let $alert = $('<div class="alert" role="alert" />');
    $alert.addClass('alert-' + type);
    $alert.text(text);
    $alert.hide();
    $alert.prependTo($bodyContent);
    $('html, body').animate({
        scrollTop: $alert.offset().top
    }, 1000);
    $alert.slideDown();

    if (timeout > 0) {
        setTimeout(function () {
            $alert.slideUp(TRANSITION_EFFECT_DURATION, function () {
                $alert.remove();
            });
        }, timeout);
    }

    return $alert;
}

function loadingInputPSD(loadingState, callback) {
    if (callback === undefined) {
        callback = function() {};
    }
    if (loadingState) {
        $inputPSDContainer.fadeOut(TRANSITION_EFFECT_DURATION, function() {
            $inputPSDLoading.removeClass('d-none').hide();
            $inputPSDLoading.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    } else {
        $inputPSDLoading.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $inputPSDContainer.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    }
}

function setPSDImage(image_data) {
    if (image_data) {
        loadingInputPSD(false);
        $uploadContent.fadeOut(TRANSITION_EFFECT_DURATION, function() {
            $PSDImage.attr('src', image_data)
            $PSDImageContainer.removeClass('d-none').hide();
            $PSDImageContainer.fadeIn();
        });
    }
}

function setListPSDLayers(layers) {
    if (layers) {
        let htmlContent = '';

        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            let id = layer['id'];
            let name = layer['name'];
            let $item = $('<a href="javascript:void(0);" class="psd-layer-list-item list-group-item '
                + 'list-group-item-action" data-layer-id="' + id + '">'
                + '<div class= "d-flex align-items-center justify-content-between">'
                + '<div class="col-6 p-0">'
                + '<img class="mr-3" style="width: 45px;" src="' + layer['image_data'] +'">'
                + '<input type="text" class="form-control d-inline-block w-auto" '
                + 'id="psd-layer-' + id + '-tag" value="' + name + '">'
                + '</div>'
                + '<div class="list-psd-layer-input col-5"></div></div></a>');
            if (layer['type'] == 'pixel') {
                let $imageInputGroup = $('<div class="input-group">'
                    + '<div class= "custom-file">'
                    + '<input id="psd-layer-'+ id + '-value" type="file" class="custom-file-input">'
                    + '<label class="custom-file-label" for="psd-layer-' + id + '">'
                    + 'Escolha uma imagem para ser a padrão'
                    + '</label>'
                    + '</div></div>');
                $imageInputGroup.appendTo($item.find('.list-psd-layer-input'));
            } else if (layer['type'] == 'type') {
                let $textInput = $('<input type="text" class="form-control" id="psd-layer-' + id + '-value" '
                    + 'placeholder="Valor padrão do campo">');
                $textInput.appendTo($item.find('.list-psd-layer-input'));
            }
            htmlContent += $item.prop('outerHTML');
        }
        $noLayersYet.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $listPSDLayers.html(htmlContent);
            bsCustomFileInput.init();
            $('.psd-layer-list-item').click(function () {
                $(this).toggleClass('active');
            });
        });
    } else {
        $listPSDLayers.fadeOut(TRANSITION_EFFECT_DURATION, function() {
            $listPSDLayers.html('');
            $noLayersYet.fadeIn();
        });
    }

}

function excelTextToObject(text) {
    let result = [];
    let rows = text.split('\n');
    let columnNames = rows[0].split('\t');
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].length != 0) {
            let data = rows[i].split('\t');
            if (data.length != columnNames.length) {
                throw new InvalidQuantityColsError(
                    'all rows must have ' + columnNames.length
                );
            }
            let row = {};
            for (let j = 0; j < data.length; j++) {
                row[columnNames[j]] = data[j];
            }
            result.push(row);
        }
    }
    return result;
}

function getInputLayers() {
    let inputs = {};
    $listPSDLayers.children('.active').each(function() {
        let id = parseInt($(this).data('layer-id'));
        let tag = $(this).find('input').val();
        inputs[id] = tag;
    });
    return inputs;
}

function validateToGeneratePDF() {
    //Have at least one layer selected
    if ($listPSDLayers.children('.active').length == 0) {
        alertBox('Pelo menos um campo deve ser selecionado para gerar!', ALERT_DANGER);
        return false;
    }

    let dataString = $templateContentValues.val();
    let data = excelTextToObject(dataString);

    return true;
}