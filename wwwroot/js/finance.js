var Finance = (function (modulo) {
    "use strict";    

    var _contexto = $("body.cupons-de-desconto");

    var optionsFullNatureza = [];

    function changeCentroDeCusto(id) {
        $("#CentroDeCustoId").val(id);
        $("#CentroDeCustoId").trigger("chosen:updated");
    }

    var Eventos = {

        Iniciar: function (contexto) {
            //this.SearchCoupon(contexto);
            //this.ChangePage(contexto);
            //this.PressEnter(contexto);
            this.Filter(contexto);
            this.Create(contexto);
            this.Delete(contexto);
            this.ChangeMovimentacao(contexto);
            //this.FillOptions();       
            this.ChangeNatureza(contexto);

        },       

        ChangeNatureza: function (contexto) {
            contexto.on("change", "#NaturezaId", function (e) {
                e.preventDefault();

                var natureza = $(this).val();

                const despesasAdministrativasId = "1";

                const despesasAdministrativas = ["25", "43", "9", "45", "17", "54", "5"];

                if (despesasAdministrativas.includes(natureza)) {
                    changeCentroDeCusto(despesasAdministrativasId);
                    return;
                }

                const despesasComMarketingid = "2";

                const despesasComMarketing = ["28", "32", "37", "38", "39", "49", "51", "53", "11", "53"]

                if (despesasComMarketing.includes(natureza)) {
                    changeCentroDeCusto(despesasComMarketingid);
                    return;
                }

                const despesasComAppsId = "4";

                const despesasComApps = ["29", "30", "50", "52", "21", "55", "56", "59", "65"];

                if (despesasComApps.includes(natureza)) {
                    changeCentroDeCusto(despesasComAppsId);
                    return;
                }

                const despesasEquipeId = 5;

                const despesasEquipe = ["31", "33", "34", "35", "36","46", "47", "48"];

                if (despesasEquipe.includes(natureza)) {
                    changeCentroDeCusto(despesasEquipeId);
                    return;
                }

                const despesasFinanceirasId = "6";

                const despesasFinanceiras = ["8", "42", "12", "18", "6", "7", "3"];

                if (despesasFinanceiras.includes(natureza)) {
                    changeCentroDeCusto(despesasFinanceirasId);
                    return;
                }

                const despesasTributariasID = "8";

                const despesasTributarias = ["23", "44", "242", "20", "19", "22", "16"];

                if (despesasTributarias.includes(natureza)) {
                    changeCentroDeCusto(despesasTributariasID);
                    return;
                }

                const outrasDespesasId = "7";

                const outrasDespesas = ["40", "41", "57", "58", "60", "61"];

                if (outrasDespesas.includes(natureza)) {
                    changeCentroDeCusto(outrasDespesasId);
                    return;
                }

                const proLaboreId = "9";

                const proLabore = ["27", "26"];

                if (proLabore.includes(natureza)) {
                    changeCentroDeCusto(proLaboreId);
                    return;
                }

                const transferenciaId = "11";

                const transferencias = ["2"]

                if (transferencias.includes(natureza)) {
                    changeCentroDeCusto(transferenciaId);
                    return;
                }

            });

        },

        ChangeMovimentacao: function (contexto) {

            contexto.on("change", "#MovimentacaoId", function (e) {
                e.preventDefault();

                $("#NaturezaId option").each(function (index) {
                    var _this = $(this);                    

                    optionsFullNatureza.push({ "value": _this.val(), "text": _this.text() });

                });

                var valor = $(this).val();                

                var entrada = "0";
                var saida = "1";

                if (entrada === valor) {

                    $("#CentroDeCustoId", contexto).val("0");
                    $("#CentroDeCustoId", contexto).trigger("chosen:updated");

                    var NaturezaFicar = ["1", "4", "13", "10", "14", "66"];

                    $("#NaturezaId option").each(function (index) {
                        var _this = $(this);
                        var value = _this.val();

                        if (!NaturezaFicar.includes(value)) {
                            _this.remove();
                        }
                    });

                    $("#NaturezaId", contexto).trigger("chosen:updated");

                }
                else {

                    $("#NaturezaId").empty();

                    optionsFullNatureza.filter(x => $("#NaturezaId").append(new Option(x.text, x.value)));

                    $("#NaturezaId", contexto).trigger("chosen:updated");

                    $("#CentroDeCustoId", contexto).val("");
                    $("#CentroDeCustoId", contexto).trigger("chosen:updated");
                }

            });


        },

        Filter: function (contexto) {

            contexto.on("click", "#send-form", function (e) {

                e.preventDefault();                

                const form = $("form#form-filter", contexto);

                var formObj = getFormData(form);

                getListDre(formObj.term, formObj.start, formObj.end, 1, 10);              
            });


        },

        Delete: function (contexto) {

            contexto.on('click','.delete', function () {
                swal({
                    title: "Tem certeza?",
                    text: "Não será mais possível recuperar as informações!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            var id = $(this).attr('data-id');

                            $.post("/admin/finance/delete", {id:id})
                                .done(data => {
                                    if(data) {
                                        getListDre("", "", "", 1, 10);
                                    }
                                })
                                .fail(($xhr, errorMsg) => alert(errorMsg));
                        }
                    });

            });
        },

        Create: function (contexto) {

            contexto.on("click","#create", function () {

                const form = $("form", contexto);                

                var formObj = getFormData(form);

                console.log(parseInt(formObj.valor.replace('.', '').replace(',', '')));

                var select_box = document.getElementById("ArquitetaId");                
                var archieName = select_box[select_box.selectedIndex].text;

                
                if (formObj.ContaId === "" || formObj.ContaId === undefined) {

                    swal({
                        title: "Algo errado",
                        text: "Campo conta é obrigatório",
                        icon: "error",
                    });

                    return;
                }

                if (formObj.MeioId === "" || formObj.MeioId === undefined) {

                    swal({
                        title: "Algo errado",
                        text: "Campo meio é obrigatório",
                        icon: "error",
                    });

                    return;
                }

                if (formObj.CentroDeCustoId === "" || formObj.CentroDeCustoId === undefined) {

                    swal({
                        title: "Algo errado",
                        text: "Campo Centro de Custo é obrigatório",
                        icon: "error",
                    });

                    return;
                }

                if (formObj.NaturezaId === "" || formObj.NaturezaId === undefined) {

                    swal({
                        title: "Algo errado",
                        text: "Campo Natureza é obrigatório",
                        icon: "error",
                    });

                    return;
                }

                if (formObj.MovimentacaoId === "" || formObj.MovimentacaoId === undefined) {

                    swal({
                        title: "Algo errado",
                        text: "Campo movimentação é obrigatório",
                        icon: "error",
                    });

                    return;
                }

                if (formObj.valor === "" || formObj.valor === undefined) {

                    swal({
                        title: "Algo errado",
                        text: "Campo valor é obrigatório",
                        icon: "error",
                    });

                    return;
                }

                if (formObj.DataDeOcorrencia === "" || formObj.DataDeOcorrencia === undefined) {

                    swal({
                        title: "Algo errado",
                        text: "Campo data de ocorrência é obrigatório",
                        icon: "error",
                    });

                    return;


                } else {

                    var dataREgex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;

                    if (!dataREgex.test(formObj.DataDeOcorrencia)) {
                        swal({
                            title: "Algo errado",
                            text: "Campo data de ocorrência é inválido",
                            icon: "error",
                        });

                        return;
                    }

                }                

                var data = {
                    Descricao: formObj.descricao,
                    MovimentacaoId: parseInt(formObj.MovimentacaoId), 
                    NaturezaId: parseInt(formObj.NaturezaId),
                    CentroDeCustoId: parseInt(formObj.CentroDeCustoId),
                    ArquitetaId: formObj.ArquitetaId !== '' ? parseInt(formObj.ArquitetaId) : null,
                    Valor: parseInt(formObj.valor.replace('.', '').replace(',', '')),
                    MeioId: parseInt(formObj.MeioId),
                    ContaId: parseInt(formObj.ContaId),
                    NomeArchie: formObj.ArquitetaId !== '' ?  archieName : "",
                    DataDeOcorrencia: formObj.DataDeOcorrencia,                    
                }

                console.log(data);

                $.ajax({
                    url: "/finance/create",
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: "post",
                    data: JSON.stringify(data),
                    success: function (data) {                           
                        if (data) {
                            getListDre("", "", "", 1, 10);
                            $("#minhamodal").modal('close');
                        } else {

                            swal({
                                title: "Algo errado",
                                text: "Verifique se todos os campos foram preenchidos corretamente",
                                icon: "error",
                            });
                        }

                    }
                });
            });
        }       

    };


    function loadList() {


    }

    function getListDre(term, begin, end, currentPage, totalPerPage) {

        const $content = $('.search-result');
        //string paginationFunctionJs, int currentPage = 1, decimal totalPerPage = 20

        if (term === undefined)
            term = "";
        if (begin === undefined)
            begin = "";
        if (end === undefined)
            end = "";

        $.get("/admin/finance/getListDre?paginationFunctionJs=Finance.Pagination&currentPage=" + currentPage + "&totalPerPage=" + totalPerPage + "&term=" + term + "&begin=" + begin + "&end=" + end)
            .done(data => $content.html(data))
            .fail(($xhr, errorMsg) => $content.text(`Error: ${errorMsg}`));
    }   

    function getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    modulo.Iniciar = function (contexto) {
        Eventos.Iniciar(contexto);

        getListDre("", "","", 1,10);

        $('#valor').bind('keyup paste', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    };

    modulo.Pagination = function (currentPage) {        

        const form = $("form#form-filter", _contexto);

        var formObj = getFormData(form);

        getListDre(formObj.term, formObj.start, formObj.end, currentPage, 10);
    }

    return modulo;
}(Finance || {}));
