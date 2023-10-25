

var paymentIugu = (function (module) {





    var events = {
        Start: function ($form,dev) {
            SendForm($form,dev);
        }
    };

    module.Init = function ($form,dev) {
        events.Start($form,dev)
    }

    function SendForm($form,dev) {
        $form.submit(function (event) {

            var number = $("#payment-form #cc-numero").val();
            var nameComplete = $("#payment-form #cc-nome").val();
            var nameArray = nameComplete.split(" ");
            var firstName = nameArray[0];
            var surName = nameArray.slice(1).join(" ");
            var month = $("#payment-form #cc-validade-mes").val();
            var year = $("#payment-form #cc-validade-ano").val();
            var cvv = $("#payment-form #cc-cvv").val();               

            if (number && month && year && firstName && surName && cvv) {

                $.ajax({
                    url: "/transaction/getiuguid",
                    type: "POST"

                }).then(function (data) {

                    Iugu.setAccountID(data);

                    if (dev) { console.log("test mode"); Iugu.setTestMode(true); }

                    const cc = Iugu.CreditCard(number,
                        month, year, firstName,
                        surName, cvv);

                    Iugu.createPaymentToken(cc, function (response) {                        

                        if (response.errors) {

                            console.log(response.errors);
                            inputErrors("Verifique se os dados estão corretos e tente novamente!");

                        } else {
                            var installments = $("#payment-form #months").val();

                            $form.trigger('reset');
                            $form.append($('<input type="hidden" name="ccCardHash">').val(response.id));
                            $form.append($('<input type="hidden" name="installments">').val(installments));                           

                            $form.get(0).submit();

                            //var data = {
                            //    ccCardHash: response.id,
                            //    orderId: 1234,
                            //    installments: installments,
                            //    roomIds: [1,2]
                            //}

                            //$.ajax({
                            //    url: "/transaction/PaymentAsync",
                            //    type: "POST",
                            //    data: data
                            //}).then(function (result) {

                            //    console.log(result);

                            //}, function (error) {
                            //    console.log(error);
                            //})

                            
                        }
                    });
                });

            }

            return false;
        });

        function inputErrors(stringError) {

            //Clean previous errors
            var divErrorSelector = $("div.feedback.error");
            divErrorSelector.remove();
            var genericFeedback = '<p>Confira se os dados do cartão foram inseridos corretamente e faça uma nova tentativa.</p>';
            var divError = $('<div id="card_error" class="feedback error">' +
                '<h3>Ops! Algo deu errado com seu pagamento.</h3>' + (stringError == '' ? genericFeedback : stringError) + '</div>');

            divError.insertAfter("article.cadastro.step-03 h2");

            $('html, body').animate({ scrollTop: $('#card_error').offset().top }, 600);

        }
    }

    return module;
})(paymentIugu || {})




