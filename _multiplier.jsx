function readDatasetColumns(textFile) {

    var textLines = [];

    if (textFile != null) {
        textFile.open('r');
        while(!textFile.eof) {
            textLines[textLines.length] = textFile.readln(); // lines
        }
        // separate lines to columns
        var columns = [];
        for (var i = 0; i < textLines.length; i++) {
            var cells = textLines[i].split(','); // cells
            for (var j = 0; j < cells.length; j++){
                if (i == 0) {
                    columns.push([cells[j]]); // fill column's header
                } else {
                    columns[j].push(cells[j]); // fill columns
               }
            }
        }
        textFile.close();
    }

    if (!textLines) {
        alert('ERROR Reading file');
        return null;
    }

    return columns;

}

function readDatasetLines(textFile) {

    var textLines = [];

    if (textFile != null) {
        textFile.open('r');
        while(!textFile.eof) {
            textLines[textLines.length] = textFile.readln(); // lines
        }

    }

    return textLines;
}


function pushToRender(activeComp, saveFolder, c, l) {

    var item = app.project.renderQueue.items.add(activeComp);
    var outputModule = item.outputModule(1);
    outputModule.applyTemplate('Lossless'); // TODO Get possibility to choose it
    outputModule.file = File(String(saveFolder) + '/' + activeComp.name + '#' + l + '-' + (c + 1));

    // Render
    app.project.renderQueue.render();

    // Sending to AME instead
    // app.project.renderQueue.queueInAME(true);

}


function main() {
    // Get the active composition
    var activeComp = app.project.activeItem;

    // Choose dataset file
    var textFile = File.openDialog('Choose Dataset');

    // Check if we really have a composition
    if (activeComp != null && (activeComp instanceof CompItem)) {

        // Change output location
        var outputFolder = Folder.selectDialog('Choose Save Location', '');

        // Get all the selected layers
        var selectedLayers = activeComp.selectedLayers; // TODO mark layers to distinguish layers

        // Manipulate with source text by cycle through columns array
        var columns = readDatasetColumns(textFile);
        var lines = readDatasetLines(textFile);

        // Get img folder
        var imgFolder = '';
        for (var i = 1; i < app.project.numItems; i++) {
            if (app.project.item(i).name == 'img' && app.project.item(i) instanceof FolderItem) {
                imgFolder = app.project.item(i);
            }
        }
        // Check if don't find img folder
        if (imgFolder == '') {
            alert("Can't find folder 'img'");
            return;
        }

        // Change content
        // Avoid line #0 because it's header
        for (var l = 1; l < lines.length; l++) {
            for (var c = 0; c < columns.length; c++) {
                for (var s = 0; s < selectedLayers.length; s++) {

                    var layerName = selectedLayers[s].name;
                    var layerStartsWith = layerName.charAt(0);

                    if (layerStartsWith == '^') { // change text
                        selectedLayers[s].sourceText.setValue(columns[c][l]);
                    }
                    else if (layerStartsWith == '#') { // change image
                        for (var i = 1; i <= imgFolder.numItems; i++) {
                            if (imgFolder.item(i).name == columns[c][l]) { //FIXME can't bypass inside
                                selectedLayers[s].replaceSource(imgFolder.item(i), true);
                            }
                        }
                    } else {
                        alert('You need to mark layer type (^ - text, # - image)');
                        return;
                    }

                    var saveFolder = new Folder(outputFolder);
                        if (! saveFolder.exist) {
                            saveFolder.create();
                        }

                    // Push composition to render queue
                    // pushToRender(activeComp, saveFolder, c, l);
                }
            }
        }
    }
}


main();
