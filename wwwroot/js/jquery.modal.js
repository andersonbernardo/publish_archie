(function ($) {
    'use strict';

    var highestZ = function () {
        var indexHighest = 1000;
        $('.mais-modal-container:visible').each(function () {
            var indexCurrent = parseInt($(this).css("z-index"), 10);
            if (indexCurrent > indexHighest) {
                indexHighest = indexCurrent;
            }
        });
        return indexHighest;
    },
        modals = [],
        anyOpen = function () {
            for (var i = 0, length = modals.length; i < length; ++i) {
                if (modals[i].is(':visible')) {
                    return true;
                }
            }
            return false;
        },
        focusedModal = function () {
            var modal = null;
            for (var i = 0, length = modals.length; i < length; ++i) {
                var candidate = modals[i];

                modal = candidate.is(':visible') &&
                    (modal === null ||
                        parseInt(candidate.css('z-index'), 10) > parseInt(modal.css('z-index'), 10)) ?
                    candidate : modal;
            }
            return modal;
        },
        init = function (o) {
            return this.each(function () {

                if ($.data($(this)[0]).modal) { return; }

                var options = $.extend(true, {
                    'closeOnEscape': true,
                    'closeOnClick': true,
                    'onClose': false,
                    'overlayCSS': {
                        'position': 'fixed',
                        'background-color': '#111',
                        'opacity': 0.5,
                        'top': 0,
                        'left': 0,
                        'height': '100%',
                        'width': '100%',
                        'display': 'none'
                    },
                    'closeButtonSelector': '.close'
                }, o),
                    modal = $(this).css({
                        'position': 'absolute',
                        'left': '50%'
                    }),
                    overlay = $('<div/>').attr('class', 'mais-modal-overlay')
                        .appendTo('body')
                        .css(options.overlayCSS),
                    container = $('<div/>').attr('class', 'mais-modal-container')
                        .css({
                            'position': 'fixed',
                            'top': '0',
                            'bottom': '0',
                            'right': '0',
                            'left': '0',
                            'display': 'none',
                            'z-index': '0'
                        }),
                    body = $('body');

                modal.parent().append(container.append(modal));

                modals.push(modal.data('modal', {
                    'functions': {
                        'open': function () {
                            var zIndex = highestZ(),
                                windowHeight = $(window).outerHeight(),
                                modalHeight = (container.show(), modal.show(), modal.outerHeight()),
                                modalWidth = modal.outerWidth();
                            container.hide();
                            modal.hide();

                            overlay.css({
                                'z-index': zIndex + 1
                            }).show();

                            container.css({
                                'z-index': zIndex + 2,
                                'overflow': 'auto'
                            }).show();

                            modal.css({
                                'margin-left': (-(modalWidth / 2)).toString() + 'px',
                                'top': windowHeight > modalHeight ? '50%' : 0,
                                'margin-top': windowHeight > modalHeight ? (-(modalHeight / 2)).toString() + 'px' : 0,
                                'z-index': zIndex + 3
                            }).show();

                            body.addClass('mais-modal-open');
                        },
                        'close': function () {
                            overlay.css({ 'z-index': '0' }).hide();
                            container.css({ 'z-index': '0' }).hide();
                            modal.css({ 'z-index': '0' }).hide();

                            if (options.onClose && typeof options.onClose === 'function') {
                                options.onClose(modal);
                            }

                            if (!anyOpen()) {
                                body.removeClass('mais-modal-open');
                            }
                        }
                    },
                    'closeOnEscape': options.closeOnEscape
                }).on('click', options.closeButtonSelector, function (e) {
                    e.preventDefault();
                    modal.data('modal').functions.close.apply(this);
                }));

                if (options.closeOnClick) {
                    container.on('click', function (e) {
                        if ($(e.target).hasClass('mais-modal-container')) {
                            modal.data('modal').functions.close.apply(this);
                        }
                    });
                }
            });
        };

    $(document).on('keydown', function (e) {
        var modal = focusedModal();
        if (e.keyCode === 27 && modal !== null && modal.data('modal').closeOnEscape) {
            modal.data('modal').functions.close.apply(this);
        }
    });

    $.fn.modal = function () {
        if (arguments.length === 0 || typeof arguments[0] === 'object') {
            return init.apply(this, arguments);
        } else if (typeof arguments[0] === 'string') {
            var requestedFunction = $(this).data('modal').functions[arguments[0]];

            if (requestedFunction && typeof requestedFunction === 'function') {
                return requestedFunction.apply(this, arguments);
            } else {
                throw '$.modal: Function "' + arguments[0] + '" does not exist.';
            }
        } else {
            throw '$.modal: Invalid arguments.';
        }
    };
}(jQuery));