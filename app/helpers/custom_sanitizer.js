customSanitizer = module.exports = {
    clean_name: function(value) {
        return value.replace(/[^a-zA-Z0-9_ '()@\+\.]/u, 'X');
    },
    valid_supplier_product: function(value) {
        return value.replace(/.*ignore.*|X string.*X/u,'');
    },
    trim_phone: function(value){
        return value.replace(/[^0-9+]/u,'');
	},
    clean_alphanumeric: function(value) {
        return value.replace(/[^a-zA-Z0-9_]/u,'');
    },
    clean_message: function(value) {
        return value.replace(/[^a-zA-Z0-9_ ]/u,'');
    }
}