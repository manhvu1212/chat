$(document).ready(function() {
    $('body').append($('<div id="container" class="container">')
        .append($('<div class="login">')
            .append($('<form method="post" action="/login" id="login">')
                .append($('<div class="row form-control">')
                    .append($('<div class="col col-4">')
                        .append($('<label>').html('Tên đăng nhập')))
                    .append($('<div class="col col-8">')
                        .append($('<input type="text" name="username" placeholder="Tên đăng nhập" required>'))))
                .append($('<div class="row form-control">')
                    .append($('<div class="col col-4">')
                        .append($('<label>').html('Mật khẩu')))
                    .append($('<div class="col col-8">')
                        .append($('<input type="password" name="password" placeholder="Mật khẩu" required>'))))
                .append($('<button type="submit" class="btn">').html('Đăng nhập')))));

    $(window).on("load resize",function(e){
        $('#container').css('margin-top', ($(window).height() - $('#container').height()) / 2);
    });
});