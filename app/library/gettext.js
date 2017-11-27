const GettextModule = module.exports = function() {
    //-------------Load and add translations from .mo or .po files----------------
    const fs = require('fs');
    const Gettext = require('node-gettext');
    const gettextParser = require('gettext-parser');
    const path = require('path');
    
    // app/language/LOCALE/LC_MESSAGES/messages.po
    const translationsDir = './app/language';
    const locales = ['en_US', 'fr_BE'];
    const domain = 'messages';

    global.gt = new Gettext();
    gt.setTextDomain(domain);
    locales.forEach((locale) => {
        const fileName = `${domain}.po`
        const translationsFilePath = path.join(translationsDir, locale,'LC_MESSAGES', fileName)
        const translationsContent = fs.readFileSync(translationsFilePath)

        const parsedTranslations = gettextParser.po.parse(translationsContent)
        gt.addTranslations(locale, domain, parsedTranslations)
    })
};