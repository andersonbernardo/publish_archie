var cupom = (function (modulo) {
    "use strict";

    var lastSearch = null;

    var Eventos = {
        Iniciar: function (contexto) {
            this.SearchCupom(contexto);
            this.ChangePage(contexto);
            this.ExportAll(contexto);
            this.PressEnter(contexto);
        },
        PressEnter: function (contexto) {
            contexto.on("keypress", function (e) {
                if (e.which === 13) {
                    GetCupom(contexto);
                }
            });
        },
        ExportAll: function (contexto) {
            contexto.on("click", "#send-export", function () {

                window.open("/parceiro/admin/ExportCupoms?term=" + lastSearch.Term + "&status=" + lastSearch.Status + "&begin=" + lastSearch.Begin + "&end=" + lastSearch.End, "_self");
            });
        },
        ChangePage: function (contexto) {
            var paginaAtual = $("#change-page").val();
            contexto.on('focusout', "#change-page", function () {
                var pagina = $(this);

                if (paginaAtual === pagina.val())
                    return;
                var total = $(this).data("totalpages");

                if (pagina.val() < 1 || pagina.val() > total) {
                    alert("Página inválida!");
                    pagina.val(lastSearch.CurrentPage);
                    return;
                }

                lastSearch.CurrentPage = pagina.val();
                GetCupom($("body.ambientes"));
            });
        },
        SearchCupom: function (contexto) {
            contexto.on('click', '#send-form', function (e) {
                e.preventDefault();

                GetCupom(contexto);
            });
        }

    };

    modulo.Pagination = function (page) {
        lastSearch.CurrentPage = page;
        GetCupom($("body.ambientes"));
    }

    modulo.Iniciar = function (contexto) {
        Eventos.Iniciar(contexto);
    };

    function GetCupom(contexto) {

        var $form = getFormData($('form', contexto));

        console.log($form.term);

        var data = {
            Term: $form.term,
            Status: $form.status,
            Begin: $form.start,
            End: $form.end,
            CurrentPage: lastSearch !== null ? lastSearch.CurrentPage : 1,
            TotalPerPage: 20,
            paginationFunctionJs: "cupom.Pagination"
        };

        lastSearch = data;

        $.ajax({
            url: "/parceiro/admin/GetCupom",
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
}(cupom || {}));
