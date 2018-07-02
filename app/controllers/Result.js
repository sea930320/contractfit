var path = require('path');
var fs = require('fs');
var uniqid = require('uniqid');
var exec = require('exec');
var escapeshellarg = require('escapeshellarg');
const CustomerFeedback = require('../models/customer_feedback');

const test_electricity_or_gas = function(json) {
	return json["offers_electricity"] || json["offers_gas"];
}

const file_amount = function(files) {
    return (files.length < 1 ) ? gt.gettext('Er werden geen bestanden gevonden.') : "";
}

const file_extension = function(files) {
    var validExtensions = ['.pdf'];
    for (var i = 0; i < files.length; i++) {
        const file_name = files[i].name;
        if(!helpers.in_array(helpers.strrchr(file_name, ".").toLowerCase(), validExtensions))
            return gt.gettext('Een van de opgegeven bestanden is geen geldig bestand.');
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

const ResultController = module.exports = {
    index: function(req, res) {
        var sess = req.session;
        var segment = helpers.trim(res.locals.path, '/').split('/');
        var position = helpers.in_array(segment[0], ["en","fr","nl"])?2:1;
        const redirect_func = function(msg){
            sess.sorry_title = "Upload Failed";
            sess.form_errors = msg;
            res.redirect('/' + sess.site_lang + '/sorry');
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
            }
            
            var total = fileToUpload.length;
            var unique_name = sess.directory;
            var target_dir = path.join(__basedir, dir_conf.share_dir, 'uploads');
            var promises = [];
            for ( var i = 0; i < total; i++ ) {
                promises.push(moveFilAsync(target_dir, unique_name, fileToUpload[i]));
            }
            Promise.all(promises).then(fileNames => {
                var command = process.env.CONTRACTFIT + '/EnergieGids/Scripts/execute_web.sh ' + escapeshellarg(unique_name);
                if (process.platform != "Darwin") {
                    command = 'sudo -u azureuser ' + command;
                }
                exec(command, function(err, out, code) {
                    if (err instanceof Error) {
                        redirect_func(['Sorry, Something wrong, Please try Again']);
                        return;
                    } else {
                        res.redirect('/' + sess.site_lang + '/result/' + unique_name + '#confirm');
                        return;
                    }
                });
            }, error => {
                redirect_func(['Sorry, Something wrong, Please try Again']);
            }).catch(e => {
                redirect_func(['Sorry, Something wrong, Please try Again']);
            });
            return;
        }
        if (segment[position]) {
            var directory = path.join(__basedir, dir_conf.output_dir, segment[position]);
            if (fs.existsSync(directory)) {
                sess.gas_product_id = null;
                sess.el_id = null;
                sess.directory = segment[position];
                sess.last_step = 2;
                sess.show_step = 2;
                return fs.readFile(path.join(directory, 'input.json'), 'binary', function(err,data) {
                    if (err) {
                        res.redirect('/' + sess.site_lang + 'sorry');
                        return;
                    }
                    global_data['json'] = JSON.parse(data);

                    if (!test_electricity_or_gas(global_data['json'])) {
                        if (global_data['json']["picturestream"]) {
                            sess.required_page_number = 0;
                            res.redirect('/' + sess.site_lang + '/share_by_picture/' + segment[position] + '/step');
                        } else {
                            res.redirect('/' + sess.site_lang + '/sorry');
                        }
                        return;
                    }

                    global_data['email'] = global_data['json']['person']['email'].toString();
                    sess.email = global_data['email'];
                    global_data['last_step'] = 2;
                    var c_data  = {};
                    if (sess.last_step) {
                        if (sess.last_step < 2) {
                            res.redirect('/' + sess.site_lang + '/');
                            return;
                        }
                    } else {
                        res.redirect('/' + sess.site_lang + '/');
                        return;
                    }
                    //Master
                    c_data.page_title = gt.gettext('Resultaat berekening');
                    c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);
            
                    c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster','introjs'];
                    c_data.scripts = [
                    ];
                    res.render('steps/result', c_data, function(err, html) {
                        res.send(html);
                    });
                    return;
                });
            } else {
                res.redirect('/' + sess.site_lang + '/404');
                return;
            }
        } else {
            res.redirect('/' + sess.site_lang + '/404');
            return;
        }
    },
    result_parsing: function (req, res) {
        req.send("Okay");
    },
    forward: function(req, res) {
        res.send("Okay");
    },
    success: function(req, res) {
        var c_data  = {};
        var sess = req.session;
        //Master
        c_data.title = gt.gettext('Dat is dan geregeld!');
        c_data.page_title = gt.gettext('Dat is dan geregeld');
        c_data.page_description = vsprintf(gt.gettext('%s leidt gebruikers moeiteloos naar het best passende product voor hun energie: gas en elektriciteit. Met %s vergelijk je snel, makkelijk en gegarandeerd objectief het aanbod van de markt en kan je zonder moeite overstappen.'), [sess.brand, sess.brand]);

        c_data.styles = ['bootstrap','style','dark','font-icons','animate','magnific-popup','responsive','components/bs-filestyle','colors','style.min','vendor/tooltipster'];
        c_data.scripts = [];

        if (req.body.description) {
            req.checkBody('email', gt.gettext('Gelieve een correct emailadres op te geven')).optional({ checkFalsy: true }).isEmail();
            req.sanitizeBody('description').clean_message();
            req.checkBody('rating', gt.gettext('')).optional({ checkFalsy: true }).is_natural();
            var param_names = ['email', 'description', 'rating'];
            param_names.forEach(function(param_name) {
                req.sanitizeBody(param_name).escape();
                req.sanitizeBody(param_name).trim();
            });

            var errors = req.validationErrors();
            if (errors) {
                c_data.feedback = errors;
                res.render('static/success', c_data, function(err, html) {
                    res.send(html);
                });
            } else {
                let obj = {
                    email: req.body.email,
                    description: req.body.description
                };
                if (req.body.rating) {
                    obj.rating = req.body.rating;
                }
                let new_feedback = new CustomerFeedback(obj);
                new_feedback.save((err, customer_feedback) => {
                    if (err) {
                        c_data.feedback = [{
                            'param': 'error',
                            'msg': 'Oops, something went wrong. Try Again'
                        }];
                        res.render('static/success', c_data, function(err, html) {
                            res.send(html);
                        });
                    } else {
                        c_data.feedback = [{
                            'success' : 'success',
                            'param': 'success',
                            'msg': gt.gettext('Feedback succesvol verzonden')
                        }];
                        res.mailer.send('email_templates/customer_feedback', {
                            to: 'sky930320@gmail.com',
                            subject: 'Feedback ontvangen van ' + req.body.email + ' (' + req.body.rating + ')',
                            message: req.body.description.split("\n").join("<br>")
                        }, function(err, message) {
                            if (err) {
                                c_data.feedback = [{
                                    'param': 'error',
                                    'msg': 'Oops, something went wrong. Try Again2'
                                }];
                            }
                            res.render('static/success', c_data, function(err, html) {
                                res.send(html);
                            });
                        });
                    }
                });
            }
            return;
        }
        res.render('static/success', c_data, function(err, html) {
            res.send(html);
        });
    }
}