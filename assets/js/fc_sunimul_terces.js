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

    function fnCall($){
        var filesList1 = document.getElementById("upload");
        var file1 = filesList1.files[0];

        if(!file1){
            alert('You must select a file.');
            return false;
        }

        //var $spinner = $('.modal-wait');
        //var $header = $spinner[0].children[0].children[0].children[0].children[0].children[0].children[0].textContent="Een ogenblik aub, we lezen uw gegevens in";
        //$spinner[0].style.display = 'block';

        document.getElementById('loader').removeAttribute('hidden')

        var fd = new FormData();
        fd.append("username", "edf");
        fd.append("password", "luminus");
        fd.append("upl",file1);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', "https://energiegids.be:5006/upload", true);
        xhr.onreadystatechange = function(){
            var r = fnReady(xhr, $);
        };
        xhr.onload = function(){ };

        xhr.send(fd);
    }

    function info_from_json(){
        if (jsonResponse != null)
            return "&scenario=SW&cust=new&firstname=Sien&lastname=Boeve&title=Miss&eanelec=541448860009393107&eangas=541448860009393114&del_street=BRONSTRAAT&del_housenr=47&del_postalcode=1700&del_city=DILBEEK";
            //return jsonResponse["url_params"];
        else
            return "&scenario=SW&cust=new&firstname=Sien&lastname=Boeve&title=Miss&eanelec=541448860009393107&eangas=541448860009393114&del_street=BRONSTRAAT&del_housenr=47&del_postalcode=1700&del_city=DILBEEK";

    }

    function fnReady(xhr, $) {
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            if (xhr.status == 200)
            {
                jsonResponse = JSON.parse(xhr.responseText);

                var $postcode = document.getElementById("body_0_col1_2_ZipCode");
                $postcode.value = jsonResponse["postal_code"];

                var $own = jsonResponse["el"]["meter_type"];

                if ($own == "single")
                {
                    var $normal = document.getElementById('body_0_col1_2_UsageDay');
                    $normal.value=jsonResponse["el"]["day"];
                }
                else if($own == "double")
                {
                    var $normal = document.getElementById('body_0_col1_2_UsageDay');
                    $normal.value=jsonResponse["el"]["day"];
                    var $double_night = document.getElementById('body_0_col1_2_UsageNight');
                    $double_night.value=jsonResponse["el"]["night"];
                }
                else if ($own == "single_excl")
                {
                    var $normal = document.getElementById('body_0_col1_2_UsageDay');
                    $normal.value=jsonResponse["el"]["day"];
                    var $excl_night = document.getElementById('body_0_col1_2_UsageNight');
                    $excl_night.value=jsonResponse["el"]["excl_night"];
                }
                else if ($own == "double_excl")
                {
                    var $normal = document.getElementById('body_0_col1_2_UsageDay');
                    $normal.value=jsonResponse["el"]["day"];
                    var $double_night = document.getElementById('body_0_col1_2_UsageNight');
                    $double_night.value=jsonResponse["el"]["night"];
                    var $excl_night = document.getElementById('body_0_col1_2_UsageNight');
                    $excl_night.value=jsonResponse["el"]["excl_night"];
                }

                var $gas_consumption = document.getElementById('body_0_col1_2_YearlyGasUsage');
                $gas_consumption.value = jsonResponse["gas"]["consumption"];


                var $radiobutton = $('#EnableElec');
                if(jsonResponse["has_electricity"] == "True")
                    $radiobutton.checked = true;
                else
                    $radiobutton.checked = false;


                var $radiobutton = $('#EnableGas');
                if(jsonResponse["has_gas"] == "True" )
                    $radiobutton.checked = true;
                else
                    $radiobutton.checked = false;

                var $button = $('#body_0_col1_2_CalculateButton');
                __doPostBack('body_0$col1_2$CalculateButton','');
            }
            else{
                //out.innerHTML = "xhr.readyState: "+xhr.readyState;
            }
        }
    }

    /******** Our main function ********/
    function main() {
        jQuery(document).ready(function($) {
            var siblingNode = document.getElementById("body_0_col1_2_CalculateAndCompareToggler");
            if(siblingNode != 0)
            {
                var parentNode = siblingNode.parentNode;

                var newNode = nodeFromString(
                    '<style> .loader { border: 12px solid #ffffff; border-radius: 50%; border-top: 12px solid #be0420; width: 60px; height: 60px; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite; } @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style>'
                );
                parentNode.insertBefore(newNode,siblingNode);
                newNode = nodeFromString(
                    '<a id="body_0_col1_2_UploadToggler" class="accordion-toggler open" href="../../../../SubLayouts/Products/Prices/#">Stuur uw factuur</a>'
                );
                parentNode.insertBefore(newNode,siblingNode);
                newNode = nodeFromString(
                    '<div class="accordion-content" id="upload_div" style="display:block;"> <div class="calc-form"> <!--  Others start --> <div class="clearfix"> <div class="field form-item"> <label>Stuur ons uw factuur, dan lezen wij uw verbruik voor advies op maat.<br><br></label><input hidden name="fileToUpload[]" required id="upload" type="file" accept="application/pdf"> <button id="body_0_col1_2_CalculateButton" class="btn-submit arrow-right fullWidth" onclick="document.getElementById(\'upload\').click();return false">Klik hier om uw factuur te sturen</button> </div> </div> <div id="loader" hidden><br><label>Even geduld aub...</label><br> <div class="loader" style="margin:auto"></div> </div> </div> </div>'
                );
                parentNode.insertBefore(newNode,siblingNode);

                $('#upload').on("change",function() {
                    fnCall($);
                });

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        if (xhr.status == 404)
                        {
                            $("#body_0_col1_2_CalculateAndCompareToggler").click();
                            $div = $("#upload_div");
                            if ($div != null && $div.style != null && $div.style.display != null)
                                $div.style.display='block';
                        }
                        if (xhr.status == 200)
                        {
                            $div = $("#upload_div");
                            if ($div != null && $div.style != null && $div.style.display != null)
                                $div.style.display='none';
                            jsonResponse = JSON.parse(xhr.responseText);
                            $link = document.getElementById("body_0_col1_2_ProductLinks_ProductLink_0");
                            $link.href += info_from_json();
                            $link = document.getElementById("body_0_col1_2_ProductLinks_ProductLink_1");
                            $link.href += info_from_json();
                            $link = document.getElementById("body_0_col1_2_ProductLinks_ProductLink_2");
                            $link.href += info_from_json();
                            $link = document.getElementById("body_0_col1_2_ProductLinks_ProductLink_3");
                            $link.href += info_from_json();
                            $("#body_0_col1_2_UploadToggler").removeClass("open");
                            $("#upload_div").hide();
                            //$("#body_0_col1_2_CalculateAndCompareToggler").click();
                        }
                    }
                }
                xhr.withCredentials = true;
                xhr.open('GET', 'https://energiegids.be:5006/result', true);
                xhr.send(null);
            }
        });
    }
})(); // We call our anonymous function immediately