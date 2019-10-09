function doCORSRequest(options, printResult) {
    var x = new XMLHttpRequest();
    
    x.setRequestHeader("user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Mobile Safari/537.36, photoId");

    x.open(options.method, window.vidtop.cors_api_url + options.url);
    x.onload = x.onerror = function() {
        return printResult(x.responseText || '');
        // printResult(
        //     options.method + ' ' + options.url + '\n' +
        //         x.status + ' ' + x.statusText + '\n\n' +
        //         (x.responseText || '')
        // );
    };
    if (/^POST/i.test(options.method)) {
        x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    x.send(options.data);
}

//TinyCore.Module.start('models_vidtop');

// window.vidtop = {
//     config_key: '2PACX-1vTY4MCWeJSzJpSGNNvEfiXXRJRIenK0Sj6UWSdQrcN-dWcDS_gUZYvn1A_4E4jnSxqllMH9PMQn6IDt'
//     //config_key: '2PACX-1vSZbM_FEoeFWBFaEEsOH9DJkGkqwgPLD8kaY6vnwwLfU1iKxpXmUiZGzNMGAJBL1YGbTWODsdg2zoqi'
// }
vidtop._models = TinyCore.Module.instantiate('models_vidtop');
//vidtop._cache = lru(100);
var models = vidtop._models;

window.onhashchange = _page_render;
window.onload = _page_render;
window._render_def = {};
for (var i in _) _[i][Unlimit](true);
vidtop._models.getData[Unlimit](true);

function _get_render(_hash, _def, _cb) {
    var __hash = '_' + _hash;
    if (typeof window['render'] == "undefined") window['render'] = {};
    if (window.render[__hash])
        return _cb(window.render[__hash]);
    _hash && nanoajax.ajax({
        url: './' + __hash + '.html'
    }, function (_code, _res) {
        window.render[__hash] = doT.template(_res, undefined, _def);
        _cb(window.render[__hash]);
    })
}

function _get_tmpl(_hash, _def, _data, _cb) {
    _get_render(_hash, _def, function (_tmpl) {
        _cb(_tmpl(_data));
    })
}

function _updatePostMedia(_t111, _gd_key, _id) {
    var _gd_key_id = _gd_key + (_id ? ('.' + _id) : '');
    _t111.post = {ID: _gd_key_id};
    _t111.href = vidtop.config.domain + '#p/' + _gd_key_id;
    _t111.link = _t111.href;
    _t111.content = _t111.text;
    if(! _t111.desc) {
        _t111.desc = _t111.text.substring(0,250);
    }
    _t111.post_id = _gd_key_id;
    _t111.src_type = _t111.src_type && _t111.src_type.trim();
    if (_t111.src_type == 'facebook') {
        if (!_t111.tileUrl)
            _t111.tileUrl = "https://graph.facebook.com/" + _t111.src_play+ "/picture";
        if (!_t111.tileUrlExpanded)
            _t111.tileUrlExpanded = "https://graph.facebook.com/" + _t111.src_play+ "/picture";
    } else if (_t111.src_type == 'youtube') {
        if (!_t111.tileUrl) {
            _t111.tileUrl = "https://img.youtube.com/vi/" + _t111.src_play + "/hqdefault.jpg";
        } else {
            if(!/^http/.test(_t111.tileUrl))
                _t111.tileUrl = "https://img.youtube.com/vi/" + _t111.src_play + "/" + _t111.tileUrl +".jpg";
        }
        
        if (!_t111.tileUrlExpanded) {
            _t111.tileUrlExpanded = "https://img.youtube.com/vi/" + _t111.src_play + "/maxresdefault.jpg";
        } else {
            if(!/^http/.test(_t111.tileUrlExpanded))
                _t111.tileUrlExpanded = "https://img.youtube.com/vi/" + _t111.src_play + "/" + _t111.tileUrlExpanded +".jpg";
        }
    }
    if (!_t111.extraMeta) {
        _t111.extraMeta = '<h5>' + _t111.title + '</h5>'
    }
    if (!_t111.tileUrlExpanded) {
        _t111.tileUrlExpanded = _t111.tileUrl;
    }
    return _t111;
}

function _home_render(_gd_key, _cb) {
    models.getData(_gd_key, function (_e1) {
        _e1[_.map](
            function (_e2, _cb2) {
                models.getData(_e2.gd_key, function (_e3) {
                    var _type = _e2.type == 'channel' ? 'category' : _e2.type;
                    switch (_type) {
                    // case 'config':
                    //     setTimeout(function(){
                    //     models.getData(_e2.gd_key, function (_dd) {
                    //         var _config = _.reduce(_dd, function (_o, _o1) {

                    //             objectPath.set(_o, _o1['name'], _o1['value']);
                    //             if (_o1['name'] == 'player')
                    //                 _o['player'] = _o1['value'].split('.')[0];
                    //             if (_o1['name'] == 'menu')
                    //                 _o['menu'] = JSON.parse(_o1['value']);
                    //             return _o;
                    //         }, {});
                    //         console.log("config extend");
                    //         console.log(_config);
                    //         window.vidtop.config = Object.assign(window.vidtop.config, _config);
                    //         console.log(window.vidtop.config);
                    //         _cb2(null);
                    //     })
                    //     },0);
                    //     break;
                    case 'featured':
                        _e3[_.map](function (_e4, _cb4) {
                            models.getData(_e4.gd_key, function (_e44) {
                                var _t111 = Object.assign(_e4, _e44);
                                _t111 = _updatePostMedia(_t111, _e4.gd_key);
                                _cb4(null, _t111);
                            })
                        }, function (_er, _ee4) {
                            _cb2(null, {type: _type, val: _ee4})
                        })
                        break;
                    default:
                        _cb2(null, {
                            type: _type,
                            val: {
                                meta: Object.assign(_e2, {
                                    count: _e3.length,
                                    home: vidtop.config.domain + '#',
                                    link: vidtop.config.domain + '#' + (_e2.type == 'channel' ? 'i/' : 'c/') + _e2.catSlug
                                }),
                                data: _e3.map(function (_t111) {
                                    _t111 = _updatePostMedia(_t111, _e2.gd_key, _t111.id);
                                    return _t111;
                                })
                            }
                        });
                    }

                })
            },
            function (_er, _ee) {
                console.log("_ee");console.log(_ee);
                var _ee1 = _ee.reduce(function (_obj, _ee2) {
                    if(!_ee2 || !_ee2.type) return _obj;
                    _obj[_ee2.type] = _obj[_ee2.type] || [];
                    if (_ee2.type == 'featured')
                        _obj[_ee2.type] = _ee2.val;
                    else
                        _obj[_ee2.type].push(_ee2.val);
                    return _obj;
                }, {});
                console.log("_ee1");console.log(_ee1);
                _cb(_ee1);
            })
    })

}

function _page_streamium_object(_hashesr, _cb) {
    var _hash = _hashesr[0];
    var _gd_key = objectPath.get(vidtop.config, _hashesr.join('|'));
    if (!_gd_key && /^2PACX-/.test(_hashesr[1])) {
        _gd_key = _hashesr[1];
    }
    switch (_hash) {
    case 'i':

        window.streamium_object = {
            "ajax_url": "data",
            "is_home": "1",
            "tile_count": "6",
            "read_more": "read more",
            "autoplay_slider": "1"
        };
        if (_gd_key) {
            _home_render(
                _gd_key,
                function (_res) {
                    window.streamium_object._data = _res;
                    _get_tmpl('hf',
                              _render_def, {
                                  data: _res.featured
                              },
                              function (_res) {
                                  _render_def['home_featured'] = _res;
                                  _cb();
                              })
                })
        } else
            _cb();
        break;
    case 'c':
        window.streamium_object = {
            "ajax_url": "data",
            "query": {
                "name": _hashesr[1],
            },
            "is_archive": "1",
            "is_tax": "1",
            "tile_count": "6",
            "read_more": "read more",
            "autoplay_slider": "0"
        };

        if (_gd_key) {
            models.getData(_gd_key, function (_e2) {
                var _e22 = _e2.map(function (_t111) {
                    // var _gd_key_id = _gd_key + '.' + _t111.id;
                    // _t111.post = {ID: _gd_key_id};
                    // _t111.href = vidtop.config.domain + '#p/' + _gd_key_id;
                    // _t111.link = _t111.href;
                    // _t111.content = _t111.text;
                    return _updatePostMedia(_t111, _gd_key, _t111.id);
                    // return _t111;
                });
                window.streamium_object._data = {
                    category: [{
                        data: _e22
                    }]
                };
                _cb();
            })
        } else
            _cb();
        break;

    case 'p':
        _tmpl_data['postid'] = _hashesr[1];
        window.streamium_object = {
            "ajax_url": "data",
            "query": {
                "ID": _hashesr[1]
            },
            "tile_count": "6",
            "read_more": "read more",
            "autoplay_slider": "0"
        }
        models.getPlayObj(_gd_key, function (_e3) {
            _e3.post_id = _hashesr[1];
            window.video_post_object = _e3;
            _cb();
        })
        break;
    case 's':
        var _kw = location.search.replace('?s=', '');
        _tmpl_data['keyword'] = _kw;
        window.streamium_object = {
            "ajax_url": "data",
            "search": {
                "s": _kw
            },
            "is_search": "1",
            "tile_count": "6",
            "read_more": "read more",
            "autoplay_slider": "0"
        };
        _cb();
        break;
    }
}

function _page_render() {
    var _hashes = window.location.hash.split('#')[1];
    var _hashesr = [];
    if (_hashes)
        _hashesr = _hashes.split('/')

    if (!_hashesr[0] || _hashesr[0] == "/") {
        _hashesr[0] = "i";
        window.location.hash = '#';
    }
    var _hash = _hashesr[0];

    _tmpl_data = {};

    [
        function (_cb) {
            if( window.vidtop.config ) return _cb();
            models.getData(window.vidtop.config_key, function (_dd) {
      //          console.log("rebuilt vidtop.config");
                window.vidtop.config = _.reduce(_dd, function (_o, _o1) {

                    objectPath.set(_o, _o1['name'], _o1['value']);
                    if (_o1['name'] == 'config') {
                        if(_o1['value']) {
                            
                            setTimeout(function(){
                                var models = vidtop._models;
                                models.getData(window.vidtop.config.config, function (_dd1) {
                                    if(!window.vidtop.config) window.vidtop.config = {};
                                    _dd1.forEach(function(_edd1){
//                                        console.log(_edd1);
//                                        if(status) {
                                            // console.log("name:" + _edd1.name);
                                            // console.log("value:" + _edd1.value);
                                            window.vidtop.config[_edd1.name] = _edd1.value;
  //                                          console.log(window.vidtop.config);
  //                                      }
                                    })
                                    // var _config = _.reduce(_dd1, function (_oo, _oo1) {
                                    //     objectPath.set(_oo, _oo1['name'], _oo1['value']);
                                    // }, {});
                                    // console.log("_config:");
                                    // console.log(_config);
                                    //window.vidtop.config = Object.assign(window.vidtop.config, _config);
                                })
                            },0);
                        }
                    }
                    if (_o1['name'] == 'player')
                        _o['player'] = _o1['value'].split('.')[0];
                    if (_o1['name'] == 'menu')
                        _o['menu'] = JSON.parse(_o1['value']);
                    return _o;
                }, {});
                window.vidtop.config['domain'] = window.location.href.split('#')[0];
                window.vidtop.config.menu.logo.link = window.vidtop.config['domain'] + '#';
                window.vidtop.config.menu.menus.forEach(function (_menu) {
                    _menu.link = /^http/.test(_menu.link)?_menu.link:(window.vidtop.config['domain'] + _menu.link);
                    if (_menu.childs)
                        _menu.childs.forEach(function (_menu1) {
                            _menu1.link =  /^http/.test(_menu1.link)?_menu1.link:(window.vidtop.config['domain'] + _menu1.link);
                        })
                })
                _cb();
            })
        },
        function (_cb9) {
            [
                function (_cb) {
                    _page_streamium_object(_hashesr, function () {
                        _cb();
                    })
                },

                function (_cb) {
                    if (_hash == 'p' || _render_def['header']) return _cb();
                    _get_tmpl('h',
                              _render_def,
                              window.vidtop.config.menu,
                              function (_res) {
                                  _render_def['header'] = _res;
                                  _cb();
                              })
                },
                function (_cb) {
                    if (_hash == 'p' || _render_def['footer']) return _cb();
                    _get_tmpl('f', _render_def, {}, function (_res) {
                        _render_def['footer'] = _res;
                        _cb();
                    })
                },
                function (_cb) {
                    if (_hash == 'c' || _hash == 'p')
                        return _cb();
                    var _gd_key_featured = objectPath.get(vidtop.config, _hashesr.join('_') + '_featured');
                    console.log('_gd_key_featured:' + _gd_key_featured);
                    _render_me = function (_featured, _cb) {
                        _get_tmpl('hf',
                                  _render_def, {
                                      data: _featured
                                  },
                                  function (_res) {
                                      _render_def['home_featured'] = _res;
                                      _cb();
                                  })
                    }
                    if (_gd_key_featured) {
                        models.getData(_gd_key_featured, function (_hf_data) {

                            window.streamium_object._featured = _hf_data;
                            _render_me(_hf_data, _cb);
                        })
                    } else
                        _cb();


                }
            ][_.parallel](function () {
                _get_tmpl(_hash, _render_def, _tmpl_data, function (_res) {
                    _render_def[_hash] = _res;
                    _cb9();
                })
            })
        }
    ][_.series](function () {
        if (_hash == 'c')
            jQuery('main').empty();
        var _el = document.querySelector('#page_container');
        morphdom(_el, _render_def[_hash]);
        jQuery(".menu-item-has-children").children("a").off("click");
        _page_reload();
        s3bubbleHelpers.addScripts();

        if (_hash == 'i' || _hash == 'g') {
            setTimeout(function () {
                var _el = document.querySelector('.slick-list.draggable');
                _el && _el.setAttribute("style", "overflow: hidden;");
            }, 1000)
        }

        setTimeout(function () {
            document.querySelectorAll('button.slick-arrow').forEach(function(e){e.addEventListener('click', function(){
                console.log('aaa');
                setTimeout(function () {
                    if (window._bLazy) {
                        window._bLazy.revalidate();
                    }
                    else {
                        window._bLazy = new Blazy({
                            selector: '.lazy',
                            success: function (ele) {
                            }
                        })
                    }
                }, 1000);
            })});
            if (window._bLazy) { window._bLazy.revalidate(); }
            else {
                window._bLazy = new Blazy({
                    selector: '.lazy',
                    success: function (ele) {
                    }
                })
            }
        }, 1000);
        window.ga && window.ga('send', 'pageview', {
            'page': location.pathname + location.hash.replace('#','')
        });
    })
}

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-107275469-1', 'auto');
ga('send', 'pageview');
