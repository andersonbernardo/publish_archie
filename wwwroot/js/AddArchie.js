var AddArchie = (function (modulo) {
    "use strict";

    var lastSearch = null;

    var Eventos = {
        Iniciar: function (contexto) {
            this.SearchArchie(contexto);
            this.ChangePage(contexto);
            this.SendArchie(contexto);
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

                getArchies($("body.ambiente-atribuicao"));
            });
        },
        SearchArchie: function (contexto) {
            contexto.on('click', '#send-form', function (e) {
                e.preventDefault();                

                
                var $form = getFormData($('form', contexto));

                if ($form.buscararchie !== undefined && $form.buscararchie !== '' && $form.buscararchie.length < 3) {
                    alert("Digite ao menos 3 letras");
                    return;
                };                

                var data = {
                    Term: $form.buscararchie,
                    CurrentPage: 1,
                    TotalPerPage: 20,
                    briefingId: $("#briefingId", contexto).val(),
                    paginationFunctionJs: "AddArchie.Pagination"
                };

                lastSearch = data;

                getArchies(contexto);
            });
        },
        SendArchie: function (contexto) {
            contexto.on("click", "#send-archie", function (e) {
                e.preventDefault();

                var archieId = $("input[name='archie']:checked", contexto).attr("id");
                var briefingId = $("#briefingId", contexto).val();

                $.ajax({
                    url: "/admin/AddArchie",
                    type: "POST",
                    data: { archieId: archieId, briefingId: briefingId},
                    success: function (data) {
                        if (!data.status) {
                            alert(data.message);
                        } 
                    }
                });
            });
        }

    };

    modulo.Pagination = function (page) {
        lastSearch.CurrentPage = page;
        getArchies($("body.ambiente-atribuicao"));
    }

    modulo.Iniciar = function (contexto) {
        Eventos.Iniciar(contexto);

        var data = {
            Term: "",
            CurrentPage: 1,
            TotalPerPage: 20,
            briefingId: $("#briefingId", contexto).val(),
            paginationFunctionJs: "AddArchie.Pagination",
            filterEnum: 2
        };

        lastSearch = data;

        getArchies(contexto);
    };

    function getArchies(contexto) {
        $.ajax({
            url: "/admin/GetAddArchies",
            type: "GET",
            data: lastSearch,
            success: function (data) {
                console.log(contexto);
                console.log(data);
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
}(AddArchie || {}));
