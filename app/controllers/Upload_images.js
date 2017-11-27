var path = require('path');
var fs = require('fs');

const UploadImagesController = module.exports = {
    index: function(req, res) {
        var segment = helpers.trim(res.locals.path,'/').split('/');
        var position = helpers.in_array(segment[0], ["en","fr","nl"])?2:1;

        if (!segment[position]) {
            var target_dir = path.join(__basedir, dir_conf.share_dir, 'uploads');

            //make a new directory (avoid clashes if a file with the same filename was uploaded before)
            var unique_name = helpers.random_str(25);
            while (fs.existsSync(path.join(target_dir, unique_name)))
                unique_name += helpers.random_str(25);
            fs.mkdirSync(path.join(target_dir, unique_name), 0777);

        } else {
            if (!segment[position + 1]) {

            }
        }
    }
}