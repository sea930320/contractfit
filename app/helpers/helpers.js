helpers = module.exports = {
    set_select: function(field, value = '', default_val = false) {
        if (default_val) return ' selected="selected"';
        if (field instanceof Array) {
            field.forEach(function(element) {
                if (element == value) return ' selected="selected"';
            }, this);
            return '';
        } else {
            return field == value ? ' selected="selected"' : '';
        }
    },
    set_value: function(field, default_val = '') {
        return (field? field: default_val);
    },
    set_checkbox: function(field, value = '', default_val = false) {
        if (default_val) return ' checked="checked"';
        value = value.toString();
        if (field instanceof Array) {
            field.forEach(function(element) {
                if (element == value) return ' checked="checked"';
            }, this);
            return '';
        } else {
            return field == value ? ' checked="checked"': '';
        }
    },
    init_scripts: [
        "vendor/jquery.min.js", 
        "vendor/jquery.tooltipster.min.js", 
        "vendor/jquery.iframe-transport.js",
        "vendor/jquery.ui.widget.js",
        "vendor/jquery.fileupload.js",
        "vendor/xml2json.min.js",
        "vendor/angular.min.js",
        "vendor/angular-gettext.min.js",
        "vendor/mm-foundation-tpls-0.6.0.js",
        "vendor/foundation.js",
        "vendor/foundation.reveal.js",
        "applicationV6.js"
    ],
    renderScriptsTags: function(all) {
		if (all && (typeof all) == "string" ) {
			return '<script src = "/js/' + all + '"></script>';
		} else if (all && (typeof all) == "object" ) {
			return all.map(function(script){
				return '<script src = "/js/' + script + '"></script>';
			}).join('\n');
		} else {
			return '';
		}
    },
    renderStylesTags: function(all) {
		if (all && (typeof all) == "string" ) {
			return '<link rel="stylesheet"  type="text/css" href="/css/' + all + '.css" />'
		} else if (all && (typeof all) == "object" ) {
			return all.map(function(style){
				return '<link rel="stylesheet"  type="text/css" href="/css/' + style + '.css" />'
			}).join('\n');
		} else {
			return '';
		}
    },
    substr_replace: function(str, replace, start, length) {
        if (start < 0) {
            // start position in str
            start = start + str.length
        }
        length = length !== undefined ? length : str.length
        if (length < 0) {
            length = length + str.length - start
        }
        return [
            str.slice(0, start),
            replace.substr(0, length),
            replace.slice(length),
            str.slice(start + length)
        ].join('')
    },
    trim: function(str, pattern = "", replace = "") {
        if (pattern == "") {
            return str.replace(/^\s+|\s+$/g, replace);
        } else {
            var re = new RegExp('^(' + pattern + ')+|(' + pattern + ')+$', 'g');
            return str.replace(re, '', replace);
        }
    },
    str_replace :function(search, replacement, str) {
        return str.replace(new RegExp(search, 'g'), replacement);
    },
    in_array: function(needle, haystack) {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) return true;
        }
        return false;
    },
    array_merge: function(arr1, arr2) {
        const getClass = function (object) {
            return Object.prototype.toString.call(object).slice(8, -1);
        };

        const isValidCollection = function (obj) {
            try {
                return (
                    typeof obj !== "undefined" &&  // Element exists
                    getClass(obj) !== "String" &&  // weed out strings for length check
                    typeof obj.length !== "undefined" &&  // Is an indexed element
                    !obj.tagName &&  // Element is not an HTML node
                    !obj.alert &&  // Is not window
                    typeof obj[0] !== "undefined"  // Has at least one element
                );
            } catch (e) {
                return false;
            }
        };

        var arr1Class, arr2Class, i, il;

        // Save class names for arguments
        arr1Class = getClass(arr1);
        arr2Class = getClass(arr2);

        if (arr1Class === "Array" && isValidCollection(arr2)) {  // Array-like merge
            if (arr2Class === "Array") {
                arr1 = arr1.concat(arr2);
            } else {  // Collections like NodeList lack concat method
                for (i = 0, il = arr2.length; i < il; i++) {
                    arr1.push(arr2[i]);
                }
            }
        } else if (arr1Class === "Object" && arr1Class === arr2Class) {  // Object merge
            for (i in arr2) {
                if (i in arr1) {
                    if (getClass(arr1[i]) === getClass(arr2[i])) {  // If properties are same type
                        if (typeof arr1[i] === "object") {  // And both are objects
                            arr1[i] = array_merge(arr1[i], arr2[i]);  // Merge them
                        } else {
                            arr1[i] = arr2[i];  // Otherwise, replace current
                        }
                    }
                } else {
                    arr1[i] = arr2[i];  // Add new property to arr1
                }
            }
        }
        return arr1;
    },
    random_str: function(length, keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        var str = '';
        var max = keyspace.length - 1;
        for (i = 0; i < length; ++i) {
            var rand_key = Math.floor(Math.random() * max);
            str += keyspace[rand_key];
        }
        return str;
    },
    store_image: function(target_dir) {
        validExtensions = ['.pdf','.jpg','.jpeg','.png','.gif'];

    },
    strval: function(str) {  
        var type = '';  
      
        if (str === null) return '';  
      
        type = typeof str;  
        switch (type) {
            case 'undefiend':
                return ''; 
            case 'boolean':  
                if (str === true) return '1';  
                return '';
            case 'number':
                return str.toString();
            case 'symbol':  
                return 'Symbol'; 
            case 'function':
                return 'Function'; 
            case 'object':  
                return 'Object';  
        }           
        return str;  
    },
    strrchr: function (haystack, needle) {
        var pos = 0
        if (typeof needle !== 'string') {
          needle = String.fromCharCode(parseInt(needle, 10))
        }
        needle = needle.charAt(0)
        pos = haystack.lastIndexOf(needle)
        if (pos === -1) {
          return "";
        }
        return haystack.substr(pos)
    },
    strcmp: function(str1, str2) {
        return ((str1 === str2) ? 0 : ((str1 > str2) ? 1 : -1))
    },
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    str_split: function(str_val, splitLength = null) { 
        if (splitLength === null) {
          splitLength = 1
        }
        if (str_val === null || splitLength < 1) {
          return false
        }
        str_val += ''
        var chunks = []
        var pos = 0
        var len = str_val.length
        while (pos < len) {
          chunks.push(str_val.slice(pos, pos += splitLength))
        }
        return chunks
    },
    bcmod: function(left_operand, modulus) {
        var i, d;
        var split = function(operand) {
            var parts = operand.split( '.' );
            var i = parts[ 0 ];
            var d = '0.' + ( parts.length > 1 ? parts[ 1 ] : '0' );
                return { "i": i, "d": d };
        } 
        modulus = parseFloat( modulus );
        modulus = Math.abs( modulus );
        if ( modulus === 0 ) { return null; }
        var take = 4;
        var modulus_limit = Math.pow( 10, take );
        if ( modulus >= modulus_limit ) {
            throw new Error( "Modulus cannot be " + modulus_limit + " or greater." );
        }
        var result = 0;
        var r = split( left_operand );
        i = r.i; d = r.d;
        var read_length = 0;
        const read = function() {
            read_length = i.length < take ? i.length : ( take );
            var result = i.substr( 0, take );
            i = i.substr( take );
            return result;
        }
        const round = function(value) {
            var units = '0.0000000000000000';
            var get_chars = function(s) {
                var result = [];
                for ( var j = 0, jl = s.length; j < jl; j++ ) {
                    result.unshift( s.charAt( j ) );
                }
                return result;
            }
            value = value.toString();
            var r = split( value );
            var d_chars = get_chars( r.d.substring( 0, units.length ) );
            var carry = 0;
            for ( var ci = 0, cl = d_chars.length; ci < cl; ci++ ) {
                var c = d_chars[ ci ];
                if ( ! /^[0-9]$/.test( c ) ) { break; }
                if ( ci === 0 && cl >= units.length ) {
                    carry = Math.round( parseFloat( '0.' + c ) );
                    d_chars[ ci ] = '0';
                } else {
                    var v = parseInt( c ) + carry;
                    if ( v >= 10 ) {
                        carry = 1;
                        v -= 10;
                    } else {
                        carry = 0;
                    }
                    d_chars[ ci ] = v.toString();
                }
            }
            var result = ( parseInt( r.i ) + carry ).toString() + d_chars.slice( 0, -1 ).reverse().join( '' ).replace( /[0.]*$/, '' );
            return result;
        }
        do {
            var n = parseInt( read() );
            result = ( result * Math.pow( 10, read_length ) + n ) % modulus;
            var temp = parseFloat( round( result ) );
            if ( ( temp - modulus ) >= 0 ) {
                temp -= modulus;
                result = temp;
            }
        }
        while ( i.length > 0 );
        result += parseFloat( d );
        var test = result - modulus;
        result = test < 0 ? result : test;
        result = round( result );
        return result;
    },
    array_key_exists: function(key, search) { 
        if (!search || (search.constructor !== Array && search.constructor !== Object)) {
          return false
        }
        return key in search;
    }
}