var GestorCoupon = (function (modulo) {
    "use strict";

    var lastSearch = null;

    var _contexto = $("body.cupons-de-desconto");

    var Eventos = {
        Iniciar: function (contexto) {
            this.SearchCoupon(contexto);
            this.ChangePage(contexto);
            this.PressEnter(contexto);
            this.SearchKey(contexto);
            //this.Create(contexto);
        },
        PressEnter: function (contexto) {
            contexto.on("keypress", function (e) {
                if (e.which === 13) {
                    getArchies(contexto);
                }
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
                listKeys(_contexto, lastSearch.Term);
            });
        },
        SearchKey: function (contexto) {
            contexto.on('click', '#send-form-key', function (e) {
                e.preventDefault();
                
                getKeys(contexto);
            });
        },
        SearchCoupon: function (contexto) {
            contexto.on('click', '#send-form', function (e) {
                e.preventDefault();
                getCoupons(contexto);
            });
        }
        
        //Create: function (contexto) {           
        //    contexto.on("submit", "form", function (e) {
        //        e.preventDefault();
        //        var $form = getFormData($('form', contexto));

        //        $.ajax({
        //            url: "/admin/GetArchies",
        //            type: "POST",
        //            data: $form,
        //            success: function (data) {
        //                $("article.search-result", $(".archies")).html(data);
        //            }
        //        });
        //    })
        //}      

    };

    modulo.PaginationCoupon = function (page) {
        lastSearch.CurrentPage = page;
        getCoupons(_contexto);
    };

    modulo.PaginationListKey = function (page) {
        lastSearch.CurrentPage = page;
        listKeys(_contexto, lastSearch.Term);
    }

    modulo.Iniciar = function (contexto) {
        Eventos.Iniciar(contexto);
    };

    modulo.loadKeys = function (contexto) {
        getKeys(contexto);
    };

    modulo.loadCoupons = function (contexto) {
        getCoupons(contexto);
    };

    modulo.cancelCoupon = function(id) {

        if (confirm("Deseja realmente cancelar esse cupom")) {
            $.ajax({
                url: "/admin/CancelCoupon",
                type: "POST",
                data: {id: id},
                success: function (data) {
                    if (data.status) {
                        alert(data.message);
                        window.location.href = "/admin/filtercoupon";
                    } else {
                       alert(data.message);
                    }
                }
            });
        }
    };

    modulo.listKeys = function (contexto, campanha) {        
        listKeys(contexto, campanha);
    }

    function listKeys(contexto, campanha) {       

        var data = {
            Term: campanha,
            CurrentPage: lastSearch !== null ? lastSearch.CurrentPage : 1,
            TotalPerPage: 20,
            paginationFunctionJs: "GestorCoupon.PaginationListKey"
        };

        lastSearch = data;

        $.ajax({
            url: "/admin/ListKeys",
            type: "GET",
            data: data,
            success: function (data) {
                $("article.search-result", contexto).html(data);
            }
        });

    }

    function getKeys(contexto) {

        var $form = getFormData($('form', contexto));

        if ($form.term !== '' && $form.term.length < 3) {
            alert("Digite ao menos 3 letras");
            return;
        }

        var data = {
            Term: $form.term,            
            CurrentPage: lastSearch !== null ? lastSearch.CurrentPage : 1,
            TotalPerPage: 20,
            paginationFunctionJs: "GestorCoupon.PaginationKey"
        };

        lastSearch = data;

        $.ajax({
            url: "/admin/GetKeys",
            type: "GET",
            data: data,
            success: function (data) {
                $("article.search-result", contexto).html(data);
            }
        });

    }

    function getCoupons(contexto) {

        var $form = getFormData($('form', contexto));

        if ($form.term !== '' && $form.term.length < 3) {
            alert("Digite ao menos 3 letras");
            return;
        }

        var data = {            
            Term: $form.term,
            Begin: $form.start,
            End: $form.end,
            CurrentPage: lastSearch !== null ? lastSearch.CurrentPage : 1,
            TotalPerPage: 20,
            paginationFunctionJs: "GestorCoupon.PaginationCoupon"
        };

        lastSearch = data;

        $.ajax({
            url: "/admin/GetCoupons",
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
}(GestorCoupon || {}));
