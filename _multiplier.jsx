// Change text

// Get the active composition
var activeComp = app.project.activeItem;
// Check if we really have a composition
if (activeComp != null && (activeComp instanceof CompItem)){
// Get all the selected layers
var selectedLayers = activeComp.selectedLayers;
    // Cycle over all the selected layers
    for (var i = 0; i < selectedLayers.length; i++) {
    // Manipulate with source text property of each layer
    selectedLayers[i].sourceText.setValue('xxx')
    }
}

// Push to render

