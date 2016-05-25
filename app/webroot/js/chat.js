$(document).ready(function () {

    var loading = true;
    var preIdUser = -1;

    $('body').append($('<div id="container" class="container">')
        .append($('<div id="messages" class="messages">'))
        .append($('<div id="action" class="action">'))
        .append($('<div id="contextMenu" class="context-menu">'))
    );

    $(window).on("load resize", function (e) {
        $('#messages').outerHeight($('#container').height() - $('#action').outerHeight());
        $('#container').css('margin-top', ($(window).height() - $('#container').height()) / 2);
    });

    $('#action').append($('<div class="row">')
        .append($('<div class="col col-2">')
            .append($('<div class="user">')
                .append($('<form method="post" id="change-avatar" enctype="multipart/form-data">')
                    .append($('<input type="file" name="image" accept="image/*" hidden>')))
                .append($('<a href="javascript:void(0)" onclick="$(\'#change-avatar input[type=file]\').click()">')
                    .append($('<img src="' + user['avatar'] + '">')))))
        .append($('<div class="col col-8-9">')
            .append($('<form method="post" id="send-message">')
                .append($('<textarea name="message" rows="1">'))))
        .append($('<div class="col col-1-2">')
            .append($('<form method="post" id="send-image" enctype="multipart/form-data">')
                .append($('<input type="file" name="image" accept="image/*" hidden>'))
                .append($('<button type="button" onclick="$(\'#send-image input[type=file]\').click()" class="btn btn-block btn-camera">')
                    .append($('<img src="/img/camera.png">'))))));

    $('#contextMenu').append($('<ul>')
        .append($('<li>')
            .append($('<a href="javascript:void(0)" id="deleteMessage">').html('Xóa'))));

    $('#send-message').submit(function (e) {
        e.preventDefault();
        if ($.trim($('textarea').val()) != '' && !loading) {
            var formData = $(this).serializeArray();
            $.ajax({
                type: 'post',
                url: '/send',
                dataType: 'json',
                data: formData,
                beforeSend: function () {
                    loading = true;
                },
                success: function (response) {
                    $('textarea').val('');
                    appendMessage(response);
                    loading = false;
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
            dataType: 'json',
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function () {
                loading = true;
            },
            success: function (response) {
                appendMessage(response);
                loading = false;
            }
        });
    });

    $('#send-image input[type=file]').change(function () {
        if ($(this).val() != '') {
            $('#send-image').trigger('submit');
        }
    });

    $('#change-avatar').submit(function (e) {
        e.preventDefault();
        var formData = new FormData($('#change-avatar')[0]);
        $.ajax({
            type: 'post',
            url: '/user/avatar',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (response) {
                window.location.href = '';
            }
        });
    });

    $('#change-avatar input[type=file]').change(function () {
        if ($(this).val() != '') {
            $('#change-avatar').trigger('submit');
        }
    });

    $('textarea')
        .on('focus', function () {
            $(this).height(80);
            $('#messages').outerHeight($('#container').height() - $('#action').outerHeight() - 33);
            $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 410);
        })
        .on('focusout', function () {
            $(this).height(35);
            $('#messages').outerHeight($('#container').height() - $('#action').outerHeight() + 33);
            $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 410);
        })
        .keypress(function (e) {
            if (e.which == 13 && !e.shiftKey) {
                e.preventDefault();
                $('#send-message').trigger('submit');
            }
        });


    appendMessage(messages);
    loading = false;

    setInterval(function () {
        if (!loading) {
            $.ajax({
                type: 'post',
                url: '/message',
                dataType: 'json',
                data: timeCurrent,
                beforeSend: function () {
                    loading = true;
                },
                success: function (response) {
                    if (response['timeCurrent'] != null) {
                        timeCurrent = response['timeCurrent'];
                    }
                    appendMessage(response['messages']);
                    loading = false;
                }
            });
        }
    }, 1000);

    function appendMessage(messages) {
        $.each(messages, function (i, message) {
            var preUser = message['sender']['_id']['$id'] == preIdUser;
            preIdUser = message['sender']['_id']['$id'];
            if (message['sender']['_id']['$id'] == user['_id']['$id']) {
                var ele = $('<div class="row send">');
            } else {
                var ele = $('<div class="row receive">');
            }
            var eleUser = $('<div class="col col-1-2">');
            if (!preUser) {
                eleUser.append($('<div class="user">').append($('<img src="' + message['sender']['avatar'] + '">')));
            }
            if (message['type'] == 'image') {
                var eleContent = $('<img src="' + message['message'] + '">');
            } else {
                var eleContent = $.trim(message['message']);
            }
            var eleMessage = $('<div class="col col-9">')
                .append($('<div class="message" data-id-message="' + message['_id']['$id'] + '">')
                    .append($('<div class="content">')
                        .html(eleContent))
                    .append($('<div class="time">')));

            ele.append(eleUser).append(eleMessage);
            $('#messages').append(ele);
            $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 5);
            ele.find('.content img').load(function () {
                $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 5);
            });
        });
    };

    //$('body').contextmenu(function (e) {
    //    e.preventDefault();
    //    if ($(e.target).hasClass('message') || $(e.target).parents().hasClass('message')) {
    //        if ($(e.target).hasClass('message')) {
    //            var idMessage = $(e.target).data('id-message');
    //        } else {
    //            var idMessage = $(e.target).parents('.message').data('id-message');
    //        }
    //        $('#contextMenu').css({
    //            top: e.pageY + 'px',
    //            left: e.pageX + 'px'
    //        }).data('id-message', idMessage).addClass('show');
    //    } else {
    //        $('#contextMenu').hide();
    //    }
    //});
    //
    //$('body').click(function () {
    //    $('#contextMenu').hide();
    //});
    //
    //$('#deleteMessage').click(function (e) {
    //    var idMessage = $('#contextMenu').data('id-message');
    //    $.ajax({
    //        type: 'post',
    //        url: '/delete',
    //        dataType: 'json',
    //        data: idMessage,
    //        success: function (response) {
    //
    //        }
    //    });
    //});

});