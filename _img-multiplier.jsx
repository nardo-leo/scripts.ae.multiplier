// Get the active composition
var activeComp = app.project.activeItem;

// Get pics folder #1 - FIX add possibility to choose
var picsFolder = app.project.item(1);

// Check if we really have a composition
if (activeComp != null && (activeComp instanceof CompItem)) {

    // Change output location
    var outputFolder = Folder.selectDialog('Choose Save Location', '');

    // Get all the selected layers to change
    var selectedLayers = activeComp.selectedLayers;

    // Manipulate with source images by cycle through pics directory in Ae
    for (var i = 1; i <= picsFolder.numItems; i++) {
        for (var j = 0; j < selectedLayers.length; j++) {

            var sourceImg = picsFolder.item(i);
            selectedLayers[j].replaceSource(sourceImg, true);

            var saveFolder = new Folder(outputFolder);
                if (! saveFolder.exist) {
                    saveFolder.create();
                }

            // Add composition to render queue
            var item = app.project.renderQueue.items.add(activeComp);
            var outputModule = item.outputModule(1);
            outputModule.applyTemplate('Lossless'); // Get possibility to choose it
            outputModule.file = File(String(saveFolder) + '/' + activeComp.name + '#' + (i));

            // Render
            app.project.renderQueue.render();

            // Sending to AME instead
            // app.project.renderQueue.queueInAME(true);
        }
    }
}
