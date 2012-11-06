window.onload = function() {
    var request = new XMLHttpRequest(),
        url = "examples.json",
        section = document.getElementsByTagName('section')[0],
        categories = [],
        iPad = navigator.userAgent.match(/iPad/i) != null,
        retina = window.devicePixelRatio >= 2 ? true : false,
        icon = (retina) ? (iPad) ? 'icon@144.png' : 'icon@2x.png' : (iPad) ? 'icon@72.png' : 'icon.png',
        category, item, ul, element, ln, i, j;

    request.open('GET', url, false);
    request.send(null);

    if (request.status === 200) {
        // preprocess tags out of the response to allow the json to parse correctly
        var text = request.responseText
                .replace("//<feature charts>",'')
                .replace("//</feature>",'');
        
        categories = JSON.parse(text);

        ln = categories.length;
        for (i = 0; i < ln; i++) {
            category = categories[i];

            element = document.createElement('header');
            element.innerHTML = category.title;
            section.appendChild(element);

            ul = document.createElement('ul');

            for (j = 0; j < category.items.length; j++) {
                item = category.items[j];

                element = document.createElement('li');
                element.innerHTML = [
                    '<a href="' + item.url + '">',
                        '<img src="' + item.iconLocation + '/' + icon + '" />',
                        '<h3>' + item.text + '</h3>',
                        '<p>' + item.desc + '</p>',
                    '</a>'
                ].join('');
                ul.appendChild(element);
            }

            section.appendChild(ul);
        }

        document.getElementById('wrapper').style.opacity = 1;
    }
};
