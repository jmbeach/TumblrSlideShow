function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var err = getParameterByName('err');
function handleError(err) {
    switch(err) {
        case 'null-pass':
            $("#instructionTitle").text("Password blank. Try again.");
            break;
        //TODO: handle bad passwords.
    }
}