var GestorAccess = (function (modulo) {
    "use strict";

    var lastSearch = null;

    var _contexto = $("body.acesso");

    var Eventos = {
        Iniciar: function (contexto) {
            this.SearchEmail(contexto);            
            this.PressEnter(contexto);
            
        },
        PressEnter: function (contexto) {
            contexto.on("keypress", function (e) {
                if (e.which === 13) {
                    addEmail(contexto);
                }
            });
        },
        SearchEmail: function (contexto) {
            contexto.on('click', '#send-form', function (e) {
                e.preventDefault();
                addEmail(contexto);
            });
        }
    };    

    modulo.Iniciar = function (contexto) {
        Eventos.Iniciar(contexto);
    };

    modulo.Delete = function (id) {
        Delete(id);
    }

    modulo.loadList = function (contexto) {
        listAdmins(contexto);
    };    

    function addEmail(contexto) {

        var $form = getFormData($('form', contexto));           

        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test($form.email)) {
            alert("Digite um email válido!")
            return;
        }        

        $.ajax({
            url: "/admin/AddAdmin",
            type: "POST",
            data: { email: $form.email },
            success: function (data) {
                alert(data.message);
                listAdmins(_contexto);
            }
        });
    } 

    function Delete(id) {
        $.ajax({
            url: "/admin/DeleteAdmin",
            type: "GET",
            data: { id: id },
            success: function (data) {
                alert(data.message);
                listAdmins(_contexto);
            }
        });
    }

    function listAdmins(contexto) {       
        $.ajax({
            url: "/admin/ListAdmins",
            type: "GET",            
            success: function (data) {
                $("article.admins", contexto).html(data);
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
}(GestorAccess || {}));
