base_middleware = module.exports = function(req, res, next) {
    //load Instance
    var moviemapping = {
        'en': "kYmY3Zhctdg",
        'fr': "zmbSjJJxFIA",
        'nl': "etdrgZr8dJM",
    };
    var ingmoviemapping = {
        'en': "-O11ftq4okE",
        'fr': "HCnyPmoFoWU",
        'nl': "RMU9V4ROD5M",
    };
    //session
    var sess = req.session;
    var path = req.path;
    var first_segment = helpers.trim(path,'/').split('/')[0];

    if (!helpers.in_array(first_segment, ['en', 'fr', 'nl'])) {
        if (!sess.site_lang) {
            if (req.get('host').indexOf('gids') !== -1) {
                sess.site_lang = 'nl';
            } else if (req.get('host').indexOf('guide') !== -1) {
                sess.site_lang = 'fr';
            } else {
                sess.site_lang = 'en';
            }
        }
        res.redirect('/' + sess.site_lang + '/' + helpers.trim(req.originalUrl, '/'));
        return;
    }
    //set Locale - Language
    if (first_segment == 'fr') {
        gt.setLocale('fr_BE');
        sess.site_lang = 'fr';
    } else if (first_segment == 'nl') {
        gt.setLocale('nl_BE');
        sess.site_lang = 'nl';
    } else if (first_segment == 'en') {
        gt.setLocale('en_US');
        sess.site_lang = 'en';
    }

    if (req.get('host').indexOf('gids') !== -1) {
        sess.logo = 'logoenergiegids';
        sess.brand = 'Energiegids.be';
    } else if (req.get('host').indexOf('guide') !== -1) {
        sess.logo = 'logoguideenergie';
        sess.brand = 'Guideenergie.be';
    } else {
        sess.logo = 'logocontractfit';
        sess.brand = 'Contract.Fit';
    }

    if (!sess.referrer) {
        if(req.originalUrl.indexOf('pom') !== -1) {
            sess.referrer = 'pom';
        } else if (req.originalUrl.indexOf('ing') !== -1) {
            sess.referrer = 'ing';
        } else {
            sess.referrer = req.headers.referer ? req.headers.referer : "";
        }
    }

    if (req.get('host').indexOf('ing') !== -1) {
        sess.moviecode = ingmoviemapping[sess.site_lang];
        sess.logo = 'coop' + sess.site_lang;
    } else {
        sess.moviecode = moviemapping[sess.site_lang];
    }
    //Global data 
    global.global_data['last_step'] = 1;
    
    //local variable set
    res.locals = {
        "sess"          : sess,
        "query"         : req.query,
        "body"          : req.body,
        "params"        : req.params,
        "host"          : req.get('host'),
        'path'          : req.path,
        'originalUrl'   : req.originalUrl,
        'cookies'       : req.cookies
    }
    
    next();
}