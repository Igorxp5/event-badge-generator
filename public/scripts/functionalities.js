//Exceptions
class InvalidQuantityColsError extends Error {}
class MissingColsError extends Error {}


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
        timeout = ALERT_DEFAULT_TIMEOUT;
    }

    let $alert = $('<div class="alert container" role="alert" />');
    $alert.addClass('alert-' + type);
    $alert.html(text);
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

function loadingLayerImage($layerItem, loadingState, callback) {
    if (callback === undefined) {
        callback = function () { };
    }
    let $image = $layerItem.find('.psd-layer-image-data');
    let $loading = $layerItem.find('.psd-layer-image-data-loading');
    if (loadingState) {
        $layerItem.addClass('loading-image');
        $image.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $loading.removeClass('d-none').hide();
            $loading.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    } else {
        $layerItem.removeClass('loading-image');
        $loading.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $image.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    }
}

function setLayerImageSrc($layerItem, src) {
    $layerItem.find('.psd-layer-image-data').attr('src', src);
}

function setListPSDLayers(layers) {
    if (layers) {
        let htmlContent = '';

        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            let id = layer['id'];
            let name = layer['name'].toUpperCase();
            let $item = $('<a href="javascript:void(0);" class="psd-layer-list-item list-group-item '
                + 'list-group-item-action" data-layer-id="' + id + '">'
                + '<div class= "d-flex align-items-center justify-content-between">'
                + '<div class="col-6 p-0">'
                + '<div class="psd-layer-image-data-container mr-3 d-inline-block align-middle">'
                + '<div class="psd-layer-image-data-loading spinner-border text-primary d-none"></div>'
                + '<img class="psd-layer-image-data" style="width: 50px;" src="' + layer['image_data'] +'">'
                + '</div>'
                + '<input type="text" class="form-control d-inline-block w-auto" '
                + 'id="psd-layer-' + id + '-tag" value="' + name + '" required>'
                + '</div>'
                + '<div class="list-psd-layer-input col-5"></div></div></a>');
            if (layer['type'] == 'pixel') {
                let $imageInputGroup = $('<div class="input-group">'
                    + '<div class= "custom-file">'
                    + '<input id="psd-layer-'+ id + '-value" type="file" class="psd-layer-pixel-input-file custom-file-input">'
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
            $('.psd-layer-list-item input').click(function(event) {
                event.stopPropagation();
            });
            $('.psd-layer-pixel-input-file').change(function() {
                let $layerItem = $(this).parents('.psd-layer-list-item');
                let reader = new FileReader();
                reader.onload = function () {
                    loadingLayerImage($layerItem, false)
                    setLayerImageSrc($layerItem, reader.result);
                    $layerItem.addClass('image-loaded');
                }
                let fileURL = $(this).prop('files')[0];
                console.log(fileURL);
                if (fileURL) {
                    loadingLayerImage($layerItem, true, function() {
                        reader.readAsDataURL(fileURL, 'utf-8');
                    });
                } else {
                    alertBox('Não foi possível carregar a imagem escolhida!', ALERT_DANGER);
                }
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

function getClientInputLayers() {
    let inputs = {};
    $listPSDLayers.children('.active').each(function() {
        let id = parseInt($(this).data('layer-id'));
        let tagSelector = '#psd-layer-' + id + '-tag';
        let tag = $(this).find(tagSelector).val();
        let defaultValueSelector = '#psd-layer-' + id + '-value';
        let $defaultValue = $(this).find(defaultValueSelector);
        let defaultValueType = $defaultValue.attr('type');
        let defaultValue = null;
        if (defaultValueType == 'file') {
            defaultValue = $(this).find('.psd-layer-image-data').attr('src');
        } else {
            defaultValue = $defaultValue.val();
        }
        defaultValue = (defaultValue) ? defaultValue : null;
        inputs[id] = {
            tag: tag,
            defaultValue: defaultValue,
            defaultValueType: defaultValueType
        };
    });
    return inputs;
}

function validateToGeneratePDF() {
    //A PSD file must be chosen
    if (!$PSDImage.attr('src')) {
        alertBox('Um modelo PSD deve ser definido!', ALERT_DANGER);
        return false;
    }

    //Have at least one layer selected
    if ($listPSDLayers.children('.active').length == 0) {
        alertBox('Pelo menos um campo deve ser selecionado para gerar!', ALERT_DANGER);
        return false;
    }

    //All pixel fields must be loaded if chosen a image as default
    if ($listPSDLayers.children('.loading-image').length > 0) {
        alertBox('Ainda há imagens carregando. Aguarde o carregamento antes proceder.', ALERT_DANGER);
        return false;
    }

    let inputLayers = getClientInputLayers();
    let dataString = $templateContentValues.val();

    try {
        let data = excelTextToObject(dataString);
    } catch (InvalidQuantityColsError) {
        alertBox(
            'O campo de <strong>Import</strong> deve conter a mesma '
            + 'quantidade de campos escolhida!', ALERT_DANGER
        );
        return false;
    }

    if (data.length == 0) {
        alertBox('O campo de <strong>Import</strong> não foi preenchido!', ALERT_DANGER);
        return false;
    }

    let missingColumns = [];
    for (let layerID in inputLayers) {
        let tag = inputLayers[layerID].tag;
        let defaultvalue = inputLayers[layerID].defaultValue;
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            if (!(tag in row) && missingColumns.indexOf(tag) == -1
                && defaultvalue == null) {
                missingColumns.push(tag);
            }
        }
    }

    if (missingColumns.length > 0) {
        let columns = missingColumns.join(', ');
        alertBox(
            'Está faltando na seção Importar Participantes, a(s) coluna(s): <strong>'
            + columns + '</strong>!', ALERT_DANGER
        );
        return false;
    }

    return true;
}

function getInputLayersAndData() {
    let result = {};
    let clientInputLayers = getClientInputLayers();
    let inputLayers = {};
    for (let layerID in clientInputLayers) {
        inputLayers[layerID] = clientInputLayers[layerID].tag;
    }
    let dataString = $templateContentValues.val();
    let dataFromExcel = excelTextToObject(dataString);
    let data = [];

    for (let i = 0; i < dataFromExcel.length; i++) {
        let item = dataFromExcel[i];
        let dataItem = {};

        for (let layerID in clientInputLayers) {
            let tag = clientInputLayers[layerID].tag;
            let defaultValue = clientInputLayers[layerID].defaultValue;
            if (tag in item) {
                dataItem[tag] = item[tag];
            } else {
                dataItem[tag] = defaultValue;
            }
        }
        data.push(dataItem);
    }

    result['input_values'] = inputLayers;
    result['data'] = data;
    return result;
}