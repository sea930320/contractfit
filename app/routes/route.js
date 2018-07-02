const express = require('express');
const router = express.Router();
//importing controller
const StaticPagesController = require('../controllers/Static_pages');
const UploadImagesController = require('../controllers/Upload_images');
const ResultController = require('../controllers/Result');
const UploadInvoiceController = require('../controllers/Upload_invoice');
const UserInformationController = require('../controllers/User_information');

//Static
router.use('/faq', StaticPagesController.faq);
router.use('/id_reader', StaticPagesController.id_reader);
router.get('/contact', StaticPagesController.get_contact);
router.post('/contact', StaticPagesController.post_contact);
router.use('/terms-and-conditions', StaticPagesController.terms_and_conditions);
router.use('/sorry', StaticPagesController.sorry);
router.get('/manual', StaticPagesController.get_manual);
router.post('/manual', StaticPagesController.post_manual);

//Upload Image
//router.use('/upload_image', UploadImagesController.index); // incomplete

router.use('/share_picture', StaticPagesController.share_picture);
//router.use('/share_by_picture', ShareByPictureController.index);

//Upload Invoice
router.post('/upload_invoice', UploadInvoiceController.index);
//Result Analysing
router.use('/result', ResultController.index);
router.use('/switch', UserInformationController.index);
router.use('/user_information', UserInformationController.index);
// router.use('/result_parsing', ResultController.result_parsing);
router.use('/forward', ResultController.forward);
router.use('/thanks', ResultController.success);

router.use('/pom', StaticPagesController.new_home);
router.use('/ing', StaticPagesController.new_home);
router.use('/home', StaticPagesController.new_home);
router.use('/factuuranalyse', StaticPagesController.new_home);
router.use(/\/$/, StaticPagesController.new_home);
router.use(function(req,res) {
    res.render('errors/error_404');
});
module.exports = router;