$(document).ready(function () {
    $('body').append($('<div class="container">')
        .append($('<div id="message" class="message">'))
        .append($('<div id="action" class="action">'))
    );

    $('#action').append($('<div class="row">')
        .append($('<div class="col col-2 user">')
            .append($('<img src="/img/nobody.jpg">')))
        .append($('<div class="col col-10 form">')
            .append($('<form method="post" class="row">')
                .append($('<div class="col col-10">')
                    .append($('<textarea name="message" rows="1">')))
                .append($('<div class="col col-2">')
                    .append($('<button type="submit" class="btn btn-block">')
                        .html('Gửi')))
            )));
});