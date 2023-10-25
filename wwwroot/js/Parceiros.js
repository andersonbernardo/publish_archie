var Parceiros = (function (modulo) {
    "use strict";    

    var Eventos = {
        Iniciar: function (contexto, parceiro) {
            this.AddCupom(contexto, parceiro);
        },
        AddCupom: function (contexto, parceiro) {
            
            contexto.on("click", "a.more", function (e) {
                e.preventDefault();
                
                var total = $("fieldset > div.count", contexto).length;

                var container = $("fieldset > div."+total, contexto);

                var html = "<div class='field count replace'><input id='cupom-replace' class=" + parceiro + " name='cupom' type='text'><label for='cupom-replace'>Cupom replace</label></div>".replace(/replace/g, total + 1);


                container.after(html);

            });
        }
    };

    modulo.Iniciar = function (contexto, parceiro) {
        Eventos.Iniciar(contexto, parceiro);
    };
    
    function getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    return modulo;
}(Parceiros || {}));
