var GestorRoomKey = (function (modulo) {
    "use strict";

    var lastSearch = null;

    var _contexto = $("body.cupons-de-desconto");

    var Eventos = {
        Iniciar: function (contexto) {
            this.SearchKey(contexto);
            this.ChangePage(contexto);
            this.PressEnter(contexto);
            //this.Create(contexto);
        },
        PressEnter: function (contexto) {
            contexto.on("keypress", function (e) {
                if (e.which === 13) {
                    getRoomKeysCampaign(contexto);
                }
            });
        },
        ChangePage: function (contexto) {
            var paginaAtual = $("#change-page").val();
            contexto.on('focusout', "#change-page", function () {
                var pagina = $(this);

                if (paginaAtual == pagina.val())
                    return;
                var total = $(this).data("totalpages");

                if (pagina.val() < 1 || pagina.val() > total) {
                    alert("Página inválida!");
                    pagina.val(lastSearch.CurrentPage);
                    return;
                }

                lastSearch.CurrentPage = pagina.val();
                getRoomKeys(_contexto, lastSearch.campaignId, lastSearch.CurrentPage);
            });
        },
        SearchKey: function (contexto) {
            contexto.on('click', '#send-form-key', function (e) {
                e.preventDefault();
                getRoomKeysCampaign(contexto);
            });
        }

    };

    modulo.PaginationRoomKey = function (page) {
        getRoomKeys(_contexto, lastSearch.campaignId, page);
    }

    modulo.PaginationRoomKeyCampaign = function (page) {
        lastSearch.CurrentPage = page;
        getRoomKeysCampaign(_contexto);
    }

    modulo.Iniciar = function (contexto) {
        Eventos.Iniciar(contexto);
    };

    modulo.loadRoomKeysCampaign = function (contexto) {
        getRoomKeysCampaign(contexto);
    };

    modulo.loadRoomKeys = function (contexto, campaignid, page) {
        getRoomKeys(contexto, campaignid, page);
    };

    function getRoomKeys(contexto, campaignid, page) {

        var data = {
            campaignId: campaignid,
            CurrentPage: page,
            TotalPerPage: 20,
            paginationFunctionJs: "GestorRoomKey.PaginationRoomKeyCampaign"
        };

        lastSearch = data;

        $.ajax({
            url: "/admin/GetRoomKeys",
            type: "GET",
            data: data,
            success: function (data) {
                $("article.search-result", contexto).html(data);
            }
        });
    }

    function getRoomKeysCampaign(contexto) {

        var $form = getFormData($('form', contexto));

        if ($form.term != '' && $form.term.length < 3) {
            alert("Digite ao menos 3 letras");
            return;
        }

        var data = {
            Term: $form.term,
            CurrentPage: lastSearch != null ? lastSearch.CurrentPage : 1,
            TotalPerPage: 20,
            paginationFunctionJs: "GestorRoomKey.PaginationRoomKeyCampaign"
        };

        lastSearch = data;

        $.ajax({
            url: "/admin/GetRoomKeyCampaigns",
            type: "GET",
            data: data,
            success: function (data) {
                $("article.search-result", contexto).html(data);
            }
        });
    }    

    function getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    return modulo;
}(GestorRoomKey || {}));
