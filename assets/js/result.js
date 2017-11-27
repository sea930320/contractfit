$(document).ready(function(){
    // Column height
    $('#result-table-right .result-column').height( $('#result-table-left .result-column:last-child').height() );

    // More options
    $('#moreOptions').click(function(){
        if($('.option-list-item-hide').css('display') == 'none'){
            $('.option-list-item-hide').show();
            $('#moreOptions').text('Minder opties tonen');
        } else {
            $('.option-list-item-hide').hide();
            $('#moreOptions').text('Meer opties tonen');
        }
    });

    // Personal data
    $('#enablePersonalData').click(function(event){
        event.preventDefault();
        var status = $("#personal-data input").prop('disabled');
        $("#personal-data input").prop('disabled', !status);
        if(status){
            $('#enablePersonalData').text('Klik hier om op te slaan');
        } else {
            $('#enablePersonalData').text('Klik hier om te wijzigen');
        }
    });
    introJs.start();

});

/*
// Data
var app = angular.module('app', ['mm.foundation']);

app.controller('optionsController', function($scope,$modal){

    // Detail modals
    $scope.openElectricityModal = function(offer){
        var modalInstance = $modal.open({
            templateUrl: '/templates/detail-modal.php',
            controller: 'detailModalController',
            backdrop: 'static',
            windowClass: 'detail-modal',
            resolve: {
                your_product: function(){
                    return $scope.your_electricity;
                },
                best_product: function(){
                    return offer;
                },
                title: function(){
                    return 'Elektriciteit'
                }
            }
        });
    }

    $scope.openGasModal = function(offer){
        var modalInstance = $modal.open({
            templateUrl: '/templates/detail-modal.php',
            controller: 'detailModalController',
            backdrop: 'static',
            windowClass: 'detail-modal',
            resolve: {
                your_product: function(){
                    return $scope.your_gas;
                },
                best_product: function(){
                    return offer;
                },
                title: function(){
                    return 'Gas'
                }
            }
        });
    }

    // Options
    $scope.original_gas_products = [];
    $scope.gas_products = [];
    $scope.original_electricity_products = [];
    $scope.electricity_products = [];

    var setOptions = function(){
        $scope.options = {
            differentProvidersValue: true,
            domicieleringOptional: true,
            vregIndicatorMinScoreValue: true,
            fixedRateValue: true,
            variabelRateValue: true,
            payInAdvanceValue: false,
            greenPercentageValue: true,
            currentPromotionsValue: true,
            undefinedContractValue: true,
            oneYearContractValue: true,
            twoYearContractValue: true,
            threeYearContractValue: true,
            fiveYearContractValue: true,
            digitalInvoiceValue: true,
            contractFitChangeValue: false,
        };
    };
    setOptions();

    // Load external XML
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse Xml
            var xmlText = new XMLSerializer().serializeToString(xhttp.responseXML),
                x2js = new X2JS(),
                jsonObj = x2js.xml_str2json(xmlText);
            $scope.xmlContent = jsonObj.root;

            // Set your products
            if(jsonObj.root.offers_gas)
                $scope.your_gas = jsonObj.root.offers_gas.your_product;
            if(jsonObj.root.offers_electricity)
                $scope.your_electricity = jsonObj.root.offers_electricity.your_product;

            // Set origial arrays
            if(jsonObj.root.offers_gas)
                $scope.original_gas_products = $scope.gas_products = jsonObj.root.offers_gas.product;
            if(jsonObj.root.offers_electricity)
                $scope.original_electricity_products = $scope.electricity_products = jsonObj.root.offers_electricity.product;
            if($scope.gas_products.length > 0)
                $scope.original_gas_products = $scope.gas_products = $scope.gas_products;
            if($scope.electricity_products.length > 0)
                $scope.original_electricity_products = $scope.electricity_products = $scope.electricity_products;

	    $scope.user = {};
	    if(jsonObj.root.user_type != undefined)
		    $scope.user.user_type = jsonObj.root.user_type._value;
	    if(jsonObj.root.delivery_address != undefined)
		    $scope.user.delivery_address = jsonObj.root.delivery_address._value;
	    if(jsonObj.root.gas_supplier != undefined)
		    $scope.user.gas_supplier = jsonObj.root.gas_supplier._value;
	    if(jsonObj.root.gas_product != undefined)
		    $scope.user.gas_product = jsonObj.root.gas_product._value;
	    if(jsonObj.root.gas_consumption != undefined)
		    $scope.user.gas_consumption = jsonObj.root.gas_consumption._value;
	    if(jsonObj.root.el_supplier != undefined)
		    $scope.user.el_supplier = jsonObj.root.el_supplier._value;
	    if(jsonObj.root.el_product != undefined)
		    $scope.user.el_product = jsonObj.root.el_product._value;
	    if(jsonObj.root.meter_type != undefined)
		    $scope.user.meter_type = jsonObj.root.meter_type._value;
	    if(jsonObj.root.el_day != undefined)
		    $scope.user.el_day = jsonObj.root.el_day._value;
	    if(jsonObj.root.el_night != undefined)
		    $scope.user.el_night = jsonObj.root.el_night._value;
	    if(jsonObj.root.el_excl_night != undefined)
		    $scope.user.el_excl_night = jsonObj.root.el_excl_night._value;
	    if(jsonObj.root.el_kVA != undefined)
		    $scope.user.kVA = jsonObj.root.kVA._value;
	    else
		    $scope.user.kVA = "0";

            $scope.updateResults();

            $scope.$apply();
        }
    };
    angular.element(document).ready(function(){
        xhttp.open("GET", optionsXML , true);
        xhttp.send();
    });

    // Catch click
    $scope.changeElectricity = function(action,call){
        var position = $scope.electricity_products.indexOf($scope.active_electricity);
        if(action == 'next') var index = ((position+1) > ($scope.electricity_products.length - 1) ? 0 : position + 1 );
        if(action == 'prev') var index = ((position-1) < 0 ? ($scope.electricity_products.length -1) : position - 1 );
        $scope.active_electricity = $scope.electricity_products[index];
        if(!$scope.options.differentProvidersValue && call == 'click') $scope.changeGas(action);
    };
    $scope.changeGas = function(action,call){
        var position = $scope.gas_products.indexOf($scope.active_gas);
        if(action == 'next') var index = ((position+1) > ($scope.gas_products.length - 1) ? 0 : position + 1 );
        if(action == 'prev') var index = ((position-1) < 0 ? ($scope.gas_products.length -1) : position - 1 );
        $scope.active_gas = $scope.gas_products[index];
        if(!$scope.options.differentProvidersValue && call == 'click') $scope.changeElectricity(action);
    };

    var updateArrays = function(section,obj){
        // Domiciliering
        var domicielering = ($scope.options.domicieleringOptional ? true : (obj.domiciliering_required._value == 'True' ? false : true ));
        // Min-score
        var min_score_value = ($scope.options.vregIndicatorMinScoreValue ? (obj.service_level._value == 5 ? true : false) : true);
        // Fixed/Var
        if($scope.options.fixedRateValue == true && obj.rate_type._value == 'Vast'){
            rate_value = true;
        } else if($scope.options.variabelRateValue == true && obj.rate_type._value == 'Variabel'){
            rate_value = true;
        } else {
            rate_value = false;
        };
        // Pay in Advance
        var pay_in_advance = ($scope.options.payInAdvanceValue ? true : (obj.upfront_payment_required._value == 'False' ? true : false));
        // Pay in Advance
        var green_percentage = (section == 'electricity' ? ($scope.options.greenPercentageValue ? true : (parseInt(obj.green_level._value) < 100 ? false : true)) : true);
        // Contract duration
        if($scope.options.undefinedContractValue == true){ // && obj.duration._value == '/'
            contract_duration = true;
        } else if($scope.options.twoYearContractValue == true && (obj.duration._value == '2' || obj.duration._value =='\\')){
            contract_duration = true;
        } else if($scope.options.oneYearContractValue == true && (obj.duration._value == '1' || obj.duration._value =='\\')){
            contract_duration = true;
        } else if($scope.options.threeYearContractValue == true && (obj.duration._value == '3' || obj.duration._value =='\\')){
            contract_duration = true;
        } else if($scope.options.fiveYearContractValue == true && obj.duration._value == '5'){
            contract_duration = true;
        } else {
            contract_duration = false;
        }
        // Paper invoice
        var digital_invoice = ($scope.options.digitalInvoiceValue ? true : (obj.only_digital_invoice._value == 'True' ? false : true ));
        // Contract-fit change
        var contract_fit_change = ($scope.options.contractFitChangeValue ? (obj.one_click_change._value == 'True' ? true : false ) : true );
        // Return
        return (min_score_value && domicielering && rate_value && pay_in_advance && green_percentage && contract_fit_change && digital_invoice && contract_duration);
    }

    // Sort
    $scope.sortResults = function(electricity_array,gas_array){

        // Gas
        if($scope.original_gas_products.length > 1)
            $scope.gas_products = gas_array.sort(function(a,b){
                var delta_a  = a.your_product_delta;
                var delta_b  = b.your_product_delta;
                return delta_b - delta_a;
            });
        // Electricity
        if($scope.original_electricity_products.length > 1)
            $scope.electricity_products = electricity_array.sort(function(a,b){
                var delta_a  = a.your_product_delta;
                var delta_b  = b.your_product_delta;
                return delta_b - delta_a;
            });
        // Set active item (item)
        setActiveFirst($scope.electricity_products,$scope.gas_products);
    };

    $scope.showChangeBtn = function(){
        if($scope.active_electricty && $scope.active_gas)
            if($scope.active_electricty.one_click_change._value == 'True' && $scope.active_electricty.one_click_change._value == 'True')
                return true;
        return false;
    };

    $scope.updateResults = function(){
        
        // Extra costs
        if($scope.options.currentPromotionsValue == false){
            cost_property = 'total_cost_no_discount';
        }else if($scope.options.domicieleringOptional == false && $scope.options.digitalInvoiceValue == false){
            cost_property = 'total_cost_no_dom_digital';
        }else if($scope.options.domicieleringOptional == true && $scope.options.digitalInvoiceValue == false){
            cost_property = 'total_cost_no_digital';
        } else if($scope.options.domicieleringOptional == false && $scope.options.digitalInvoiceValue == true){
            cost_property = 'total_cost_no_dom';
        } else {
            var cost_property = 'total_cost';
        };

        // Add difference your_property
        if($scope.original_gas_products.length > 0)
            $scope.original_gas_products.map(function(obj,index){ 
                obj.id = index;
                obj.your_product_delta = $scope.your_gas.total_cost._value - obj[cost_property]._value; 
            });
        if($scope.original_electricity_products.length > 0)
            $scope.original_electricity_products.map(function(obj,index){ 
                obj.id = index;
                obj.your_product_delta = $scope.your_electricity.total_cost._value - obj[cost_property]._value; 
            });

        // Gas
        var gas_array = $scope.original_gas_products.filter(function(obj){
        return updateArrays('gas',obj);
        });
        // Electricity
        var electricity_array = $scope.original_electricity_products.filter(function(obj){
        return updateArrays('electricity',obj);
        });

        $scope.sortResults(electricity_array,gas_array);

        if(!$scope.options.differentProvidersValue){
            var combinations_array = [];
            var couple_counter = 0;
            //  Make Combinations
            for(var i = 0; i < electricity_array.length; i++){
                for(var j = 0; j < gas_array.length; j++){
                    // Same providers
                    if(electricity_array[i].supplier_id._value!="0.00" && (electricity_array[i].supplier_id._value == gas_array[j].supplier_id._value)){
                        var saving = electricity_array[i].your_product_delta + gas_array[j].your_product_delta;
                        // Add ids (angular dupes)
                        var elec_product = angular.copy(electricity_array[i]);
                        var gas_product = angular.copy(gas_array[j]);
                        elec_product.id = parseInt('' + couple_counter),
                            gas_product.id = parseInt('' + couple_counter);
                        // Make comb object
                        var combination = {};
                        combination.saving = saving;
                        combination.electricity_product = elec_product;
                        combination.gas_product = gas_product;
                        combinations_array.push(combination);
                        couple_counter += 1;
                    }
                }
            }
            // Sort
            var combinations_sorted_array = combinations_array.sort(function(a,b){
                return b.saving - a.saving;
            });
            // Set arrays
            gas_array = []; electricity_array = [];
            for(var k = 0; k < combinations_sorted_array.length;k++){
                gas_array.push(combinations_sorted_array[k].gas_product);
                electricity_array.push(combinations_sorted_array[k].electricity_product);
            }
            $scope.gas_products = gas_array;
            $scope.electricity_products = electricity_array;
            setActiveFirst($scope.electricity_products,$scope.gas_products);
        }
    };

    // Set 1st
    var setActiveFirst = function(electricity_array,gas_array){
        $scope.active_electricity = electricity_array[0];
        $scope.active_gas = gas_array[0];
    };

});

app.controller('detailModalController', function($scope,$modalInstance,your_product,best_product,title){
    $scope.your_product = your_product;
    $scope.best_product = best_product;
    $scope.title = title;
    $scope.input= {};
    if ( title == "Elektriciteit")
        {
       $scope.input.kVAField=parseFloat(your_product.prosumer_cost._units);
       $scope.count = $scope.input.kVAField;
    }

    $scope.change = function(){
        $scope.count = $scope.input.kVAField;
    };

    $scope.openSection = function(section){
        $('.' + section).slideToggle();
    };

    $scope.cancel = function(){
        $modalInstance.dismiss('No changes');
    };
});

// Prototypes
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
*/