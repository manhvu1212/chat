$(document).ready(function () {
    $('body').append($('<div id="container" class="container">')
        .append($('<div id="messages" class="messages">'))
        .append($('<div id="action" class="action">'))
    );

    $(window).on("load resize",function(e){
        $('#messages').outerHeight($('#container').height() - $('#action').outerHeight());
        $('#container').css('margin-top', ($(window).height() - $('#container').height()) / 2);
    });

    $('#action').append($('<div class="row">')
        .append($('<div class="col col-2">')
            .append($('<div class="user">')
                .append($('<img src="/img/nobody.jpg">'))))
        .append($('<div class="col col-8-9">')
            .append($('<form method="post" id="send-message">')
                .append($('<textarea name="message" rows="1">'))))
        .append($('<div class="col col-1-2">')
            .append($('<form method="post" id="send-image" enctype="multipart/form-data">')
                .append($('<input type="file" name="image" accept="image/*" hidden>'))
                .append($('<button type="button" onclick="$(\'input[type=file]\').click()" class="btn btn-block">')
                    .append($('<img src="/img/camera.png">'))))));

    $('#action img').load(function() {
        $('#messages').outerHeight($('#container').height() - $('#action').outerHeight());
    });

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
                    ele.find('img').load(function () {
                        $('#messages').append(ele);
                        $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 600);
                    });
                }
            });
        }
    });

    $('#send-image').submit(function (e) {
        e.preventDefault();
        var formData = new FormData($('#send-image')[0]);
        $.ajax({
            type: 'post',
            url: '/send/image',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response != '') {
                    var ele = $('<div class="row row-right send">')
                        .append($('<div class="col col-1-2">')
                            .append($('<div class="user">')
                                .append($('<img src="/img/nobody.jpg">'))))
                        .append($('<div class="col col-9">')
                            .append($('<div class="message">')
                                .append($('<div class="content">')
                                    .append($('<img src="' + response + '">')))
                                .append($('<div class="time">'))));
                    ele.find('.user img').load(function () {
                        $('#messages').append(ele);
                        $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 600);
                    });
                    ele.find('.content img').load(function() {
                        $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 600);
                    });
                }
            }
        });
    });

    $('input[type=file]').change(function () {
        if ($(this).val() != '') {
            $('#send-image').trigger('submit');
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