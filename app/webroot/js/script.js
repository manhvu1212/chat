$(document).ready(function () {
    $('body').append($('<div id="container" class="container">')
        .append($('<div id="message" class="message">'))
        .append($('<div id="action" class="action">'))
    );

    $('#action').append($('<div class="row">')
        .append($('<div class="col col-2">')
            .append($('<div class="user">')
                .append($('<img src="/img/nobody.jpg">'))))
        .append($('<div class="col col-10">')
            .append($('<form method="post" id="send-message" class="row">')
                .append($('<div class="col col-10">')
                    .append($('<textarea name="message" rows="1">')))
                .append($('<div class="col col-2">')
                    .append($('<button type="submit" class="btn btn-block">')
                        .html('Gửi')))
            )));

    $('#message').html('');

    $('#send-message').submit(function (e) {
        e.preventDefault();
        console.log($(this).serializeArray());
    });

    $('textarea')
        .on('focus', function () {
            $(this).height(80);
            $('#message').height($('#container').height() - $('#action').outerHeight() - 33);
        })
        .on('focusout', function () {
            $(this).height(35);
            $('#message').height($('#container').height() - $('#action').outerHeight() + 33);
        })
        .keypress(function (e) {
            if (e.which == 13 && !e.shiftKey) {
                e.preventDefault();
                $('#send-message').trigger('submit');
            }
        });
});