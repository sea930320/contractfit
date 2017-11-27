// jQuery Code
var menu = false,
    columnHeight = 480,
    positionColumns = function(){
	    columnHeight = 480;
	    // All
	    $('.cf-column').height('auto');
	    $("#cf-table .cf-column").each(function(index){
		    if($(this).get(0).offsetHeight > columnHeight) columnHeight = $(this).get(0).offsetHeight;
		    if((index+1) == $('.cf-column').length){
			    $('.cf-column').height((columnHeight-70) + 'px');
			    $('.cf-column.cf-middle.switch-provider').height((columnHeight+40) + 'px');
			    $('.cf-column.cf-middle.upload-invoice').height((columnHeight-30) + 'px');
			    $('.cf-column.cf-middle.personal-data').height((columnHeight-30) + 'px');
		    }
	    });
	    // Results
	    $('.result-column').height('auto');
	    $("#result-table .result-column").each(function(index){
		    if($(window).innerWidth() > 640){
			    if($(this).get(0).offsetHeight > columnHeight) columnHeight = $(this).get(0).offsetHeight;
			    if((index+1) == $('.result-column').length){
				    $('.result-column').height(columnHeight + 'px');
				    $('.result-column#column-middle').height((columnHeight+40) + 'px');
			    }
		    }
	    });
    }

function fixMobileSize() {
  if($(window).width() > 767) {
    $(".makesmalleronmobile").addClass('button-large');
    $(".makesmalleronmobile").removeClass('button-medium');
    $(".makesmalleronmobile").removeClass('button-small');
  } else if ($(window).width() > 500) {
    $(".makesmalleronmobile").addClass('button-medium');
    $(".makesmalleronmobile").removeClass('button-large');
    $(".makesmalleronmobile").removeClass('button-small');
  } else {
    $(".makesmalleronmobile").addClass('button-small');
    $(".makesmalleronmobile").removeClass('button-large');
    $(".makesmalleronmobile").removeClass('button-medium');
  }
}

function showPanel(panelName) {
  var middle = $("#cf-table-left").children().first();
  var left = $("#cf-table-left").children().last();
  var right = $("#cf-table-right").children().first();
  var active = null;
  var hidden = [];
  if (panelName === "middle") {
    active = middle;
    hidden.push(left);
    hidden.push(right);
  } else if (panelName === "left") {
    active = left;
    hidden.push(middle);
    hidden.push(right);
  } else if (panelName === "right") {
    active = right;
    hidden.push(left);
    hidden.push(middle);
  }
  active.show();
  for (var hideIndex in hidden) {
    hidden[hideIndex].hide();
  }
}

