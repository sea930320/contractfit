var path = require('path');
var fs = require('fs');
var uniqid = require('uniqid');
var exec = require('exec');
var escapeshellarg = require('escapeshellarg');
const Preferences = require('../models/preferences_mdl');
const Customer = require('../models/customer_mdl');

const file_amount = function(files) {
    return (files.length < 1 || files.length > 2 ) ? gt.gettext('Fout aantal bestanden') : "";
}

const file_extension = function(files) {
    var validExtensions = ['.pdf','.png','.jpg','.jpeg','.gif'];
    for (var i = 0; i < files.length; i++) {
        const file_name = files[i].name;
        if(!helpers.in_array(helpers.strrchr(file_name, ".").toLowerCase(), validExtensions))
            return gt.gettext('Een van de bestanden is ongeldig');
    }
    return "";
}

const fileupload_validate = function(files) {
    global.upload_invoice_errors = [];
    global.upload_invoice_errors.push(file_amount(files));
    global.upload_invoice_errors.push(file_extension(files));
    global.upload_invoice_errors = global.upload_invoice_errors.filter(function(err) {
        return (err != "");
    })
    return (global.upload_invoice_errors.length == 0);
}

const execAsync = function(command) {
    return new Promise(function(resolve, reject) {
        exec(command, function(err, out, code) {
            if (err instanceof Error) {
                return reject(err);
            } else {
                return resolve(out);
            }
        });
    });
}

const moveFilAsync = function(target_dir, folder_name, orginal_file) {
    return new Promise(function(resolve, reject) {
        var fileName = uniqid();
        var ext = helpers.strrchr(orginal_file.name, ".").toLowerCase();
        while (fs.existsSync(path.join(target_dir, folder_name, fileName) + ext))
            fileName = uniqid();
        var new_path = path.join(target_dir, folder_name, fileName) + ext;
        orginal_file.mv(new_path, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve(fileName);
        });
    });
}

