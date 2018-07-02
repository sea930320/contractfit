var path = require('path');
const Contact = require('../models/contact_mdl');
const exec = require('exec');
const escapeshellarg = require('escapeshellarg');

var resRender = function(view, res, c_data) {
    res.render("static/travel_table", function(err, html) {
        c_data.travel_table = html
        //Child
        // res.render("steps/loading_overlay", function(err_1, html_1) {
        //     c_data.loading_overlay = html_1; 
            //Child
            res.render(view, c_data, function(err_2, html_2) {
                res.send(html_2);
            });
        // });
    });
}

const StaticPagesController = module.exports = {
    new_home: function(req, res) {
        var c_data  = {};
        var sess = req.session;
        //Master
        c_data.page_title = gt.gettext('Verander van energieleverancier in 60 seconden');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['legacy','bootstrap','style','dark','font-icons','animate','magnific-popup','components/bs-filestyle','responsive','colors'];
        c_data.scripts = [
        ];
    
        sess.show_step = 1;
        sess.directory = null;
        global.global_data['show_step'] = 1;
    
        resRender('static/new_home', res, c_data);
    },

    faq: function(req, res) {
        var c_data  = {};
        var sess = req.session;

        c_data.page_title = gt.gettext('Veelgestelde vragen');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster'];
        c_data.scripts = [
        ];

        sess.show_step = 1;
        resRender('static/faq', res, c_data);
    },

    id_reader: function(req, res) {
        var fs = require('fs');
        var c_data  = {};
        var sess = req.session;

        c_data.page_title = gt.gettext('Verander van energieleverancier in 60s');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['legacy','bootstrap','style','dark','font-icons','animate','magnific-popup','components/bs-filestyle','responsive','colors'];
        c_data.scripts = [
        ];

        sess.show_step = 1;
        global.global_data['show_step'] = 1;
        
        var segment = helpers.trim(res.locals.path,'/').split('/');
        var position = helpers.in_array(segment[0], ["en","fr","nl"])?2:1;

        c_data.segment = segment;
        c_data.position = position;
        c_data.jsonResponse = null;

        if (segment[position]) {
            c_data.extension = "/" + segment[position];
            if (segment[position+1]) {
                if(segment[position+1]=="1"){
                    c_data.image = "id_back.jpg";
                    c_data.extension = "/" + segment[position] + "/1";
                }
                else {
                    // json_response = json_decode(file_get_contents(__basedir + dir_conf.output_dir + segment[position] + '/input.json'), True);
                    return fs.readFile(path.join(__basedir, dir_conf.output_dir, segment[position], 'input.json'), 'binary', function(err,data) {
                        if (err) 
                            return res.json({
                                message:"error"
                            });
                        else {
                            c_data.json_response = JSON.parse(data);
                            resRender('static/id_reader', res, c_data);
                        }
                    });
                    
                }
            }
        } else {
            c_data.extension = "";
            c_data.image="id_front.jpg";
        }

        resRender('static/id_reader', res, c_data);
    },

    get_contact: function(req, res) {
        var c_data  = {};
        var sess = req.session;
        //Master
        c_data.page_title = gt.gettext('Contact');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster'];
        c_data.scripts = [
        ];
        
        sess.show_step = sess.last_step;
        
        resRender('static/contact', res, c_data);
    },

    post_contact: function(req, res) {
        var c_data  = {};
        var sess = req.session;
        //Master
        c_data.page_title = gt.gettext('Contact');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster'];
        c_data.scripts = [
        ];
    
        var required_msg = gt.gettext('Gelieve het %s-veld correct in te vullen.');
        req.checkBody('name', vsprintf(required_msg, gt.gettext('naam'))).notEmpty();
        req.checkBody('email', vsprintf(required_msg, gt.gettext('email'))).notEmpty();
        req.checkBody('email', gt.gettext('Gelieve een correct emailadres op te geven')).isEmail();
        req.checkBody('message', vsprintf(required_msg, gt.gettext('message'))).notEmpty();
        //Trim and escape the fields.
        req.sanitizeBody('name').escape();
        req.sanitizeBody('name').trim();
        req.sanitizeBody('email').escape();
        req.sanitizeBody('email').trim();
        req.sanitizeBody('message').escape();
        req.sanitizeBody('message').trim();
        
        var errors = req.validationErrors();
        if (errors) {
            c_data.feedback = errors;
        } else {
            let newContact = new Contact({
                name: req.body.name,
                email: req.body.email,
                message: req.body.message
            });

            return newContact.save((err, contact) => {
                if (err) {
                    c_data.feedback = [{
                        'param': 'error',
                        'msg': 'Oops, something went wrong. Try Again'
                    }];
                    resRender('static/contact', res, c_data);
                } else {
                    c_data.feedback = [{
                        'success': 'success',
                        'param': 'success',
                        'msg': gt.gettext('Uw bericht werd verstuurd')
                    }];
                    res.mailer.send('email_templates/contact', {
                        to: 'sky930320@gmail.com',
                        subject: 'Bericht ontvangen van ' + req.body.email + ' (' + req.body.name + ')',
                        message: req.body.message.split("\n").join("<br>")
                    }, function(err, message) {
                        if (err) {
                            c_data.feedback = [{
                                'param': 'error',
                                'msg': 'Oops, something went wrong. Try Again2'
                            }];
                        }
                        resRender('static/contact', res, c_data);
                    });
                }
            });
        }

        resRender('static/contact', res, c_data);
    },

    terms_and_conditions: function(req, res) {
        var c_data  = {};
        var sess = req.session;
        //Master
        c_data.page_title = gt.gettext('Gebruikersvoorwaarden');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster'];
        c_data.scripts = [
        ];
    
        sess.show_step = sess.last_step;
        sess.directory = null;
        global.global_data['show_step'] = 1;
    
        resRender('static/terms_and_conditions', res, c_data);
    },

    sorry: function(req, res) {
        var c_data  = {};
        var sess = req.session;

        //Master
        c_data.page_title = gt.gettext('Sorry');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster'];
        c_data.scripts = [
        ];
        res.render('static/sorry', c_data, function(err, html) {
            res.send(html);
        });
    },

    get_manual: function(req, res) {
        var c_data  = {};
        var sess = req.session;
        //Master
        c_data.page_title = gt.gettext('Manuele invoer');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster', 'jquery.steps'];
        c_data.scripts = [
            'jquery.steps.js'
        ];
        
        sess.gas_product_id = null;
        sess.electricity_product_id = null;
        
        sess.directory = "";
        sess.email = "";
        sess.last_step = 1;
        sess.manual = true;
        sess.show_step = sess.last_step;
    
        resRender('static/manual', res, c_data);
    },

    post_manual: function(req, res) {
        var c_data  = {};
        var sess = req.session;
        //Master
        c_data.page_title = gt.gettext('Manuele invoer');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster', 'jquery.steps'];
        c_data.scripts = [
            'jquery.steps.js'
        ];
        
        sess.gas_product_id = null;
        sess.electricity_product_id = null;
        
        sess.directory = "";
        sess.email = "";
        sess.show_step = 1;
        sess.last_step = 1;

        {
            var required_msg = gt.gettext('Gelieve het %s-veld correct in te vullen.');
            req.checkBody('email', vsprintf(required_msg, gt.gettext('email'))).notEmpty();
            req.checkBody('email', gt.gettext('Gelieve een correct emailadres op te geven')).isEmail();
            req.checkBody('client_type', vsprintf(required_msg, gt.gettext('type klant'))).notEmpty();
            req.checkBody('client_type', gt.gettext('type klant')).isAlphanumeric();
            req.checkBody('scenario', vsprintf(required_msg, gt.gettext('scenario'))).notEmpty();
            req.checkBody('scenario', gt.gettext('scenario')).isAlphanumeric();
            req.checkBody('zip_code', vsprintf(required_msg, gt.gettext('postcode'))).notEmpty();
            req.checkBody('zip_code', gt.gettext('postcode')).isNumeric();
            req.checkBody('zip_code', gt.gettext('Gelieve een geldige postcode in te vullen.')).isZipCode();
            req.checkBody('has_electricity', gt.gettext('elektriciteit')).optional({ checkFalsy: true }).isAlphanumeric();
            req.checkBody('cost_el', gt.gettext('Bedrag niet herkend')).optional({ checkFalsy: true }).isAmount();
            req.checkBody('el_day', gt.gettext('verbruik elektriciteit dag')).optional({ checkFalsy: true }).isNumeric();
            req.checkBody('el_day', vsprintf(gt.gettext('Het veld %s moet lager zijn dan 50000'),[gt.gettext('verbruik elektriciteit dag')])).optional({ checkFalsy: true }).below_el();
            req.checkBody('el_incl', gt.gettext('elektriciteit incl. BTW')).optional({ checkFalsy: true }).isAlphanumeric();
            req.checkBody('gas_incl', gt.gettext('gas incl. BTW')).optional({ checkFalsy: true }).isAlphanumeric();
            req.checkBody('cost_gas', gt.gettext('Bedrag niet herkend')).optional({ checkFalsy: true }).isAmount();
            req.checkBody('gas_consumption', gt.gettext('verbruik gas')).optional({ checkFalsy: true }).isNumeric();
            req.checkBody('gas_consumption', gt.gettext('verbruik gas')).optional({ checkFalsy: true }).below_gas();
            req.checkBody('excl_night', gt.gettext('exclusief nacht meter')).optional({ checkFalsy: true }).isAlphanumeric();
            req.checkBody('prosumer', gt.gettext('eigen productie elektriciteit')).optional({ checkFalsy: true }).isAlphanumeric();
            req.checkBody('inhabitants', gt.gettext('aantal inwoners')).optional({ checkFalsy: true }).isNumeric();
            req.checkBody('house_type', gt.gettext('type huis')).optional({ checkFalsy: true }).isAlphanumeric();
            req.checkBody('heating_type', gt.gettext('type verwarming')).optional({ checkFalsy: true }).isAlphanumeric();
            req.checkBody('insulation_type', gt.gettext('type isolatie')).optional({ checkFalsy: true }).isAlphanumeric();
            req.checkBody('el_night', vsprintf(gt.gettext('Het veld %s moet lager zijn dan 50000'),[gt.gettext('verbruik elektriciteit nacht')])).optional({ checkFalsy: true }).below_el();
            req.checkBody('el_excl_night', vsprintf(gt.gettext('Het veld %s moet lager zijn dan 50000'),[gt.gettext('verbruik elektriciteit exclusief nacht')])).optional({ checkFalsy: true }).below_el();
            req.checkBody('kVA', gt.gettext('Bedrag niet herkend')).optional({ checkFalsy: true }).isAmount();

            //Trim and escape the fields.
            var param_names = ['email', 'client_type', 'scenario', 'zip_code', 'has_electricity', 'has_gas', 'meter_type', 'cost_el', 'el_day', 'el_incl', 'gas_incl', 'cost_gas', 'gas_consumption', 'excl_night', 'prosumer', 'inhabitants', 'house_type', 'heating_type', 'insulation_type', 'el_night', 'el_excl_night', 'kVA'];
            param_names.forEach(function(param_name) {
                req.sanitizeBody(param_name).escape();
                req.sanitizeBody(param_name).trim();
            });

            if (req.body.has_electricity) {
                req.checkBody('meter_type', gt.gettext('meter type elektriciteit')).notEmpty();
                req.checkBody('meter_type', gt.gettext('meter type elektriciteit')).isAlphanumeric();
                if ("monthly" == req.body.scenario) {
                    req.checkBody('cost_el', gt.gettext('kost elektriciteit')).notEmpty();
                    req.checkBody('cost_el', gt.gettext('Bedrag niet herkend')).isAmount();
                } else if ("yearly" == req.body.scenario) {
                    req.checkBody('el_day', gt.gettext('verbruik elektriciteit dag')).notEmpty();
                    req.checkBody('el_day', gt.gettext('verbruik elektriciteit dag')).isNumeric();
                    req.checkBody('el_day', vsprintf(gt.gettext('Het veld %s moet lager zijn dan 50000'),[gt.gettext('verbruik elektriciteit dag')])).below_el();
                }
                if(req.body.meter_type && req.body.meter_type=="double" && req.body.scenario=="yearly") {
                    req.checkBody('el_night', gt.gettext('verbruik elektriciteit nacht')).notEmpty();
                    req.checkBody('el_night', gt.gettext('verbruik elektriciteit nacht')).isNumeric();
                    req.checkBody('el_night', vsprintf(gt.gettext('Het veld %s moet lager zijn dan 50000'),[gt.gettext('verbruik elektriciteit nacht')])).below_el();
                }
                if(req.body.excl_night && req.body.scenario =="yearly") {
                    req.checkBody('el_excl_night', gt.gettext('verbruik elektriciteit exclusief nacht')).notEmpty();
                    req.checkBody('el_excl_night', gt.gettext('verbruik elektriciteit exclusief nacht')).isNumeric();
                    req.checkBody('el_excl_night', vsprintf(gt.gettext('Het veld %s moet lager zijn dan 50000'),[gt.gettext('verbruik elektriciteit exclusief nacht')])).below_el();
                }
                if(req.body.prosumer) {
                    req.checkBody('kVA', gt.gettext('kVA')).notEmpty();
                    req.checkBody('kVA', gt.gettext('Bedrag niet herkend')).isAmount();
                    req.sanitizeBody('kVA').escape();
                    req.sanitizeBody('kVA').trim();
                }
            } else {
                req.checkBody('has_gas', gt.gettext('gas of elektriciteit')).notEmpty();
                req.checkBody('has_gas', gt.gettext('gas of elektriciteit')).isAlphanumeric();
                req.sanitizeBody('has_gas').escape();
                req.sanitizeBody('has_gas').trim();
            }

            if (req.body.has_gas) {
                req.checkBody('has_gas', gt.gettext('gas')).optional({ checkFalsy: true }).isAlphanumeric();
		        if(req.body.scenario == "monthly") {
                    req.checkBody('cost_gas', gt.gettext('kost gas')).notEmpty();
                    req.checkBody('cost_gas', gt.gettext('Bedrag niet herkend')).isAmount();
                }
		        if(req.body.scenario =="yearly") {
                    req.checkBody('gas_consumption', gt.gettext('verbruik gas')).notEmpty();
                    req.checkBody('gas_consumption', gt.gettext('verbruik gas')).isNumeric();
                    req.checkBody('gas_consumption', gt.gettext('verbruik gas')).below_gas();
                }
		    }
		    if (req.body.scenario == 'profile') {
                req.checkBody('inhabitants', gt.gettext('aantal inwoners')).notEmpty();
                req.checkBody('inhabitants', gt.gettext('aantal inwoners')).isNumeric();

                req.checkBody('house_type', gt.gettext('type huis')).notEmpty();
                req.checkBody('house_type', gt.gettext('type huis')).isAlphanumeric();
                req.sanitizeBody('house_type').escape();
                req.sanitizeBody('house_type').trim();

                req.checkBody('heating_type', gt.gettext('type huis')).notEmpty();
                req.checkBody('heating_type', gt.gettext('type huis')).isAlphanumeric();
                req.sanitizeBody('heating_type').escape();
                req.sanitizeBody('heating_type').trim();
                
                req.checkBody('insulation_type', gt.gettext('type huis')).notEmpty();
                req.checkBody('insulation_type', gt.gettext('type huis')).isAlphanumeric();
                req.sanitizeBody('insulation_type').escape();
                req.sanitizeBody('insulation_type').trim();
		    }
			if (req.body.scenario == "monthly") {
			    if (req.body.has_electricity == "True") {
                    req.checkBody('el_supplier', gt.gettext('leverancier elektriciteit')).notEmpty();
                    req.checkBody('el_supplier', gt.gettext('leverancier elektriciteit')).isAlphanumeric();
                    req.sanitizeBody('el_supplier').escape();
                    req.sanitizeBody('el_supplier').trim();
                    req.sanitizeBody('el_supplier').clean_name();
                    req.sanitizeBody('el_supplier').valid_supplier_product();
                    req.checkBody('el_product', gt.gettext('product elektriciteit')).notEmpty();
                    req.sanitizeBody('el_product').escape();
                    req.sanitizeBody('el_product').trim();
                    req.sanitizeBody('el_product').clean_name();
                    req.sanitizeBody('el_product').valid_supplier_product();
			    }
			    if(req.body.has_gas =="True") {
                    req.checkBody('gas_supplier', gt.gettext('leverancier gas')).notEmpty();
                    req.sanitizeBody('gas_supplier').escape();
                    req.sanitizeBody('gas_supplier').trim();
                    req.sanitizeBody('gas_supplier').clean_name();
                    req.sanitizeBody('gas_supplier').valid_supplier_product();
                    req.checkBody('gas_product', gt.gettext('product_gas')).notEmpty();
                    req.sanitizeBody('gas_product').escape();
                    req.sanitizeBody('gas_product').trim();
                    req.sanitizeBody('gas_product').clean_name();
                    req.sanitizeBody('gas_product').valid_supplier_product();
			    }
			}

            var errors = req.validationErrors();
            if (errors) {
                c_data.feedback = errors;
            } else {
                var obj = {
                    postal_code             : req.body.zip_code,
					delivery_address        : req.body.zip_code,
					has_electricity         : req.body.has_electricity,
					has_gas                 : req.body.has_gas,
					el                      : {
                        supplier    : req.body.el_supplier,
                        product     : req.body.el_product
                    },
					gas                     : {
                        supplier    : req.body.gas_supplier,
                        product     : req.body.gas_product
                    },
					scenario                : req.body.scenario,
					client_type             : req.body.client_type,
				};

				if(req.body.scenario=="profile") {
					obj.house_type = req.body.house_type;
					obj.inhabitants = req.body.inhabitants;
					obj.heating_type = req.body.heating_type;
					obj.insulation_type = req.body.insulation_type;

                    //consumption based on appendix B of CREG Charter
                    var gas_consumption = 0;
					if (obj.heating_type=='gas') {
					    if (obj.house_type == "studio")
					        gas_consumption = 23260;
					    else if (obj.house_type == "open")
					        gas_consumption = 34890;
					    //house_type = closed
					    else if (obj.insulation_type == 'bad')
					        gas_consumption = 34890;
					    else
					        gas_consumption = 23260;
					} else {
					    if (parseInt(obj.inhabitants) > 3 )
					        gas_consumption = 4625;
					    else
					        gas_consumption = 2326;
                    }

				    if (req.body.has_gas=="True")
					    obj.gas.consumption = helpers.strval(gas_consumption);

					if (req.body.has_electricity=="True") {
				        if (req.body.excl_night=="True") {
					        if (req.body.meter_type=="double") {
					            obj.el.day = "3600";
					            obj.el.night = "3900";
					            obj.el.excl_night = "12500";
					        } else {
					            obj.el.day = "7500";
					            obj.el.excl_night = "12500";
					        }
					    } else if (req.body.heating_type=='el') {
					        if(req.body.meter_type=="double") {
					            obj.el.day = "3600";
					            obj.el.night = "3900";
					        }
					        else {
					            obj.el.day = "7500";
					        }
					    } else {
					        var score = 0;
					        if (obj.house_type=="closed")
					            score = score + 1;
					        if (obj.house_type=="open")
					            score = score + 2;
					        if (parseInt(obj.inhabitants)>1)
					            score = score + 1;
					        if (parseInt(obj.inhabitants)>3)
					            score = score + 1;

					        if (score == 0) {
					            if(req.body.meter_type=="double") {
					                obj.el.day = "300";
					                obj.el.night = "300";
					            } else {
					                obj.el.day = "600";
					            }
					        } else if(score == 1) {
					            if(req.body.meter_type=="double") {
					                obj.el.day = "500";
					                obj.el.night = "700";
					            } else {
					                obj.el.day = "1200";
					            }
					        } else if(score == 2) {
					            if(req.body.meter_type=="double") {
					                obj.el.day = "1600";
					                obj.el.night = "1900";
					            } else {
					                obj.el.day = "3500";
					            }
					        } else {
					            if(req.body.meter_type=="double") {
					                obj.el.day = "3600";
					                obj.el.night = "3900";
					            } else {
					                obj.el.day = "7500";
					            }
					        }
					    }
					}
					else
					    obj.has_electricity = "False";
				}

				if (req.body.has_gas=="True") {
				    if (req.body.scenario=="monthly") {
				        if (req.body.gas_incl=="True")
					        obj.gas.cost = req.body.cost_gas;
					    else
					        obj.gas.cost_excl = req.body.cost_gas;
					}
					else if (req.body.scenario=="yearly")
					    obj.gas.consumption = req.body.gas_consumption;
				} else
				    obj.has_gas = "False";

		        if (req.body.scenario=='yearly')
				    obj.is_afrekening = "True";
		        if (req.body.scenario=='monthly')
				    obj.is_voorschot = "True";

				if (req.body.has_electricity=="True") {
				    var el_total=0;
					obj.el.meter_type = req.body.meter_type;
				    if (req.body.scenario=="monthly") {
				        if (req.body.el_incl=="True")
					        obj.el.cost = req.body.cost_el;
					    else
					        obj.el.cost_excl = req.body.cost_el;
					} else if (req.body.scenario=="yearly") {
					    obj.el.day = req.body.el_day;
					    el_total = el_total + parseInt(obj.el.day);
					}

				    if (req.body.meter_type=="double" && req.body.scenario=="yearly") {
					    obj.el.night = req.body.el_night;
					    el_total = el_total + parseInt(obj.el.night);
					}
				    if (req.body.excl_night=="True") {
				        obj.el.meter_type = obj.el.meter_type + "_excl";
				        if (req.body.scenario=="yearly") {
					        obj.el.excl_night = req.body.el_excl_night;
					        el_total = el_total + parseInt(obj.el.excl_night);
					    }
				    }
				    obj.el.total=helpers.strval(el_total);

				    if (req.body.prosumer=="True")
					    obj.el.kVA = req.body.kVA;
				} else
				    obj.has_electricity = "False";

				if (req.body.client_type=="sme")
				    obj.vat_number = req.body.client_type;

				obj.manual="True";

				var header = {
					referrer : sess.referrer,
					site : req.get('host')
                };

                obj.source = header;
                obj.person = {
                    email : req.body.email
                };

				obj.parser = {
				    files : [
                        {
                            language : sess.site_lang, 
                            parser : 'manual'
                        }
                    ]
                };

                //make a new directory (avoid clashes if a file with the same filename was uploaded before)
                var fs = require('fs');
                var target_dir = path.join(__basedir, dir_conf.share_dir, 'uploads');
                var unique_name = helpers.random_str(25);
                while (fs.existsSync(path.join(target_dir, unique_name)))
                    unique_name += helpers.random_str(25);
                fs.mkdirSync(path.join(target_dir, unique_name), 0777);

                fs.writeFile(path.join(target_dir, unique_name, 'input.json'), JSON.stringify(obj), function (err) {
                    if (err) {
                        res.redirect('/' + sess.site_lang + '/sorry');
                        return;
                    }
                });
                // unique_name = 'ibd38vwAaggHvArAhHTziru80';
	    		var command = process.env.CONTRACTFIT + '/EnergieGids/Scripts/execute_manual.sh ' + escapeshellarg(unique_name);
	    		if (process.platform != "Darwin") {
                    command = 'sudo -u azureuser ' + command;
                }
                if (process.platform == 'win32') {
                } else {
	    		    exec(command, function(err, out, code) {
                        if (err instanceof Error) {
                            res.redirect('/' + sess.site_lang + '/sorry');
                            return;
                        } else {
                            sess.gas_product_id = null;
                            sess.electricity_product_id = null;
                            sess.directory = unique_name;
                            sess.email = "";
                            sess.show_step = 2;
                            sess.last_step = 2;
                            res.redirect('/' + sess.site_lang + '/result/' + unique_name + '#confirm');
                        }
                        return;
                    });
                    return;
                }
            }
        }

        sess.manual = true;
        sess.show_step = sess.last_step;
    
        resRender('static/manual', res, c_data);
    }
}