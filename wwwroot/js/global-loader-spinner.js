(function () {
    "use strict";
    var $document = $(document),
        $body = $("body"),
        $container = $('<div/>', { 'class': 'modal-carregando-container' }).css({ 'display': 'none' }),
        requisicoes = (function () {
            var quantidade = 0;
            return {
                incrementar: function () {
                    quantidade = quantidade + 1;
                    return quantidade;
                },
                decrementar: function () {
                    quantidade = quantidade - 1;
                    return quantidade;
                }
            };
        }());

    $body.append($container);

    new Spinner().spin($container.get(0));
    $('.spinner', $container).css({
        position: 'fixed',
        left: '50%',
        top: '50%'
    });

    $container.modal({
        closeOnEscape: false,
        closeOnClick: false
    });

    

    $document.ajaxStart(function () {
        if (requisicoes.incrementar() > 0) { $container.modal("open"); }
    });

    $document.ajaxStop(function () {
        if (requisicoes.decrementar() === 0) { $container.modal("close"); }
    });
}());


"use strict";
var $document = $(document),
    $body = $("body"),
    $container = $('<div/>', { 'class': 'modal-carregando-container' }).css({ 'display': 'none' });  

$body.append($container);

new Spinner().spin($container.get(0));

$('.spinner', $container).css({
    position: 'fixed',
    left: '50%',
    top: '50%'
});

$container.modal({
    closeOnEscape: false,
    closeOnClick: false
});

function blockUI() {
    return $container.modal("open");
}

function unBlockUI() {
    return $container.modal("close");
}