const UserInformationController = module.exports = {
    index: function(req, res) {
        var sess = req.session;
        var segment = helpers.trim(res.locals.path, '/').split('/');
        var position = helpers.in_array(segment[0], ["en","fr","nl"])?2:1;
        
        const redirect_func = function(msg){
            sess.form_error_type = "upload";
            sess.form_errors = msg;
            res.redirect('/' + sess.site_lang + '/sorry');
        }

        if (!segment[position]) {
            res.redirect('/' + sess.site_lang + '/404');
            return;
        }
        if (req.body.pdfInvoice) {
            var required_msg = gt.gettext('Gelieve het %s-veld correct in te vullen.');
            req.checkBody('email', vsprintf(required_msg, gt.gettext('email'))).notEmpty();
            req.checkBody('email', gt.gettext('Gelieve een correct emailadres op te geven')).isEmail();
            var file = req.files['fileToUpload[]'];
            var fileToUpload = [];
            if (Object.prototype.toString.call(file).slice(8, -1) != 'Array') {
                fileToUpload.push(file);
            } else fileToUpload = file;

            global.upload_invoice_errors = [];
            var errors = req.validationErrors();
            if (!fileupload_validate(fileToUpload) || errors) {
                if (errors) {
                    sess.sorry_title = gt.gettext("Fout e-mailadres");
                    sess.sorry_message = gt.gettext("Het opgegeven e-mailadres is niet geldig.");
                } else {
                    sess.sorry_message = "";
                    sess.sorry_title = "";
                    for (var i = 0; i < global.upload_invoice_errors.length; i++) {
                        if (global.upload_invoice_errors[i] == gt.gettext('Er werden geen bestanden gevonden.')) {
                            sess.sorry_title += gt.gettext("Fout tijdens uploaden") + "\n";
                        } else {
                            sess.sorry_title += gt.gettext("Fout bestand") + "\n";
                        }
                        sess.sorry_message += global.upload_invoice_errors[i];
                    }
                }          
                res.redirect('/' + sess.site_lang + '/sorry');
                return;
            } else {
                var total = fileToUpload.length;
                var target_dir = path.join(__basedir, dir_conf.share_dir, 'uploads');
                var unique_name = segment[position];

                var promises = [];
                for ( var i = 0; i < total; i++ ) {
                    promises.push(moveFilAsync(target_dir, unique_name, fileToUpload[i]));
                }

                Promise.all(promises).then(fileNames => {
                    unique_name = 'ibd38vwAaggHvArAhHTziru80';
                    var command = process.env.CONTRACTFIT + '/EnergieGids/Scripts/execute_web.sh ' + escapeshellarg(unique_name);
                    if (process.platform != "Darwin") {
                        command = 'sudo -u azureuser ' + command;
                    }
                    // exec(command, function(err, out, code) {
                    //     if (err instanceof Error) {
                    //         redirect_func(['Sorry, Something wrong, Please try Again']);
                    //     } else {
                    //         if (code != 0) {
                    //             var form_errors = [];
                    //             if (out) {
                    //                 var json_output = JSON.parse(helpers.str_replace("'", '"', out));
                    //                 if (json_output) {
                    //                     form_errors.push(json_output[sess.site_lang]);
                    //                 } else {
                    //                     form_errors.push(gt.gettext("Er is een fout opgetreden tijdens het verwerken van uw bestand."));
                    //                 }
                    //             } else {
                    //                 form_errors.push(gt.gettext("Er is een fout opgetreden tijdens het verwerken van uw bestand."));
                    //             }
                    //             redirect_func(form_errors);
                    //         } else {
                                res.redirect('/' + sess.site_lang + '/result/' + unique_name + '#confirm');
                                return;
                    //         }
                    //         return;
                    //     }
                    // });
                }, error => {
                    redirect_func(['Sorry, Something wrong, Please try Again']);
                }).catch(e => {
                    redirect_func(['Sorry, Something wrong, Please try Again']);
                });
                return;
            }
        }
        var directory = path.join(__basedir, dir_conf.output_dir, segment[position]);
        var el_product_id = segment[position + 1];
        var gas_product_id = segment[position + 2];
        global_data['last_step'] = 3;
        fs.readFile(path.join(directory, 'input.json'), 'binary', function(err,data) {
            if (err) {
                res.redirect('/' + sess.site_lang + 'sorry');
                return;
            }
            global_data['json'] = JSON.parse(data);
            if (gas_product_id == "" && el_product_id != ""){
                if (!helpers.array_key_exists("offers_electricity",global_data['json']) && helpers.array_key_exists("offers_gas", global_data['json'])) {
                    gas_product_id = el_product_id;
                    el_product_id = null;
                }
            }

            if ((el_product_id == "" && gas_product_id == "") || !fs.existsSync(directory)) {
                res.redirect('/' + sess.site_lang + '404');
                return;
            }

            sess.directory = segment[position];
            sess.el_product_id = el_product_id;
            sess.gas_product_id = gas_product_id;
            sess.last_step = 3;
            sess.show_step = 3;
            global_data['email'] = helpers.strval(global_data['json']['person']['email']);
            sess.email = global_data['email'];
            global_data['directory'] = directory;

            if (el_product_id != "") {
                var el_product = "";
                for (var i = 0; i < global_data['json']['offers_electricity']['product'].length; i++) {
                    var product = global_data['json']['offers_electricity']['product'][i];
                    if (product['pid'] == el_product_id) {
                        el_product = product;
                    }
                }
                global_data['el_product'] = el_product;
                sess.el_product = el_product;
            }

            if (gas_product_id != "") {
                var gas_product = "";
                for (var i = 0; i < global_data['json']['offers_gas']['product'].length; i++) {
                    var product = global_data['json']['offers_gas']['product'][i];
                    if (product['pid'] == gas_product_id) {
                        gas_product = product;
                    }
                }
                global_data['gas_product'] = gas_product;
                sess.gas_product = gas_product;
            }

            sess.manual = false;

            if (helpers.array_key_exists('manual', global_data['json']) && global_data['json']['manual'] == 'True') {
                sess.manual = true;
            }
            //Variables
            var c_data  = {};
            var commands = [];
            //View data
            c_data.title = gt.gettext('Persoonlijke gegevens');
            // var promises = [];
            var required_msg = gt.gettext('Gelieve het %s-veld correct in te vullen.');
            if (req.body.green) {
                req.checkBody('kVA', gt.gettext('Vermogen eigen installatie (kVA)')).optional({ checkFalsy: true }).isAmount();
                req.checkBody('green', vsprintf(required_msg, gt.gettext('Groene energie'))).notEmpty();
                req.checkBody('green', gt.gettext('Groene energie')).isAlphanumeric();
                req.checkBody('differentProviders', vsprintf(required_msg, gt.gettext('Verschillende leveranciers'))).notEmpty();
                req.checkBody('differentProviders', gt.gettext('Verschillende leveranciers')).isAlphanumeric();
                req.checkBody('fixed', vsprintf(required_msg, gt.gettext('Vaste tarieven'))).notEmpty();
                req.checkBody('fixed', gt.gettext('Vaste tarieven')).isAlphanumeric();
                req.checkBody('variable', vsprintf(required_msg, gt.gettext('Variabele tarieven'))).notEmpty();
                req.checkBody('variable', gt.gettext('Variabele tarieven')).isAlphanumeric();
                req.checkBody('direct_debit', vsprintf(required_msg, gt.gettext('Domiciliëring'))).notEmpty();
                req.checkBody('direct_debit', gt.gettext('Domiciliëring')).isAlphanumeric();
                req.checkBody('promotions', vsprintf(required_msg, gt.gettext('Promoties'))).notEmpty();
                req.checkBody('promotions', gt.gettext('Promoties')).isAlphanumeric();

                let new_preference = new Preferences({
                    kVA : req.body.kVA,
                    directory: sess.directory,
                    green: req.body.green,
                    differentProviders: req.body.differentProviders,
                    fixed: req.body.fixed,
                    variable: req.body.variable,
                    directdebit: req.body.direct_debit,
                    promotions: req.body.promotions
                });
                new_preference.save((err, preference) => {
                    if (err) {
                        res.redirect('/' + sess.site_lang + '404');
                        return;
                    } else {
                        // var command = process.env.CONTRACTFIT + '/EnergieGids/Scripts/execute_choice.sh ' + escapeshellarg(sess.directory);
                        // if (process.platform != "Darwin") {
                        //     command = 'sudo -u azureuser ' + command;
                        // }
                        // // promises.push(execAsync(command));
                        // commands['choice'] = command;
                        // exec(commands['choice'], function(err, out, code) {
                        //     if (err instanceof Error) {
                        //         res.redirect('/' + sess.site_lang + '/404');
                        //         return;
                        //     } else {
                        //     }
                        // });
                    }
                });
            }

            if (req.body.phone) {
                req.checkBody('email', vsprintf(required_msg, gt.gettext('email'))).notEmpty();
                req.checkBody('email', gt.gettext('Gelieve een correct emailadres op te geven')).isEmail();
                req.checkBody('day', vsprintf(required_msg, gt.gettext('geboortedag'))).notEmpty();
                req.checkBody('day', gt.gettext('geboortedag')).isNumeric();
                req.checkBody('month', vsprintf(required_msg, gt.gettext('geboortemaand'))).notEmpty();
                req.checkBody('month', gt.gettext('geboortemaand')).isNumeric();
                req.checkBody('year', vsprintf(required_msg, gt.gettext('geboortejaar'))).notEmpty();
                req.checkBody('year', gt.gettext('geboortejaar')).isNumeric();
                req.checkBody('phone', vsprintf(required_msg, gt.gettext('telefoonnummer'))).notEmpty();
                req.checkBody('phone', gt.gettext('Dit telefoonnummer wordt niet herkend.')).is_be_phone();
                req.sanitizeBody('phone').trim_phone();
                //Trim and escape the fields.
                var param_names = ['email', 'day', 'month', 'year', 'phone'];
                param_names.forEach(function(param_name) {
                    req.sanitizeBody(param_name).escape();
                    req.sanitizeBody(param_name).trim();
                });

                if (req.body.absolute) {
                    req.checkBody('scenario', vsprintf(required_msg, gt.gettext('scenario'))).notEmpty();
                    req.checkBody('scenario', gt.gettext('scenario')).isAlphanumeric();
                    req.checkBody('person_title', vsprintf(required_msg, gt.gettext('aanspreking'))).notEmpty();
                    req.checkBody('person_title', gt.gettext('aanspreking')).isAlphanumeric();
                    req.checkBody('person_first_name', vsprintf(required_msg, gt.gettext('voornaam'))).notEmpty();
                    req.sanitizeBody('person_first_name').clean_name();
                    req.checkBody('person_last_name', vsprintf(required_msg, gt.gettext('familienaam'))).notEmpty();
                    req.sanitizeBody('person_last_name').clean_name();
                    req.checkBody('delivery_address_zip_code', vsprintf(required_msg, gt.gettext('postcode'))).notEmpty();
                    req.checkBody('delivery_address_zip_code', gt.gettext('postcode')).isNumeric();
                    req.checkBody('delivery_address_city', vsprintf(required_msg, gt.gettext('gemeente'))).notEmpty();
                    req.sanitizeBody('delivery_address_city').clean_name();
                    req.checkBody('delivery_address_street', vsprintf(required_msg, gt.gettext('straat'))).notEmpty();
                    req.sanitizeBody('delivery_address_street').clean_name();
                    req.checkBody('delivery_address_number', vsprintf(required_msg, gt.gettext('nummer'))).notEmpty();
                    req.checkBody('delivery_address_number', gt.gettext('nummer')).isAlphanumeric();
                    req.checkBody('delivery_address_box', gt.gettext('bus')).optional({ checkFalsy: true }).isNumeric();
                    req.checkBody('gas_EAN', gt.gettext('EAN Gas')).optional({ checkFalsy: true }).isNumeric();
                    req.checkBody('el_EAN', gt.gettext('EAN Elektriciteit')).optional({ checkFalsy: true }).isNumeric();

                    param_names = ['scenario', 'person_title', 'person_first_name', 'person_last_name', 'delivery_address_zip_code', 'delivery_address_city', 'delivery_address_street', 'delivery_address_number', 'delivery_address_box', 'gas_EAN', 'el_EAN', 'rrn', 'acceptance', 'direct_debit'];

                    if (req.body.has_el) {
                        req.checkBody('el_EAN', vsprintf(required_msg, gt.gettext('EAN Elektriciteit'))).notEmpty();
                        req.checkBody('el_EAN', gt.gettext('Dit is niet herkend als een geldig Belgisch EAN nummer.')).is_ean();
                    }

                    if (req.body.has_gas) {
                        req.checkBody('gas_EAN', vsprintf(required_msg, gt.gettext('EAN Gas'))).notEmpty();
                        req.checkBody('gas_EAN', gt.gettext('Dit is niet herkend als een geldig Belgisch EAN nummer.')).is_ean();
                    }

                    if (req.body.billing_address) {
                        req.checkBody('billing_address_zip_code', vsprintf(required_msg, gt.gettext('postcode'))).notEmpty();
                        req.checkBody('billing_address_zip_code', gt.gettext('postcode')).isNumeric();
                        req.checkBody('billing_address_city', vsprintf(required_msg, gt.gettext('gemeente'))).notEmpty();
                        req.sanitizeBody('billing_address_city').clean_name();
                        req.checkBody('billing_address_street', vsprintf(required_msg, gt.gettext('straat'))).notEmpty();
                        req.sanitizeBody('billing_address_street').clean_name();
                        req.checkBody('billing_address_number', vsprintf(required_msg, gt.gettext('nummer'))).notEmpty();
                        req.checkBody('billing_address_number', gt.gettext('nummer')).isAlphanumeric();
                        req.checkBody('billing_address_box', gt.gettext('bus')).optional({ checkFalsy: true }).isNumeric();

                        var additional_params = ['billing_address_zip_code', 'billing_address_city', 'billing_address_street', 'billing_address_number', 'billing_address_box'];
                        param_names = param_names.concat(additional_params);
                    }                    
                }

                req.checkBody('rrn', gt.gettext('Dit is niet herkend als een geldig rijksregisternummer.')).optional({ checkFalsy: true }).is_rrn();
                if (req.body.rrn_required) {
                    req.checkBody('rrn', vsprintf(required_msg, gt.gettext('rijksregisternummer'))).notEmpty();
                }
                req.checkBody('acceptance', vsprintf(required_msg, gt.gettext('gebruiksvoorwaarden'))).notEmpty();
                req.sanitizeBody('acceptance').clean_alphanumeric();
                if (req.body.direct_debit || req.body.account_required) {
                    req.sanitizeBody('account_holder').clean_name();
                    req.checkBody('account_number', vsprintf(required_msg, gt.gettext('rekeningnummer'))).notEmpty();                        
                    req.sanitizeBody('account_number').clean_alphanumeric();
                    req.checkBody('account_number', gt.gettext('Gelieve het IBAN nummer te controleren.')).is_iban();
                    var additional_params = ['account_holder', 'account_number'];
                    param_names = param_names.concat(additional_params);
                } else {
                    req.sanitizeBody('account_holder').clean_name();               
                    req.checkBody('account_number', gt.gettext('Gelieve het IBAN nummer te controleren.')).optional({ checkFalsy: true }).is_iban();
                    var additional_params = ['account_holder', 'account_number'];
                    param_names = param_names.concat(additional_params);
                }

                param_names.forEach(function(param_name) {
                    req.sanitizeBody(param_name).escape();
                    req.sanitizeBody(param_name).trim();
                });

                var errors = req.validationErrors();
                if (errors) {
                    c_data.feedback = errors;
                } else {
                    const ip = req.clientIp;
                    var obj = {
                        email: sess.email,
                        electricty: sess.el_product_id,
                        gas: sess.gas_product_id,
                        directory: sess.directory,
                        phone: req.body.phone,
                        birthdate: req.body.day + "/" + req.body.month + "/" + req.body.year,
                        account_number: "n/a",
                        account_holder: "n/a",
                        acceptance: false,
                        direct_debit: false,
                        name: "n/a",
                        rrn: "n/a",
                        ip: ip
                    }
                    if (req.body.name && req.body.name != "") {
                        obj.name = req.body.name;
                    }
                    if (req.body.rrn && req.body.rrn != "") {
                        obj.rrn = req.body.rrn;
                    }
                    if (req.body.account_number && req.body.account_number != "") {
                        obj.account_number = req.body.account_number;
                    }
                    if (req.body.account_holder && req.body.account_holder != "") {
                        obj.account_holder = req.body.account_holder;
                    }
                    if (req.body.acceptance && req.body.acceptance == "on") {
                        obj.acceptance = true;
                    }
                    if (req.body.direct_debit && req.body.direct_debit == "on") {
                        obj.direct_debit = true;
                    }

                    var input_absolute = ['person_title','person_first_name','person_last_name','delivery_address_zip_code','delivery_address_city','delivery_address_street','delivery_address_number','delivery_address_box','gas_EAN','el_EAN','billing_address','billing_address_zip_code','billing_address_city','billing_address_street','billing_address_number','billing_address_box'];
                    var concatenator = "";

                    for (var index = 0; index < input_absolute.length; index++) {
                        var element = input_absolute[index];
                        concatenator = concatenator + element + ": ";
                        if(req.body[element] && req.body[element] != '')
                            concatenator = concatenator + req.body[element];
                        concatenator = concatenator + "; ";
                    }
                    obj.input_absolute = concatenator;

                    let newCustomer = new Customer(obj);
                    newCustomer.save((err, customer) => {
                        if (err) {
                            res.redirect('/' + sess.site_lang + '/404');
                            return;
                        } else {
                            var command_switch = process.env.CONTRACTFIT + '/EnergieGids/Scripts/execute_switch.sh ' + escapeshellarg(obj.directory);
                            if (process.platform != "Darwin") {
                                command_switch = 'sudo -u azureuser ' + command_switch;
                            }
                            commands['switch'] = command_switch;
                            // // promises.push(execAsync(command));
                            // exec(commands['switch'], function(err, out, code) {
                            //     if (err instanceof Error) {
                            //         res.redirect('/' + sess.site_lang + '/404');
                            //         return;
                            //     } else {
                            //         if (code == '7') {
                            //             sess.last_step = 4;
                            //             res.redirect('/' + sess.site_lang + '/forward');
                            //             return;
                            //         } else {
                                        sess.last_step = 4;
                                        res.redirect('/' + sess.site_lang + '/thanks');
                                        return;
                            //         }
                            //     }
                            // });
                        }
                    });
                    return;
                }
            }
            //Master
            c_data.page_title = gt.gettext('Persoonlijke gegevens');
            c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

            c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster'];
            c_data.scripts = [];

            res.render('steps/user_information', c_data, function(err, html) {
                res.send(html);
            });
        });
    }
}