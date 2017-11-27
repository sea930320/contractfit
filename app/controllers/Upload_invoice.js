var path = require('path');
var fs = require('fs');
var uniqid = require('uniqid');
var exec = require('exec');
var escapeshellarg = require('escapeshellarg');

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

const UploadInvoiceController = module.exports = {
    index: function(req, res) {
        var sess = req.session;
        const redirect_func = function(msg){
            sess.form_error_type = "upload";
            sess.form_errors = msg;
            res.send(JSON.stringify({
                success: '/' + sess.site_lang + '/home#section-form'
            }));
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
                sess.form_error_type = "upload";
                if (errors!= false)
                    sess.form_errors = helpers.array_merge(global.upload_invoice_errors, errors);
                else 
                    sess.form_errors = global.upload_invoice_errors;
                res.send(JSON.stringify({
                    success: '/' + sess.site_lang + '/home#section-form'
                }));
                return;
            } else {
                sess.email = req.body.email;
                
                var total = fileToUpload.length;
                var target_dir = path.join(__basedir, dir_conf.share_dir, 'uploads');
                var unique_name = helpers.random_str(25);

                while (fs.existsSync(path.join(target_dir, unique_name)))
                    unique_name += helpers.random_str(25);
                fs.mkdirSync(path.join(target_dir, unique_name), 0777);

                var promises = [];
                for ( var i = 0; i < total; i++ ) {
                    promises.push(moveFilAsync(target_dir, unique_name, fileToUpload[i]));
                }
                Promise.all(promises).then(fileNames => {
                    var obj = {
                        person: {
                            email: req.body.email,
                            source: {
                                referrer: sess.referrer,
                                site    : req.get('host')
                            }
                        }
                    }
                    fs.writeFile(path.join(target_dir, unique_name, 'input.json'), JSON.stringify(obj), function (err) {
                        if (err) {
                            redirect_func(['Sorry, Something wrong, Please try Again']);
                            return;
                        }
                    });
                    unique_name = 'ibd38vwAaggHvArAhHTziru80';
                    var command = process.env.CONTRACTFIT + '/EnergieGids/Scripts/execute_manual.sh ' + escapeshellarg(unique_name);
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
                                sess.gas_product_id = null;
                                sess.electricity_product_id = null;
                                sess.directory = unique_name;
                                sess.email = req.body.email;
                                sess.show_step = 2;
                                sess.last_step = 2;
                                res.send(JSON.stringify({
                                    success: '/' + sess.site_lang + '/result/' + unique_name + '#confirm'
                                }));
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
        } else {
            sess.sorry_title = gt.gettext("Er liep iets mis");
            sess.sorry_message = gt.gettext("Er is een zeer merkwaardige fout opgetreden...");
            res.send(JSON.stringify({
                success: '/' + sess.site_lang + '/sorry'
            }));
        }
    }
}