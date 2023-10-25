

var Boleto = (function (modulo) {
    "use strict";

    modulo.Eventos = {
        Iniciar: function (contexto) {
            modulo.Eventos.AoClicarVerBoleto(contexto);    
        },
        AoClicarVerBoleto: function (contexto) {

            contexto.on("click", "#link-boleto", function (e) {
                e.preventDefault();
                var orderId = $(this).attr("data-orderid");                
                $.ajax({
                    type: "POST",                    
                    url: "/transaction/GetLinkBoleto",
                    data: {
                        orderID: orderId,      
                    },                    
                    dataType: "json",
                    beforeSend: function () {

                        DisableLinkBoleto();
                    },
                    success: function (result) {
                                                
                        if (result.url) {
                            window.open(result.url, "_blank");
                        }                                             

                        EnableLinkBoleto();
                        
                    },
                    error: function () {
                        alert('Ocorreu um erro, por favor entre em contato conosco.');
                        EnableLinkBoleto();
                    }
                });

            });
            
        }
        
    };    

    modulo.Iniciar = function (contexto) {
        modulo.Eventos.Iniciar(contexto);
        textoAtual = $('#link-boleto').text();
    };

    var textoAtual = "";

    function DisableLinkBoleto() {
        $('#link-boleto').data("disabled", "disabled");
        $('#link-boleto').text("Processando...");
    }

    function EnableLinkBoleto() {
        $('#link-boleto').text(textoAtual);
        $('#link-boleto').data("disabled", "");
    }

    return modulo;
}(Boleto || {}));