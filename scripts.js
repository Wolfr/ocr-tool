function processImage() {

    var subscriptionKey = "b3ab64fafb4b4990a3b3f8eb32b462a1";

    var uriBase =
        "https://westeurope.api.cognitive.microsoft.com/vision/v2.0/ocr";

    // Request parameters.
    var params = {
        "language": "unk",
        "detectOrientation": "true",
    };

    // Display the image.
    var sourceImageUrl = document.getElementById("imageURL").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader("Content-Type","application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
      
        // Show formatted JSON on webpage.
        $("#responseTextArea").val(JSON.stringify(data, null, 2));

         var wordArr = [];

         data.regions.forEach(regionObj => {

             regionObj.lines.forEach(lineObj => {

                 lineObj.words.forEach(wordObj => {
                     //console.log(wordObj.text)
                     wordArr.push(wordObj.text)
                 })
                 wordArr.push('\n\n');
             })
         })
         var text = wordArr.join(' ');
         $("#formattedOutput").val(text);

    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ?
            "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" :
            (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message :
                jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
};