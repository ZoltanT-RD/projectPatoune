exports.getHTML = function (descriptor) {

    const baseHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <title>${descriptor.title}</title>
        </head>
        <body>
            <div class="container">
                <h1 class="center-align">Hi, this is the <br/><code>[${descriptor.title}]</code></h1>
                <h5>your options are as follows:</h5>
                    <table class="striped">
                        <thead>
                            <tr>
                                <th>HTTP method</th>
                                <th>relative path</th>
                                <th>responses</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generateOptions(descriptor.basePath, descriptor.options)}
                        </tbody>
                </table>
            </div>
        </body>
        </html>
        `;

    return baseHTML;
}



function generateOptions(basePath,options) {

    let optionsArray = [];

    if (Array.isArray(options) && options.length > 0){
        options.forEach(option => {

            let responses = [];
            responses.push('<ul class="collection">');
            if (Array.isArray(option.responses) && option.responses.length > 0) {

                option.responses.forEach(response => {
                    responses.push(`<li class="collection-item"><code>[${response.statusCode}]</code> -> ${response.description}</li>`);
                });
            }
            if (option.notes) {
                responses.push(`<li class="collection-item"><mark>note: ${option.notes}</mark></li>`);
            }
            responses.push("</ul>");


            optionsArray.push(`<tr><td>${option.type}</td> <td><code>${option.route}</code>  ---> <a href="${basePath}${option.route}">link</a></td> <td>${responses.join(" ")} </td></tr>`);
        });
    }


    return optionsArray.join(" ");
}
