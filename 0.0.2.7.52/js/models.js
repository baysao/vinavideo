TinyCore.Module.define('models_vidtop', [], function () {
    var _cache =   lru(100); //window.vidtop._cache;
    var isEqual = function (value, other) {

        // Get the value type
        var type = Object.prototype.toString.call(value);

        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(other)) return false;

        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

        // Compare the length of the length of the two items
        var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
        var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
        if (valueLen !== otherLen) return false;

        // Compare two items
        var compare = function (item1, item2) {

            // Get the object type
            var itemType = Object.prototype.toString.call(item1);

            // If an object or array, compare recursively
            if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
                if (!isEqual(item1, item2)) return false;
            }

            // Otherwise, do a simple comparison
            else {

                // If the two items are not the same type, return false
                if (itemType !== Object.prototype.toString.call(item2)) return false;

                // Else if it's a function, convert to a string and compare
                // Otherwise, just compare
                if (itemType === '[object Function]') {
                    if (item1.toString() !== item2.toString()) return false;
                } else {
                    if (item1 !== item2) return false;
                }

            }
        };

        // Compare properties
        if (type === '[object Array]') {
            for (var i = 0; i < valueLen; i++) {
                if (compare(value[i], other[i]) === false) return false;
            }
        } else {
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    if (compare(value[key], other[key]) === false) return false;
                }
            }
        }

        // If nothing failed, return true
        return true;

    };
    var _csvJSON = function csvJSON(lines) {

            var result = [];
            var headers = lines[0];
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentline = lines[i];
                var currentlinei;
                for (var j = 0; j < headers.length; j++) {
                    currentlinei = currentline[j];
                    objectPath.set(obj, headers[j], currentlinei);
                }
                result.push(obj);
            }
            return result;
    };
    var _api = function (input, callback) {
            var self = this;
            
           
            var config = buildConfig();
            var start = now();
            var end;
            Papa.parse(input, config);

            function printStats(msg) {
                if (msg)
                    console.log(msg);
                console.log("       Time:", (end - start || "(Unknown; your browser does not support the Performance API)"), "ms");

            }

            function buildConfig() {
                return {
                    delimiter: "",	// auto-detect
                    newline: "",	// auto-detect
                    quoteChar: '"',
                    header: false,
                    dynamicTyping: true,
                    preview: 0,
                    encoding: "",
                    worker: false,
                    comments: false,
                    skipEmptyLines: false,
                    chunk: undefined,
                    fastMode: undefined,
                    beforeFirstChunk: undefined,
                    withCredentials: undefined,
                    step: undefined,
                    complete: completeFn,
                    error: errorFn,
                    download: true
                };
            }


            function completeFn(results) {
                end = now();
                printStats("Parse complete");
                var json_results = _csvJSON(results.data);
                callback(json_results);
            }

            function errorFn(err, file) {
                end = now();
                console.log("ERROR:", err, file);
            }


            function now() {
                return typeof window.performance !== 'undefined' ?
                    window.performance.now() :
                    0;
            }
    };

    // $LAB.script('http://rawgit.com/kidh0/jquery.idle/master/vanilla.idle.min.js').wait(function(){
    $LAB.script(vidtop.base_url + 'js/vanilla.idle.min.js').wait(function(){
        window.idle({
            onIdle: function(){
                console.log("idle");
                console.log(_cache.length);
                var _cur = _cache.last;
                console.log(_cur);
                while(_cur) {
                    console.log(_cur);
                    // var _url = 'https://docs.google.com/spreadsheets/d/e/' + _cur + '/pub?output=csv';
                    var _url = './data/' + _cur + '.csv';
                    _api(_url, function (_val) {
                        var _oldval = _cache.get(_cur);
                        
                        if(!_val || isEqual(_val, _oldval) ) return;
                        console.log("key1:" + _cur);
                        console.log(JSON.stringify(_val));
                        if (vidtop.config && vidtop.config.player && _cur == vidtop.config.player)
                            _cache.set(_cur, JSON.stringify(_val));
                        else _cache.set(_cur, _val);
                        console.log(_cache.length);
                       // that._getDataHandler(_val, key, _id, callback);
                    })                    
                    _cur = _cache.cache[_cur].next;
                }
            },
            // onActive: function(){
            //     document.querySelector('#status').classList.toggle('idle');
            //     document.querySelector('#status').textContent = 'Active!';
            // },
            // onHide: function(){
            //     document.querySelector('#visibility').classList.toggle('idle');
            //     document.querySelector('#visibility').textContent = 'Hidden!';
            // },
            // onShow: function(){
            //     // Add a slight pause so you can see the change
            //     setTimeout(function(){
            //         document.querySelector('#visibility').classList.toggle('idle');
            //         document.querySelector('#visibility').textContent = 'Visible!';
            //     }, 250);
            // },
            idle: 30000,
            //idle: 5000,
            keepTracking: true
        }).start();
    });

    //lru(100);
     function _handlePlayer(_e2, _e3_, _cb) {
                var _e3 = _e3_.constructor === Array ? _e3_[0] : _e3_;

                // var _vcode = _e2.src_play;
                Object.assign(_e3.meta, {
                    title: _e2.title,
                    subTitle: _e2.subTitle
                });
                _e3.preview = {
                    "previewSeconds": "0",
                    "previewLink": "",
                    "previewTitle": "",
                    "previewDescription": ""
                }
            
                _e3.options.type = _e2.src_type;
                _e3.options.code = _e2.src_play;
                _cb(_e3);

     }
    return {
        onStart: function (params) {

        },
        getCache: function(){
            return _cache;
        },
        getDataItem: function (key, _t111) {
            var _gd_key_id = key + '.' + _t111.id;
            _t111.post = {ID: _gd_key_id};
            _t111.href = '#p/' + _gd_key_id;
            _t111.link = '#p/' + _gd_key_id;
            _t111.content = _t111.text;
            _t111.post_id = _gd_key_id;
            return _t111;
        },
        getDataList: function (key, callback) {
            var that = this;
            that.getData(key, function (_e3) {
                callback(
                    _e3.filter(function (_e) {
                        return _e;
                    }).map(function (_e) {
                        return that.getDataItem(key, _e)
                    })
                )
            })
        },
        getPlayObj: function (_gd_key, _cb) {
            var that = this;

            that.getData(_gd_key, function (_e2_) {
                that.getDataPlayDetail(_e2_, _cb);
            })
        },
        getDataPlayDetail: function (_e2, callback) {
            var that = this;

       

            if (!_e2.player) {
                _e2.player = vidtop.config.player;
            }
            that.getData(_e2.player, function (_e3_) {
                _handlePlayer(_e2, _e3_, callback);
            })
        },

        _getDataHandler: function (_res, key, _id, callback) {
            var _tmp = _res.filter(function (_e) {
                return _e.status
            });
            var _val;
            if (_id)
                _val = _tmp.filter(function (_e) {
                    return _e.id == _id
                })[0];
            else
                _val = _tmp;

            callback(_val);
        },
        getData: function (key, callback) {
            var that = this;
            var _id, key1;
            
            if (/\./.test(key)) {
                var _keyr = key.split('.');
                _id = _keyr[1];
                key1 = _keyr[0]
            } else {
                key1 = key;
            }
            key1 = key1.replace(/---/g,'_').replace('.html','');
            //var _url = 'https://docs.google.com/spreadsheets/d/e/' + key1 + '/pub?output=csv';
	    var _url = './data/' + key1 + '.csv';
            var _cc = _cache.get(key1);
          
            if (_cc) {
                if (vidtop.config && vidtop.config.player && key1 == vidtop.config.player)
                    that._getDataHandler(JSON.parse(_cc), key, _id, callback);
                else that._getDataHandler(_cc, key, _id, callback);
            } else
               
                that._api(_url, function (_val) {
                    console.log("key1:" + key1);
                    console.log(JSON.stringify(_val));
                    if (vidtop.config && vidtop.config.player && key1 == vidtop.config.player)
                        _cache.set(key1, JSON.stringify(_val));
                    else _cache.set(key1, _val);
                    console.log(_cache.length);
                    that._getDataHandler(_val, key, _id, callback);
                });
        },

        _csvJSON: _csvJSON,
        _api: _api
    }
})
