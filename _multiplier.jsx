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
    // TODO change places
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

        // avoid line #0 because it's header
        for (var l = 1; l < lines.length; l++) {
            for (var c = 0; c < columns.length; c++) {
                for (var s = 0; s < selectedLayers.length; s++) {

                    selectedLayers[s].sourceText.setValue(columns[c][l]);

                    var saveFolder = new Folder(outputFolder);
                        if (! saveFolder.exist) {
                            saveFolder.create();
                        }

                    // Push composition to render queue
                    pushToRender(activeComp, saveFolder, c, l);
                }
            }
        }
    }
}


main();