$(document).ready(function(){

  $("label").each(function() {
    if ($(this).hasClass("beforeclick")) {
      $(this).click(function(event) {
        event.preventDefault();
      });

      $(this).on("mousedown touchstart", function(event) {
        event.preventDefault();
        $('#'+$(this).attr('for')).trigger('click');
      });
    }
  });


  $(window).on('resize', function() {
    fixMobileSize();
  });
  fixMobileSize();

  $(window).on('load', function() {
    if($(window).width() < 640) {
      showPanel("middle");
      var scrollElement = document.getElementById("scrollIntoView");
      if (scrollElement !== null) {
        scrollElement.scrollIntoView();
        setTimeout(function(){
          scrollElement.scrollIntoView();
        }, 1000);
      }
    }
  });

	// Tooltip
	//$('.tooltip').tooltipster();

	// Load foundation
	//$(document).foundation('reveal', 'reflow');

	positionColumns();

	if($('#account_check').length){
		$('#account_check input[type="checkbox"]').click(function(){
			positionColumns();
		});
	}

	// Mobile menu
	$('#mobile-menu').click(function(event){
		event.preventDefault();
		toggle_menu();
	});
	$(window).resize(function(){
		if(menu) toggle_menu();
		if($(window).innerWidth() > 640){
			$('#desktop-menu').show();
		} else {
			$('#desktop-menu').hide();
		}
	});

	// Feedback
	$('#feedback-submit').click(function(event){
		event.preventDefault();
		var form = this;
		$.ajax({
			url: 'feedback',
			data: $('#feedback-form').serialize(),
			type: 'POST',
			success: function(data){
				var data = JSON.parse(data);
				$('#user-feedback-output').empty();
				if(data != true){
					Object.keys(data).forEach(function(key,index){
						$('#user-feedback-output').append('<small class="error">' + data[key] + '</small>');
					});
				} else {
					$('#user-feedback-output').append('<small class="success">Bedankt voor uw feedback</small>');
				}
			},
			error: function (data){
				       console.log('error',data.responseText);
			       }
		});
	});

	// Tooltip
	//$('.tooltip').tooltipster();

	// Travel box
	var $sidebar   = $("#cf-travel-table .travel-cf-column"),
	    $window    = $(window),
	    offset     = $sidebar.offset(),
	    topPadding = 100;
	var positionTravelUpload = function(){
		if($sidebar.length && $(window).innerWidth() > 640){
			if($window.scrollTop() > (offset.top - topPadding)){
				if( ($window.scrollTop() + $sidebar.innerHeight() + 100 + 50) > (document.body.clientHeight - $('#footer').innerHeight()) ){
					$sidebar.css({
						position:'absolute',
						top:(document.body.clientHeight - $('#footer').height() - $sidebar.innerHeight() - 300),
						left:0
					});
				} else {
					$sidebar.css({
						position:'fixed',
						top:100,
						left:offset.left
					});
				}
			} else {
				$sidebar.css({
					position:'absolute',
					top:-65,
					left:0
				});
			}
		}
	}

	var headerHeight = $('#nav').height();

	var lastScrollTop = 0;
	$window.scroll(function(){
		// Update travel box
		positionTravelUpload();
		// Progress fixed
		if($(window).innerWidth() > 640){
			if ($(window).scrollTop() > headerHeight){
				$('#progress').addClass('fixed').next().show();
			} else {
				$('#progress').removeClass('fixed').next().hide();
			}
		} else {
			$('#progress').removeClass('fixed').next().hide();
		}
		// Track scroll
		var st = $(this).scrollTop();
		if($(window).innerWidth() < 640){
			$('#header').addClass('travel');
		} else {
			$('#header').removeClass('travel');
		}
		if (st > lastScrollTop){
			if($(window).scrollTop() > 153){
				$('#header').addClass('travel-up');
			} else {
				$('#header').removeClass('travel-up');
			}
		} else {
			$('#header').removeClass('travel-up');
		}
		lastScrollTop = st;
	});
	$(window).resize(function(){
		offset = $sidebar.offset();
		positionTravelUpload();
		positionColumns();
	});

	// Upload box
	var formArray = [],
	    fileUploaded = false;

	// Upload
	if($('.image-upload-wrapper').length){
		$("#upload").on('change',function(event){
      var form = document.getElementById("form");
      if (form !== null) {
        $('#myModal').modal('toggle');
        form.submit();
        return;
      }
		});
	}

	// Upload
	if($('.file-upload-wrapper').length){
		$('.file-upload-wrapper').fileupload({
			url: 'upload_invoice',
			multipart:true,
			singleFileUploads:false,
			formData: getEmail,
			add: function (e, data){
				// Text
				fileUploaded = true;
				var text = '';
				for(var i=0;i<data.files.length;i++)
			text += (i !== (data.files.length-1) ? data.files[i].name + ', ' : data.files[i].name);
		if(text.length > 32) text = (text.substring(0, 32) + '..');
		$(".file-upload-label").text(text);
		$('.file-upload-label').addClass('file');
		// Submit
		$("#upload-button").off('click').on('click', function(event){
			event.preventDefault();
			if(validateForm()){
				// Load modal
				$('#myModal').modal('toggle');
				// Data submit
				data.submit();
			}
		});
    if(validateForm()){
      // Load modal
      $('#myModal').modal('toggle');
      // Data submit
      data.submit();
    }
			},
				progress: function(e, data){
						  var progress = parseInt(data.loaded / data.total * 100, 10);
					  },
				success: function (result, textStatus, jqXHR){
						 var result = JSON.parse(result);
						 console.log(result.success);
						 if(result.success){
							 if (window.location.href.indexOf(result.success) >= 0) {
                 location.reload(true);
               } else {
                 window.location = result.success;
               }
						 }else{
							 console.log(result.error);
						 }
					 },
				error: function (jqXHR, textStatus, errorThrown) {
					       console.log('error',jqXHR.responseText);
				       }
		});
	}
	function getEmail(){
		var email_value = $('.upload-email').val();
		return { 1: {name: 'pdfInvoice', value:true}, 2: {name: 'email', value: email_value} };
	}
	// Validate
	$("#upload-button").on('click', function(event){
		event.preventDefault();
		validateForm();
	});
	$('.upload-email').keydown(function(){
		if(formArray.length) validateForm();
	});
	$('.file-upload-wrapper').change(function(){
		if(formArray.length) validateForm();
	});
	var validateForm = function(){
		// Email
		formArray = [];
		var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		var email = $('#txtMail').val();
		if(email.length == 0){
			formArray.push({'input':'upload-email','error':'Gelieve een emailadres in te vullen.'});
		} else if(!filter.test(email)){
			formArray.push({'input':'upload-email','error':'Gelieve een correct emailadres in te vullen.'});
		}
		// Files
		if(!fileUploaded){
			formArray.push({'input':'file-upload-label','error':'Gelieve een pdf te selecteren.'});
		}
		// Show
		$('.upload-email').removeClass('error');
		$('.file-upload-label').removeClass('error');
		$('#upload-form-feedback').empty();
		if(formArray){
			for(var key in formArray){
				// $('#upload-form-feedback').append('<small class="error">' + formArray[key]['error'] + '</div>');
				$('.' + formArray[key]['input']).addClass('error');
			};
		}
		// Return
		return (formArray.length == 0 ? true : false );
	}

	// Sticky footer
	var footerHeight = 0,
	    footerTop = 0,
	    $footer = $("#footer");
	function positionFooter(){
		footerHeight = $footer.height();
		footerTop = ($(window).scrollTop()+$(window).height()-footerHeight)+"px";
		contentHeight = $('#nav').innerHeight() + ($('#wrapper').innerHeight() - $('#header-dummy').innerHeight() - 500);
		if((contentHeight+footerHeight) < $(window).height()){
			$footer.css({
				position: "absolute",
				top: footerTop
			});
		} else {
			$footer.css({
				position: "static"
			});
		}
	}
	// positionFooter();
	// $(window).resize(positionFooter); // .scroll(positionFooter)

	// Share
	$('.ion-social-twitter.share').click(function(event){
		event.preventDefault();
		window.open('http://twitter.com/share?url=' + $(this).data('link') + '&text=' + $(this).data('text') + '&', 'twitterwindow', 'height=450, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
	});

	$('.ion-social-facebook.share').click(function(event){
		event.preventDefault();
		FB.ui({
			method: 'feed',
			name: $(this).data('name'),
			link: $(this).data('link'),
			picture: $(this).data('image'),
			description: $(this).data('text')
		},
		function(response){});
	});

	// Toggle static
	$('.faq .answers .answer b').click(function(){
		$(this).next().toggle();
	});

	$('.terms .section h2').click(function(){
		$(this).next().toggle();
	})
});

function toggle_menu(){
	menu = !menu;
	$('#desktop-menu').slideToggle('fast');
}












// Angularjs
var app = angular.module('app', ['mm.foundation','gettext']);

app.controller('optionsController', function($scope,$modal){

  $scope.yourSavings = function() {
    if ($scope.fully_loaded) {
      var total = 0;
      if ($scope.active_electricity) {
        total += $scope.active_electricity.your_product_delta;
      }
      if ($scope.active_gas) {
        total += $scope.active_gas.your_product_delta;
      }
      if ($scope.options.domicieleringOptional && $scope.options.currentPromotionsValue) {
        if ($scope.active_electricity && $scope.active_gas && $scope.active_electricity.provider == $scope.active_gas.provider) {
          total += $scope.active_gas.dom_saving;
        } else {
          if ($scope.active_electricity) {
            total += $scope.active_electricity.dom_saving;
          }
          if ($scope.active_gas) {
            total += $scope.active_gas.dom_saving;
          }
        }
      }
      if ($scope.active_electricity && $scope.active_gas) {
        if ($scope.active_electricity.korting_dualfuel_in_EUR && $scope.options.domicieleringOptional && $scope.active_electricity.provider == $scope.active_gas.provider && $scope.active_electricity.product == $scope.active_gas.product) {
          total += $scope.active_electricity.korting_dualfuel_in_EUR.value*1.0;
        }
      }
      return total;
    } else {
      return 10;
    }
  }

  $scope.yourAbsoluteCost = function() {
    if ($scope.fully_loaded) {
      var total = 0;
      if ($scope.active_electricity) {
        total += $scope.active_electricity.absolute_cost;
      }
      if ($scope.active_gas) {
        total += $scope.active_gas.absolute_cost;
      }
      if ($scope.options.domicieleringOptional && $scope.options.currentPromotionsValue) {
        if ($scope.active_electricity && $scope.active_gas && $scope.active_electricity.provider == $scope.active_gas.provider) {
          total += $scope.active_gas.dom_saving;
        } else {
          if ($scope.active_electricity) {
            total += $scope.active_electricity.dom_saving;
          }
          if ($scope.active_gas) {
            total += $scope.active_gas.dom_saving;
          }
        }
      }
      if ($scope.active_electricity && $scope.active_gas) {
        if ($scope.active_electricity.korting_dualfuel_in_EUR && $scope.options.domicieleringOptional && $scope.active_electricity.provider == $scope.active_gas.provider && $scope.active_electricity.product == $scope.active_gas.product) {
          total -= $scope.active_electricity.korting_dualfuel_in_EUR.value*1.0;
        }
      }
      return total;
    } else {
      return 10;
    }
  }

	$scope.toggleSavings = function(year){
		$('#savings-' + year +  '-year').children().slice(1).toggle();
		positionColumns();
	};

    $scope.openSection = function(section){
	    $('.' + section).slideToggle();
    }   ;

	// Detail modals
	$scope.openElectricityModal = function(offer){
		$scope.your_product = $scope.your_electricity;
		$scope.best_product = offer;
		$scope.title='';
		$scope.markup_green=$scope.options.greenPercentageValue;
		value = parseFloat($scope.user.el.kVA.replace(",","."));
		if (value)
	        $scope.count = value;
	    else
	        $scope.count = 0;
		$("#detailModal").modal("toggle");
	}

	$scope.openGasModal = function(offer){
		$scope.your_product = $scope.your_gas;
		$scope.best_product = offer;
		$scope.title='';
		$scope.markup_green=false;
	    $scope.count = 0;
		$("#detailModal").modal("toggle");
	}

	// Info modal
	var xhttpInfo = new XMLHttpRequest();
	xhttpInfo.onreadystatechange = function(){
		if (xhttpInfo.readyState == 4 && xhttpInfo.status == 200){
			// Parse Xml
			var xmlTextInfo = new XMLSerializer().serializeToString(xhttpInfo.responseXML),
			    x2jsInfo = new X2JS(),
			    jsonObjInfo = x2jsInfo.xml_str2json(xmlTextInfo);
			$scope.xmlContent1 = jsonObjInfo;
			$scope.productinfo = jsonObjInfo;
			$scope.$apply();
		}
	};

	$scope.openProductInfo = function(product){
		var k;  // iterator for loops
		var i;  // product id (elek or gas)
		var e;  // flag whether elek (true) or gas (false)

		// find right node in xml product info tree for elek
		for (k = 0; k < $scope.productinfo.root.electricity.product.length; ++k) {
		    if ($scope.productinfo.root.electricity.product[k]._pid == product.pid){
			     i=k;
			     e=true;
		    }
		}

		// find right node in xml product info tree for gas
		for (k = 0; k < $scope.productinfo.root.gas.product.length; ++k) {
		    if ($scope.productinfo.root.gas.product[k]._pid == product.pid){
			     i=k;
			     e=false;
		    }
		}

		if (e==true) {$scope.product = $scope.productinfo.root.electricity.product[i];} else {$scope.product = $scope.productinfo.root.gas.product[i];}
		$("#infoModal").modal("toggle");
	};

	// Options
	$scope.original_gas_products = [];
	$scope.gas_products = [];
	$scope.original_electricity_products = [];
	$scope.electricity_products = [];

	var setOptions = function(){

		$scope.savings = {value:'first'};

		$scope.options = {
			differentProvidersValue: true,
			domicieleringOptional: true,
			vregIndicatorMinScoreValue: true,
			fixedRateValue: true,
			variabelRateValue: true,
			payInAdvanceValue: false,
			greenPercentageValue: false,
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
			var jsonObj = JSON.parse(xhttp.responseText);
			$scope.xmlContent = jsonObj;

			// Set your products
			if(jsonObj.offers_gas)
				$scope.your_gas = jsonObj.offers_gas.your_product;
			if(jsonObj.offers_electricity)
				$scope.your_electricity = jsonObj.offers_electricity.your_product;

      if(jsonObj.manual)
        $scope.manual = jsonObj.manual.toLowerCase() == "true";
      else {
        $scope.manual = false;
      }
			$scope.absolute = ($scope.your_gas || $scope.your_electricity)? false:true;

			// Set origial arrays
			if(jsonObj.offers_gas)
				$scope.original_gas_products = $scope.gas_products = jsonObj.offers_gas.product;
			if(jsonObj.offers_electricity)
				$scope.original_electricity_products = $scope.electricity_products = jsonObj.offers_electricity.product;
			if($scope.gas_products.length > 0)
				$scope.original_gas_products = $scope.gas_products = $scope.gas_products;
			if($scope.electricity_products.length > 0)
				$scope.original_electricity_products = $scope.electricity_products = $scope.electricity_products;

			$scope.email = jsonObj.person.email;

			$scope.user = {};
			$scope.user.gas = {};
			$scope.user.el = {};
			if(jsonObj.user_type != undefined)
				$scope.user.user_type = jsonObj.user_type;
			if(jsonObj.delivery_address != undefined)
				$scope.user.delivery_address = jsonObj.delivery_address;
			if(jsonObj.gas != undefined)
				$scope.user.gas = jsonObj.gas;
			if(jsonObj.el != undefined)
			{
				$scope.user.el = jsonObj.el;
			    if(jsonObj.el.kVA == undefined)
			    	$scope.user.el.kVA = "0";
			}
			$scope.updateResults();
      $scope.fully_loaded = true;
			$scope.$apply();
			positionColumns();
		}
	};

	angular.element(document).ready(function(){
		if(optionsJSON){
			// Choice
			xhttp.open("GET", optionsJSON , true);
			xhttp.send();

			// Product list
			xhttpInfo.open("GET", infoXML , true);
			xhttpInfo.send();
		}
	});

	// Catch click
	$scope.changeElectricity = function(action,call){
		var position = $scope.electricity_products.indexOf($scope.active_electricity);
		if(action == 'next') var index = ((position+1) > ($scope.electricity_products.length - 1) ? 0 : position + 1 );
		if(action == 'prev') var index = ((position-1) < 0 ? ($scope.electricity_products.length -1) : position - 1 );
    $scope.active_electricity = $scope.electricity_products[index];
    $scope.active_electricity_index = index;
		if(!$scope.options.differentProvidersValue && call == 'click') $scope.changeGas(action);
	};
	$scope.changeGas = function(action,call){
		var position = $scope.gas_products.indexOf($scope.active_gas);
		if(action == 'next') var index = ((position+1) > ($scope.gas_products.length - 1) ? 0 : position + 1 );
		if(action == 'prev') var index = ((position-1) < 0 ? ($scope.gas_products.length -1) : position - 1 );
    $scope.active_gas = $scope.gas_products[index];
    $scope.active_gas_index = index;
		if(!$scope.options.differentProvidersValue && call == 'click') $scope.changeElectricity(action);
	};
	$scope.setElectricity = function(index,call){
    $scope.$apply(function() {
      $scope.active_electricity_index = index;
      $scope.active_electricity = $scope.electricity_products[index];
    });
		if(!$scope.options.differentProvidersValue && call == 'click') {
      $scope.setGas(index);
    }
	};
	$scope.setGas = function(index,call){
    $scope.$apply(function() {
      $scope.active_gas_index = index;
      $scope.active_gas = $scope.gas_products[index];
    });
		if(!$scope.options.differentProvidersValue && call == 'click'){
      $scope.setElectricity(index);
    }
	};
  $scope.doSomeAccordionStuff = function (){
    var $accordionEl = $('.accordion');
    if( $accordionEl.length > 0 ){
      $accordionEl.each( function(){
        var element = $(this),
        elementState = element.attr('data-state'),
        // accordionActive = 50;
        accordionActive = element.attr('data-active');

        if( !accordionActive ) { accordionActive = 0; } else { accordionActive = accordionActive - 1; }

        element.find('.acc_content').hide();
        element.find('.accordionrow').hide();

        if( elementState != 'closed' ) {
          element.find('.acctitle:eq('+ Number(accordionActive) +')').addClass('acctitlec').next().show();
          var middle = Math.max(Number(accordionActive), 1);
          element.find('.accordionrow:eq('+ middle +')').show();
          element.find('.accordionrow:eq('+ middle +')').next().show();
          element.find('.accordionrow:eq('+ middle +')').prev().show();
        }

        element.find('.acctitle').click(function(){
          if( $(this).next().is(':hidden') ) {
            element.find('.acctitle').removeClass('acctitlec').next().slideUp("fast");
            $(this).toggleClass('acctitlec').next().slideDown("fast");
            var childrens = $(this).parent().parent().children();
            var index = childrens.index($(this).parent());
            if (index <= childrens.length - 2) {
              $(this).parent().prev().prev().slideUp("normal");
            }
            $(this).parent().prev().slideDown("normal");
            $(this).parent().next().slideDown("normal");
            if (index > 0) {
              $(this).parent().next().next().slideUp("normal");
            }
            if (element.hasClass("accordion-electricity")) {
              $scope.setElectricity(index);
            } else {
              $scope.setGas(index);
            }
          }
          return false;
        });
      });
    }
  }

	var updateArrays = function(section,obj){
		// Domiciliering
		var domicielering = ($scope.options.domicieleringOptional ? true : (obj.domiciliering_required == 'True' ? false : true ));
		// Min-score
		var min_score_value = ($scope.options.vregIndicatorMinScoreValue ? (obj.service_level == 5 ? true : false) : true);
		// Fixed/Var
		if($scope.options.fixedRateValue == true && obj.rate_type == 'Vast'){
			rate_value = true;
		} else if($scope.options.variabelRateValue == true && obj.rate_type == 'Variabel'){
			rate_value = true;
		} else {
			rate_value = false;
		};
		// Pay in Advance
		var pay_in_advance = ($scope.options.payInAdvanceValue ? true : (obj.upfront_payment_required == 'False' ? true : false));
		// Pay in Advance
		var green_percentage = (section == 'electricity' ? ($scope.options.greenPercentageValue ? (parseInt(obj.green_level) < 100 ? false : true): true) : true);
		// Contract duration
		if($scope.options.undefinedContractValue == true){ // && obj.duration == '/'
			contract_duration = true;
		} else if($scope.options.twoYearContractValue == true && (obj.duration == '2' || obj.duration =='\\')){
			contract_duration = true;
		} else if($scope.options.oneYearContractValue == true && (obj.duration == '1' || obj.duration =='\\')){
			contract_duration = true;
		} else if($scope.options.threeYearContractValue == true && (obj.duration == '3' || obj.duration =='\\')){
			contract_duration = true;
		} else if($scope.options.fiveYearContractValue == true && obj.duration == '5'){
			contract_duration = true;
		} else {
			contract_duration = false;
		}
		// Paper invoice
		var digital_invoice = ($scope.options.digitalInvoiceValue ? true : (obj.only_digital_invoice == 'True' ? false : true ));
		// Contract-fit change
		var contract_fit_change = ($scope.options.contractFitChangeValue ? (obj.one_click_change == 'True' ? true : false ) : true );
		// Return
		return (min_score_value && domicielering && rate_value && pay_in_advance && green_percentage && contract_fit_change && digital_invoice && contract_duration);
	}

	// Sort
	$scope.sortResults = function(electricity_array,gas_array){
		// Gas
		if($scope.original_gas_products.length > 1)
			$scope.gas_products = gas_array.sort(function(a,b){
			    return a.absolute_cost - b.absolute_cost;
				//var delta_a  = a.your_product_delta;
				//var delta_b  = b.your_product_delta;
				//return delta_b - delta_a;
			});
		// Electricity
		if($scope.original_electricity_products.length > 1)
			$scope.electricity_products = electricity_array.sort(function(a,b){
			    return a.absolute_cost - b.absolute_cost;
				//var delta_a  = a.your_product_delta;
				//var delta_b  = b.your_product_delta;
				//return delta_b - delta_a;
			});
		// Set active item (item)
		setActiveFirst($scope.electricity_products,$scope.gas_products);
	};

	$scope.showChangeBtn = function(){
		if($scope.active_electricty && $scope.active_gas)
			if($scope.active_electricty.one_click_change == 'True' && $scope.active_electricty.one_click_change == 'True')
				return true;
		return false;
	};

	$scope.updateResults = function(){
		// Extra costs
		if($scope.options.currentPromotionsValue == false)
			cost_property = 'total_cost_no_discount';
		/*else if($scope.options.domicieleringOptional == false && $scope.options.digitalInvoiceValue == false){
			cost_property = 'total_cost_no_dom_digital';
		}else if($scope.options.domicieleringOptional == true && $scope.options.digitalInvoiceValue == false){
			cost_property = 'total_cost_no_digital';
		} */
		else if($scope.options.domicieleringOptional == false/* && $scope.options.digitalInvoiceValue == true*/)
			cost_property = 'total_cost_no_dom';
		else
			var cost_property = 'total_cost';


		// Add difference your_property
		if($scope.original_gas_products.length > 0)
			$scope.original_gas_products.map(function(obj,index){
				obj.id = index;
				obj.absolute_cost = parseFloat(obj[cost_property].value);
				if ($scope.your_gas)
				{
				    obj.your_product_delta = $scope.your_gas.total_cost.value - obj[cost_property].value;
				    obj.y1_product_delta = $scope.your_gas.total_cost.value - obj['total_cost'].value;
				    obj.y2_product_delta = $scope.your_gas.total_cost.value - obj['total_cost_no_discount'].value;
				}
				obj.dom_saving = 0;
				if (obj["korting_in_EUR_dom"] != null)
				obj.dom_saving = parseFloat(obj["korting_in_EUR_dom"]);
				obj.absolute_cost -= parseFloat(obj.dom_saving);
			});
		if($scope.original_electricity_products.length > 0)
			$scope.original_electricity_products.map(function(obj,index){
				obj.id = index;
				obj.absolute_cost = parseFloat(obj[cost_property].value);

				value = parseFloat($scope.user.el.kVA.replace(",","."));
				if (! value)
				    value = 0;

				obj.absolute_cost -= parseFloat(obj["prosumer_cost"]["units"]) * parseFloat(obj["prosumer_cost"]["unit_cost"]);
				obj.absolute_cost += value * parseFloat(obj["prosumer_cost"]["unit_cost"]);

				if($scope.your_electricity)
				{
				    obj.your_product_delta = $scope.your_electricity.total_cost.value - obj[cost_property].value;
			        obj.y1_product_delta = $scope.your_electricity.total_cost.value - obj['total_cost'].value;
			        obj.y2_product_delta = $scope.your_electricity.total_cost.value - obj['total_cost_no_discount'].value;
				}
				if($scope.options.greenPercentageValue == true && 'markup_green' in obj)
			    {
			        if(typeof(obj['markup_green'])!="number")
			        {
				        obj.markup_green = parseFloat(obj['markup_green']);
			        }
			        obj.absolute_cost += obj.markup_green;
			        if (obj.your_product_delta)
				        obj.your_product_delta -= obj.markup_green;
			    }
			    obj.dom_saving = 0;
			    if (obj["korting_in_EUR_dom"] != null)
				    obj.dom_saving = parseFloat(obj["korting_in_EUR_dom"]);

				obj.absolute_cost -= obj.dom_saving;

			    obj.dualfuel = 0;
			    if (obj["korting_dualfuel_in_EUR"] != null)
				    obj.dualfuel = parseFloat(obj["korting_dualfuel_in_EUR"].value);


				<!-- added for dual fuel -->
			    <!-- if (obj["korting_dualfuel_in_EUR"] != null) -->
				<!--    obj.korting_dualfuel_in_EUR = parseFloat(obj["korting_dualfuel_in_EUR"].value);   -->

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
					if(electricity_array[i].provider == gas_array[j].provider)
						if(electricity_array[i].supplier_id == "0.00" || electricity_array[i].product == gas_array[j].product){
						//product savings
						//var saving = electricity_array[i].your_product_delta + gas_array[j].your_product_delta;
						var absolute_cost = electricity_array[i].absolute_cost*1.0 + gas_array[j].absolute_cost*1.0;

						if(electricity_array[i].korting_dualfuel_in_EUR != null && $scope.options.domicieleringOptional == true)
						    absolute_cost-= electricity_array[i].korting_dualfuel_in_EUR.value*1.0;

						if($scope.options.domicieleringOptional == false)
						{
							//saving+=electricity_array[i].dom_saving;
							absolute_cost -= electricity_array[i].dom_saving;
						}
						// Add ids (angular dupes)
						var elec_product = angular.copy(electricity_array[i]);
						var gas_product = angular.copy(gas_array[j]);
						elec_product.id = parseInt('' + couple_counter),
							gas_product.id = parseInt('' + couple_counter);
						// Make comb object
						var combination = {};
						//combination.saving = saving;
						combination.absolute_cost = absolute_cost;
						combination.electricity_product = elec_product;
						combination.gas_product = gas_product;
						combinations_array.push(combination);
						couple_counter += 1;
					}
				}
			}
			// Sort
			var combinations_sorted_array = combinations_array.sort(function(a,b){
				return a.absolute_cost-b.absolute_cost;
				//return b.saving - a.saving;
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

	$scope.changeSavings = function(parameter){
		$scope.savings = {value:parameter.value};
		$scope.options.currentPromotionsValue = ($scope.savings.value == 'first' ? true : false);
		$scope.updateResults();
	}

	// Set 1st
	var setActiveFirst = function(electricity_array,gas_array){
		if((typeof currentGas != 'undefined' && typeof currentElectricity != 'undefined') && (currentGas != null && currentElectricity!= null)){
			var electricityIndex = _.findIndex(electricity_array, function(object) { return object.pid == currentElectricity });
			var gasIndex = _.findIndex(gas_array, function(object) { return object.pid == currentGas });
			$scope.active_electricity = electricity_array[electricityIndex];
			$scope.active_gas = gas_array[gasIndex];
      $scope.active_electricity_index = electricityIndex;
      $scope.active_gas_index = gasIndex;
			currentGas = null; currentElectricity = null;
		} else {
			$scope.active_electricity = electricity_array[0];
			$scope.active_gas = gas_array[0];
      $scope.active_electricity_index = 0;
      $scope.active_gas_index = 0;
		}
	};

});

// Prototypes
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

// Facebook
window.fbAsyncInit = function() {
	FB.init({
		appId      : '567183183464261',
		xfbml      : true,
		version    : 'v2.6'
	});
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
