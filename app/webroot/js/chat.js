/*

 */
$(document).ready(function () {
    APP.init();
    APP.appendMessage(messages);
    APP.sendText();
    APP.sendImage();
    APP.changeAvatar();
    APP.scroll();
    setInterval(function () {
        APP.getMoreAuto();
    }, 1000);
});

/*

 */
$(window).on("load resize", function (e) {
    $('#messages').outerHeight($('#container').height() - $('#action').outerHeight());
    $('#container').css('margin-top', ($(window).height() - $('#container').height()) / 2);
});

/*

 */
var APP = {
    preIdUser: -1,
    loading: true,
    scrolling: false,

    /*

     */
    appendMessage: function (messages) {
        $.each(messages, function (i, message) {
            var preUser = message['sender']['_id']['$id'] == APP.preIdUser;
            APP.preIdUser = message['sender']['_id']['$id'];
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
            if (!APP.scrolling) {
                APP.scrollEnd(5)
                ele.find('.content img').load(function () {
                    APP.scrollEnd(5)
                });
            }
        });
        APP.loading = false;
    },

    /*

     */
    init: function () {
        /*

         */
        $('body').append($('<div id="container" class="container">')
            .append($('<div id="messages" class="messages">'))
            .append($('<div id="action" class="action">')));

        /*

         */
        $('#action').append($('<button id="newMessage" onclick="APP.scrollEnd(410)" class="btn new-message">').html('Có tin nhắn'))
            .append($('<div class="row">')
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

        /*

         */
        $('textarea')
            .on('focus', function () {
                $(this).height(80);
                $('#messages').outerHeight($('#container').height() - $('#action').outerHeight() - 33);
                if (!APP.scrolling) {
                    $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 410);
                }
            })
            .on('focusout', function () {
                $(this).height(35);
                $('#messages').outerHeight($('#container').height() - $('#action').outerHeight() + 33);
                if (!APP.scrolling) {
                    $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, 410);
                }
            })
            .keypress(function (e) {
                if (e.which == 13 && !e.shiftKey) {
                    e.preventDefault();
                    $('#send-message').trigger('submit');
                }
            });
    },

    /*

     */
    sendText: function () {
        $('#send-message').submit(function (e) {
            e.preventDefault();
            if ($.trim($('textarea').val()) != '' && !APP.loading) {
                var formData = $(this).serializeArray();
                $.ajax({
                    type: 'post',
                    url: '/send',
                    dataType: 'json',
                    data: formData,
                    beforeSend: function () {
                        APP.loading = true;
                    },
                    success: function (response) {
                        $('textarea').val('');
                        APP.scrolling = false;
                        APP.appendMessage(response);
                    }
                });
            }
        });
    },

    /*

     */
    sendImage: function () {
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
                    APP.loading = true;
                },
                success: function (response) {
                    APP.scrolling = false;
                    APP.appendMessage(response);
                }
            });
        });

        $('#send-image input[type=file]').change(function () {
            if ($(this).val() != '') {
                $('#send-image').trigger('submit');
            }
        });
    },

    /*

     */
    changeAvatar: function () {
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
    },

    /*

     */
    getMoreAuto: function () {
        if (!APP.loading) {
            $.ajax({
                type: 'post',
                url: '/message',
                dataType: 'json',
                data: timeEnd,
                beforeSend: function () {
                    APP.loading = true;
                },
                success: function (response) {
                    if (response['timeEnd'] != null) {
                        timeEnd = response['timeEnd'];
                    }
                    if (response['messages'].length > 0 && APP.scrolling) {
                        $('#newMessage').show();
                    }
                    APP.appendMessage(response['messages']);
                }
            });
        }
    },

    /*

     */
    scroll: function () {
        $('#messages').scroll(function () {
            if ($('#messages').scrollTop() + $('#messages').outerHeight() < $('#messages')[0].scrollHeight - 100) {
                APP.scrolling = true;
            } else {
                APP.scrolling = false;
            }
        });
    },

    scrollEnd: function (duration) {
        $('#messages').animate({scrollTop: $('#messages')[0].scrollHeight}, duration);
        $('#newMessage').hide();
    }
};

