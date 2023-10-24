var GestorArchie = (function (modulo) {
    "use strict";

    var lastSearch = null;

    var Eventos = {
        Iniciar: function (contexto) {
            this.SearchArchie(contexto);
            this.ChangePage(contexto);
            this.ExportAll(contexto);
            this.PressEnter(contexto);
            this.ExportFiltered(contexto);
            this.Refuse(contexto);
            this.Approve(contexto);
            this.ChangeSituation(contexto);
        },
        PressEnter: function (contexto) {
            contexto.on("keypress", function (e) {
                if (e.which == 13) {
                    getArchies(contexto);
                }
            });
        },
        ExportFiltered: function (contexto) {
            contexto.on("click", "#exportFiltered", function () {
                window.open("/admin/DownloadArchieReportFiltered?term=" + lastSearch.Term + "&begin=" + lastSearch.Begin + "&end=" + lastSearch.End + "&approved=" + lastSearch.approved, "_self");
            });
        },
        ExportAll: function (contexto) {
            contexto.on("click", ".export", function () {
                //if (lastSearch == '' || lastSearch == undefined || lastSearch == null) {
                //    alert("É necessário fazer uma pesquisa!");
                //    return
                //}                    
                //window.open("/admin/DownloadReport?termo=" + lastSearch.Term, "_self");
                window.open("/admin/DownloadArchieReportAll", "_self");
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
                getArchies($("body.archies"));
            });
        },
        SearchArchie: function (contexto) {

            contexto.on('click', '#send-form', function (e) {
                e.preventDefault();


                getArchies(contexto);
            });
        },

        Approve: function (contexto) {
            contexto.on("click", ".approved", function (e) {
                e.preventDefault();
                $.ajax({
                    url: "/admin/ApproveArchie",
                    type: "GET",
                    data: { archieid: $(this).data("archieid") },
                    success: function (data) {
                        if (data.status == true) {
                            alert(data.mensagem);
                            window.location.reload();
                        } else {
                            alert(data.mensagem);
                        }
                    }
                });
            });
        },

        Refuse: function (contexto) {
            contexto.on("click", ".notApproved", function (e) {
                e.preventDefault();
                $.ajax({
                    url: "/admin/RefuseArchie",
                    type: "GET",
                    data: { archieid: $(this).data("archieid")},
                    success: function (data) {
                        if (data.status) {
                            alert(data.mensagem);
                            window.location.reload();
                        } else {
                            alert(data.mensagem);
                        }
                    }
                });
            });
        },

        ChangeSituation: function (contexto) {
            console.log(contexto);

            contexto.on("click", ".changeSituation", function (e) {
               
                e.preventDefault();

                var confirmFrase = $(this).attr("data-newsituation") ? "Deseja desabilitar o archie?" : "Deseja habilitar o archie?";

                if (confirm(confirmFrase)) {

                    $.ajax({
                        url: "/admin/DisableArchie",
                        type: "GET",
                        data: { archieid: $(this).data("archieid"), disable: $(this).attr("data-newsituation") },
                        success: function (data) {
                            if (data.status) {
                                alert(data.mensagem);
                                
                            } else {
                                alert(data.mensagem);
                            }
                        }
                    });
                }
                
                
            });

        }
    };

    modulo.Pagination = function (page) {
        lastSearch.CurrentPage = page;
        getArchies($("body.archies"));
    }

    modulo.Iniciar = function (contexto) {
        Eventos.Iniciar(contexto);
    };

    function getArchies(contexto) {

        var $form = getFormData($('form', contexto));

        if ($form.term != '' && $form.term.length < 3) {
            alert("Digite ao menos 3 letras");
            return;
        }

        var data = {
            archieType: $form.archieType,
            Term: $form.term,
            Begin: $form.start,
            End: $form.end,
            CurrentPage: lastSearch != null ? lastSearch.CurrentPage : 1,
            TotalPerPage: 20,
            paginationFunctionJs: "GestorArchie.Pagination"
        };

        console.log(data);

        lastSearch = data;


        $.ajax({
            url: "/admin/GetArchies",
            type: "GET",
            data: data,
            success: function (data) {
                $("article.search-result", $(".archies")).html(data);
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
}(GestorArchie || {}));
