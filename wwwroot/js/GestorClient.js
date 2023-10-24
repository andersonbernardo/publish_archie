var GestorClient = (function (modulo) {
    "use strict";

    var lastSearch = null;

    var Eventos = {
        Iniciar: function (contexto) {
            this.SearchClients(contexto);
            this.ChangePage(contexto);
            this.Export(contexto);
            this.PressEnter(contexto);
        },
        PressEnter: function (contexto) {
            contexto.on("keypress", function (e) {
                if (e.which == 13) {
                    getClients(contexto);
                }
            });
        },
        Export: function (contexto) {
            contexto.on("click", ".export", function () {
                //if (lastSearch == '' || lastSearch == undefined || lastSearch == null) {
                //    alert("É necessário fazer uma pesquisa!");
                //    return
                //}                    
                //window.open("/admin/DownloadReport?termo=" + lastSearch.Term, "_self");
                window.open("/admin/DownloadClientReport","_self");
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
                getClients($("body.clientes"));


            });
        },
        SearchClients: function (contexto) {
            
            contexto.on('click', '#send-form', function (e) {
                e.preventDefault();               

               
                getClients(contexto);
            });
        }
    };

    modulo.Pagination = function(page) {        
        lastSearch.CurrentPage = page;
        getClients($("body.clientes"));
    }

    modulo.Iniciar = function (contexto) {
        Eventos.Iniciar(contexto);        
    };

    function getClients(contexto) {

        var $form = getFormData($('form', contexto));

        if ($form.term != '' && $form.term.length < 3) {
            alert("Digite ao menos 3 letras");
            return;
        }        

        var data = {
            ClientType: $form.ClientType,
            Term: $form.term,
            Begin: $form.begin,
            End: $form.end,
            CurrentPage: lastSearch != null ? lastSearch.CurrentPage : 1,
            TotalPerPage: 20,
            paginationFunctionJs: "GestorClient.Pagination"
        };

        lastSearch = data;

        $.ajax({
            url: "/admin/GetClients",
            type: "GET",
            data: data,
            success: function (data) {                               
                $("article.search-result", $(".clientes")).html(data);
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
}(GestorClient || {}));
