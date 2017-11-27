(function() {
    main();
    var jsonResponse = null;

    function nodeFromString(html) {
        var frag = document.createDocumentFragment(),
        tmp = document.createElement('body'), child;
        tmp.innerHTML = html;
        // Append elements in a loop to a DocumentFragment, so that the browser does
        // not re-render the document for each node
        return tmp.firstChild;
    }

    function upload_clicked($){
        var filesList1 = document.getElementById("upload");
        var file1 = filesList1.files[0];

        if(!file1){
            alert('You must select a file.');
            return false;
        }

        document.getElementById('loader').removeAttribute('hidden')

        var fd = new FormData();
        fd.append("username", "eni");
        fd.append("password", "ine");
        fd.append("upl",file1);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', "https://contract.fit:5001/upload", true);
        xhr.onreadystatechange = function(){
            var r = fnReady(xhr, $);
        };
        xhr.onload = function(){ };

        xhr.send(fd);
    }

    function fnReady(xhr, $) {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            if (xhr.status == 200)
            {
                jsonResponse = JSON.parse(xhr.responseText);

                var $postcode = document.getElementById("inputPostcode");
                $postcode.value = jsonResponse["delivery_address"]["zip_code"];

                var $normal = document.getElementById('inputDagverbruik');
                $normal.value=jsonResponse["el"]["day"];

                var $double_night = document.getElementById('inputNachtverbruik');
                $double_night.value=jsonResponse["el"]["night"];

                var $gas_consumption = document.getElementById('inputGasverbruik');
                $gas_consumption.value = jsonResponse["gas"]["consumption"];

                var $choice = document.getElementById('radChoiceElekGas');
                $choice.click();

                var $radiobutton = $('#solarNo');
                    $radiobutton.click();

                var $button = $('#btnCalculate');
                $button.click();
            }
            else{
                //out.innerHTML = "xhr.readyState: "+xhr.readyState;
            }
        }
    }

    /******** Our main function ********/
    function main() {
        jQuery(document).ready(function($) {
            var parentNode = document.getElementById("pbtInput");
            if(parentNode)
            {
                var firstChild = parentNode.firstChild;

                var newNode = nodeFromString(
                    '<style> .loader { border: 12px solid #d3d3d3; border-radius: 50%; border-top: 12px solid #fbd034; width: 60px; height: 60px; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite; } @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style>'
                );
                parentNode.insertBefore(newNode,firstChild);



                newNode = nodeFromString(
                    '<div class="panel-heading"> <h3 class="panel-title">Ik wil een berekening op basis van mijn huidige factuur</h3> </div>'
                );
                parentNode.insertBefore(newNode,firstChild);


                newNode = nodeFromString(
                    '<div class="panel-body"><div class="form-group"><label for="inputPostcode" class="col-sm-3 control-label">Deel een recente factuur voor advies op maat</label><div class="col-sm-5"><div class="input-group"><input style="display:none;" name="fileToUpload[]" required id="upload" type="file" accept="application/pdf"> <button class="" onclick="document.getElementById(\'upload\').click();return false">Klik hier om uw factuur te sturen</button></div> </div> </div></div>'
                );
                parentNode.insertBefore(newNode,firstChild);



                newNode = nodeFromString(
                    '<div class="panel-body"><div hidden id="loader"><br><label>Even geduld aub, wij lezen uw factuur in...</label><br> <div class="loader" style="margin:auto"></div> </div></div>'
                );
                parentNode.insertBefore(newNode,firstChild);


                $('#upload').on("change",function() {
                    upload_clicked($);
                });
            }

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status == 404)
                    {
                        //$("#body_0_col1_2_CalculateAndCompareToggler").click();
                    }
                    if (xhr.status == 200)
                    {
                        jsonResponse = JSON.parse(xhr.responseText);

                        var $salutation = document.getElementById("Step2_Salutation_radioMevrouw");
                        if($salutation)
                            $salutation.click();

                        var $firstName = document.getElementById("Step2_FirstName");
                        if($firstName)
                            $firstName.value = jsonResponse["person"]["first_name"];

                        var $lastName = document.getElementById("Step2_LastName");
                        if($lastName)
                            $lastName.value = jsonResponse["person"]["last_name"];

                        var $scenario = document.getElementById("Step3_ElectricityData_DeliverWhere_SwitchToHere");
                        if($scenario)
                            $scenario.click();

                        var $ean_el_known = document.getElementById("SalesCommodityElecDataModel_True");
                        if($ean_el_known)
                            $ean_el_known.click();

                        var $ean_el = document.getElementById("Step3_ElectricityData_EanCode")
                        if($ean_el)
                            $ean_el.value = jsonResponse["el"]["EAN"]

                        var $current_supplier_el = document.getElementById("Step3_ElectricityData_PreviousSupplier_Value");
                        if($current_supplier_el)
                            $current_supplier_el.value = "1-EYYBM";

                        var $speed = document.getElementById("Step3_ElectricityData_PreferredSwitchDate_radioIk_wil_zo_snel_mogelijk_overstappen_naar_Eni__Ik_betaal_geen_verbrekingsvergoeding");
                        if($speed)
                            $speed.click();

                        $scenario = document.getElementById("Step3_GasData_DeliverWhere_SwitchToHere");
                        if($scenario)
                            $scenario.click();

                        var $ean_gas_known = document.getElementById("SalesCommodityGasDataModel_True");
                        if($ean_gas_known)
                            $ean_gas_known.click();

                        var $ean_gas = document.getElementById("Step3_GasData_EanCode")
                        if($ean_gas)
                            $ean_gas.value = jsonResponse["gas"]["EAN"]

                        var $current_supplier_gas = document.getElementById("Step3_GasData_PreviousSupplier_Value");
                        if($current_supplier_gas)
                            $current_supplier_gas.value = "1-EYYBM";

                        $speed = document.getElementById("Step3_GasData_PreferredSwitchDate_radioIk_wil_zo_snel_mogelijk_overstappen_naar_Eni__Ik_betaal_geen_verbrekingsvergoeding");
                        if($speed)
                            $speed.click();

                        var $zip_code = document.querySelector('[id^="zipcodeInt"]');
                        if($zip_code)
                            $zip_code.value = jsonResponse["delivery_address"]["zip_code"];

                        var $city = document.querySelector('[id^="city"]');
                        if($city)
                            $city.value = jsonResponse["delivery_address"]["city"];

                        var $street = document.querySelector('[id^="street"]');
                        if($street)
                            $street.value = jsonResponse["delivery_address"]["street"];

                        var $housenumber = document.querySelector('[id^="housenumber"]');
                        if($housenumber)
                            $housenumber.value = jsonResponse["delivery_address"]["number"];

                    }
                }
            }
            xhr.withCredentials = true;
            xhr.open('GET', 'https://contract.fit:5001/result', true);
            xhr.send(null);

        });
    }
})(); // We call our anonymous function immediately