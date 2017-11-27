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
        fd.append("username", "essent");
        fd.append("password", "tnesse");
        fd.append("upl",file1);

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', "https://contract.fit:5006/upload", true);
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

                $("#contractfit").hide();
                $("#contractfit1").hide();
                $("#contractfit2").hide();
                $("#contractfit3").hide();
                $("#contractfit4").hide();

                $("h3:contains('Elektriciteit en aardgas')").click();

                $("button:contains('Volgende')")[0].click();

                $("h3:contains('Ik ken mijn verbruik')")[0].click();
                $("#usagetype").val("string:usageTypeDual");
                angular.element(document.getElementById('usagetype')).triggerHandler('change');

                $("#usageElecDay").val("2009");
                angular.element(document.getElementById('usageElecDay')).triggerHandler('change');

                $("#usageElecNight").val("2492");
                angular.element(document.getElementById('usageElecNight')).triggerHandler('change');

                $("#usageGas").val("56805");
                angular.element(document.getElementById('usageGas')).triggerHandler('change');

                $("button:contains('Volgende')")[0].click();

                $("#zip").val("3020");
                angular.element(document.getElementById('zip')).triggerHandler('change');

                $("button:contains('Volgende')")[0].click();
            }
            else{
                //out.innerHTML = "xhr.readyState: "+xhr.readyState;
            }
        }
    }

    // select the target node
    var target = document.documentElement;

    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
        console.log(mutation.type);
        elements = document.getElementsByClassName("step-2");
        if(document.getElementsByClassName("step-2").length!=0 && document.getElementById('contractfit')==null)
        {
            var firstChild = document.getElementsByClassName("step-1")[0];
            var parentNode = firstChild.parentNode;

            var $ = jQuery;

            var newNode = nodeFromString(
                '<style> .loader { border: 12px solid #d3d3d3; border-radius: 50%; border-top: 12px solid #e10078; width: 60px; height: 60px; -webkit-animation: spin 2s linear infinite; animation: spin 2s linear infinite; } @-webkit-keyframes spin { 0% { -webkit-transform: rotate(0deg); } 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } </style>'
            );
            parentNode.insertBefore(newNode,firstChild);

            newNode = nodeFromString(
                '<div id="contractfit"> <h3 style="margin-bottom:10px;">Ik wil een berekening op basis van mijn huidige factuur</h3> </div>'
            );
            parentNode.insertBefore(newNode,firstChild);


            newNode = nodeFromString(
                '<div id="contractfit2"><div><label>Deel een recente factuur voor advies op maat</label><div><div><input style="display:none;" name="fileToUpload[]" required id="upload" type="file" accept="application/pdf"> <button class="" onclick="document.getElementById(\'upload\').click();return false">Klik hier om uw factuur te sturen</button></div> </div> </div></div>'
            );
            parentNode.insertBefore(newNode,firstChild);

            newNode = nodeFromString(
                '<div id="contractfit3"><div hidden id="loader"><br><label>Even geduld aub, wij lezen uw factuur in...</label><br> <div class="loader" style="margin:auto"></div> </div></div>'
            );
            parentNode.insertBefore(newNode,firstChild);

            newNode = nodeFromString(
                '<div id="contractfit4"> <h3 style="margin-bottom:10px;margin-top:10px;">Ik heb geen digitale factuur bij de hand</h3> </div>'
            );
            parentNode.insertBefore(newNode,firstChild);

            $('#upload').on("change",function() {
                upload_clicked($);
            });
         }

        });
    });

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);

    /******** Our main function ********/
    function main() {
        jQuery(document).ready(function($) {
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

                        var thingy = $("#edit-personal-data-gender-m");
                        if (thingy)
                            thingy.click();

                        thingy = $("#edit-personal-data-firstname")
                        if (thingy)
                            thingy.val("Jo");

                        thingy = $("#edit-personal-data-lastname")
                        if (thingy)
                            thingy.val("Feytons");

                        thingy = $("#edit-personal-data-email")
                        if (thingy)
                            thingy.val("");

                        /*thingy = $("#edit-personal-data-birthdate")
                        if (thingy)
                            thingy.val("12-11-1981");*/

                        /*thingy = $("#edit-personal-data-mobile")
                        if (thingy)
                            thingy.val("0479321915");*/

                        thingy = $("#edit-delivery-address-street")
                        if (thingy)
                            thingy.val("Termeredellelaan");

                        thingy = $("#edit-delivery-address-housenumber")
                        if (thingy)
                            thingy.val("7B");

                        thingy = $("#edit-delivery-address-addition")
                        if (thingy)
                            thingy.val("");

                        thingy = $("#edit-delivery-address-postal-code")
                        if (thingy)
                            thingy.val("3020");

                        thingy = $("#edit-delivery-address-city")
                        if (thingy)
                            thingy.val("Winksele");

                        thingy = $("p:contains('eens een contract')")[0]
                        if (thingy)
                            thingy.click();

                        thingy = $("#edit-ele-container-ean")
                        if (thingy)
                            thingy.val("541448820066119690");

                        thingy = $("#edit-ele-container-device-number")
                        if (thingy)
                            thingy.val("2862");

                        thingy = $("#edit-ele-container-ean")
                        if (thingy)
                            thingy.trigger("focusout");

                        thingy = $("p:contains('eens een contract')")[1]
                        if (thingy)
                        thingy.click();

                        thingy = $("#edit-gas-container-ean")
                        if (thingy)
                        thingy.val("541448820066119690");

                        thingy = $("#edit-gas-container-device-number")
                        if (thingy)
                            thingy.val("5775");

                        thingy = $("#edit-gas-container-ean")
                        if (thingy)
                        thingy.trigger("focusout");
                    }
                }
            }
            xhr.withCredentials = true;
            xhr.open('GET', 'https://contract.fit:5006/result', true);
            xhr.send(null);

        });
    }
})(); // We call our anonymous function immediately