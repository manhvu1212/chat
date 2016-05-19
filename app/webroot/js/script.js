$(document).ready(function () {
    $('body').append($('<div id="container" class="container">')
        .append($('<div id="messages" class="messages">'))
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
                        .append($('<img src="/img/send.png">'))))
            )));

    $('#messages').html('');

    $('#send-message').submit(function (e) {
        e.preventDefault();
        if ($.trim($('textarea').val()) != '') {
            var formData = $(this).serializeArray();
            $.ajax({
                type: 'post',
                url: '/send',
                dataType: 'json',
                data: formData,
                success: function (response) {
                    $('textarea').val('');
                    var ele = $('<div class="row row-right send">')
                        .append($('<div class="col col-1-2">')
                            .append($('<div class="user">')
                                .append($('<img src="/img/nobody.jpg">'))))
                        .append($('<div class="col col-9">')
                            .append($('<div class="message">')
                                .append($('<div class="content">')
                                    .html($.trim(response['message'])))
                                .append($('<div class="time">'))));
                    ele.find('img').load(function() {
                        $('#messages').append(ele);
                        $('#messages').animate({ scrollTop: ele.height() + $('#messages').scrollTop() }, 600);
                    });
                }
            });
        }
    });

    $('textarea')
        .on('focus', function () {
            $(this).height(80);
            $('#messages').outerHeight($('#container').height() - $('#action').outerHeight() - 33);
        })
        .on('focusout', function () {
            $(this).height(35);
            $('#messages').outerHeight($('#container').height() - $('#action').outerHeight() + 33);
        })
        .keypress(function (e) {
            if (e.which == 13 && !e.shiftKey) {
                e.preventDefault();
                $('#send-message').trigger('submit');
            }
        });
});