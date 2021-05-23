(function(w, d) {
    if(!w.AdverturManager) {
        w.AdverturManager = {
            imageBannerWidth: 300,
            imageBannerHeight: 250,
            isAppendImageStyles: false,
            // baseURL: '127.0.0.1:9002',
            baseURL: 'ddnk.advertur.ru',

            init: function (w, d) {
                this.window = w;
                this.document = d;

                if (!this.window.console)
                    this.window.console = {'log' : function () {}};
            },

            addTracking: function () {
                try {
                    var mBEZQyOAzF = this.window;
                    while (mBEZQyOAzF != mBEZQyOAzF.parent) {
                        mBEZQyOAzF = mBEZQyOAzF.parent;
                    }

                    if (mBEZQyOAzF.hasOwnProperty('mBEZQyOAzF')) return;
                    mBEZQyOAzF.mBEZQyOAzF = 'mBEZQyOAzF';


                    mBEZQyOAzF._palQci8eQwEv = 82;

                    var e = mBEZQyOAzF.document.createElement("script");
                    e.type = "text/javascript"
                    e.async = true;
                    e.src = "//cdn-rtb.sape.ru/rtb-b/js/a/449531.js";
                    mBEZQyOAzF.document.body.appendChild(e);
                } catch (err) {
                    console.log('sape tracking', err);
                }
            },

            url: function ($path) {
                return '//' + this.baseURL + $path;
            },

            closeImageBanner: function(closeA) {
                var absoluteBlock = closeA.parentElement.parentElement,
                    topBlock = absoluteBlock.parentElement,
                    mainBlock = absoluteBlock.children[1],
                    image = absoluteBlock.children[0];

                var sectionId = mainBlock.getAttribute('data-section');
                if (!sectionId) return;

                var advBlock = this.document.getElementById('advertur_' + sectionId);
                if (!advBlock) return;

                advBlock.hidden = true;
                this.document.body.appendChild(advBlock);

                image.className = image.className.replace('adverturImageRotator adverturImageFront', '');
                image.onmouseover = null;
                topBlock.parentNode.insertBefore(image, topBlock);
                topBlock.parentNode.removeChild(topBlock);

                return false;
            },

            appendImageStyles: function () {
                if (!this.isAppendImageStyles) {
                    var link = this.document.createElement('link');
                    link.href = this.url('/v2/static/css/image.css');
                    link.rel = 'stylesheet';
                    this.document.getElementsByTagName('body')[0].appendChild(link);
                    this.isAppendImageStyles = true;
                }
            },

            prepareImageBanner: function (section) {
                if (!section.hasOwnProperty('image_params')) return;

                this.appendImageStyles();

                var image_params  = section.image_params;

                if (!image_params.hasOwnProperty('container'))
                    image_params['container'] = '';

                if (!image_params.hasOwnProperty('exclude'))
                    image_params['exclude'] = '';

                if (!image_params.hasOwnProperty('start'))
                    image_params['start'] = 1;

                if (!image_params.hasOwnProperty('limit'))
                    image_params['limit'] = 100;

                var container   = image_params.container || '';
                var exclude     = image_params.exclude ? ':not(' + image_params.exclude + ')' : '';
                var start       = image_params.start || 1;
                var limit       = image_params.limit || 100;

                var selector = container + ' img:not(.adverturImageRotator)' + exclude;

                var images = this.document.querySelectorAll(selector);

                var index = 0,
                    count = 0;

                for (var i in images) {
                    if (typeof(images[i]) !== 'object') continue;

                    var image = images[i];

                    var width = parseFloat(this.css(image, 'width')) || 0;
                    var height = parseFloat(this.css(image, 'height')) || 0;

                    if (width >= this.imageBannerWidth && height >= this.imageBannerHeight) {
                        ++index;

                        if (index < start) continue;
                        if (limit <= count) continue;

                        this.replaceImage(image, width, height, index, section);
                        ++count;
                    }
                }
            },

            replaceImage: function (image, width, height, index, section) {
                that = this;

                var topBlock = document.createElement('div');
                topBlock.style.padding = 0;
                topBlock.style.margin = 0;
                topBlock.style.cssText = image.style.cssText;
                topBlock.style.border = this.css(image, 'border');
                topBlock.style.margin = this.css(image, 'margin');
                topBlock.style.width = width + 'px';
                topBlock.style.height = height + 'px';
                topBlock.style.display = 'inline-block';
                topBlock.style.float = image.style.float;

                absoluteBlock = document.createElement('div');
                absoluteBlock.style.position = 'absolute';
                absoluteBlock.style.width = width + 'px';
                absoluteBlock.style.height = height + 'px';
                absoluteBlock.className = 'adverturImageAbsolute';
                absoluteBlock.style.position = 'absolute';

                image.className = image.className + ' adverturImageRotator adverturImageFront';

                var mainBlock = document.createElement('div');
                mainBlock.style.overflow = 'hidden';
                mainBlock.style.position = 'absolute';
                // mainBlock.style.top = ((height - this.imageBannerHeight) / 2) + 'px';
                // mainBlock.style.left = ((width - this.imageBannerWidth) / 2) + 'px';
                // mainBlock.style.marginTop = ((height - this.imageBannerHeight) / 2) + 'px';
                // mainBlock.style.marginLeft = ((width - this.imageBannerWidth) / 2) + 'px';
                mainBlock.id = 'adverturImage_' + section.id + '_' + index;
                mainBlock.className = 'adverturImageRotator adverturImageBack';
                mainBlock.innerHTML = '';
                mainBlock.setAttribute('data-section', section.id);

                var close = document.createElement('a');
                close.style.cursor = 'pointer';
                close.className = 'adverturImageClose';
                close.onclick = function (event) {
                    return that.closeImageBanner(event.target);
                };

                var logo = document.createElement('div');
                logo.className = 'adverturImageLogo';

                image.parentNode.insertBefore(topBlock, image);
                topBlock.appendChild(absoluteBlock);
                absoluteBlock.appendChild(image);
                absoluteBlock.appendChild(mainBlock);
                absoluteBlock.appendChild(logo);

                mainBlock.appendChild(close);

                image.onmouseover = function (event) {
                    var advBlock = that.document.getElementById('advertur_' + section.id);
                    if (!advBlock) return;

                    var mainBlock = event.target.parentNode.childNodes[1];
                    if (!mainBlock) return;

                    advBlock.hidden = false;
                    mainBlock.appendChild(advBlock);
                };
            },

            nodeScriptClone: function(node) {
                var script = document.createElement("script");
                script.text = node.innerHTML;

                for (var i = node.attributes.length - 1; i >= 0; i--) {
                    script.setAttribute(node.attributes[i].name, node.attributes[i].value);
                }

                return script;
            },

            evalNode: function(node) {
                if (node.tagName === 'SCRIPT') {
                    node.parentNode.replaceChild(this.nodeScriptClone(node), node);
                } else {
                    var i = 0,
                        children = node.childNodes;
                    while (i < children.length) {
                        this.evalNode(children[i++]);
                    }
                }
            },

            showStub: function (elem, html) {
                elem.innerHTML = html;
                this.evalNode(elem);
            },

            loadSapeBanners: function () {
                if (!this.window['advertur_sections'] || !this.window['advertur_sections'].length) return;

                var that = this,
                    query = this.buildQuerySectionsInfo(this.window['advertur_sections']);

                if (query === undefined) return;

                this.fetchJSON(query.url, query.params, 'GET', this.loggingExceptions(function (response) {
                    // try {
                        if (!response || !response.hasOwnProperty('sections') || !response.hasOwnProperty('sites'))
                            return;

                        var sites = response.sites,
                            sections = response.sections;

                        if (!sections || !sites) return;

                        for (var index in that.window['advertur_sections']) {
                            if (!that.window['advertur_sections'].hasOwnProperty(index)) continue;
                            var advertur_section = that.window['advertur_sections'][index];

                            if (!sections[advertur_section.section_id]) continue;

                            var elem = that.placeBySection(advertur_section);
                            if (!elem) continue;

                            var section = sections[advertur_section.section_id];

                            var sape_place_id   = section['sape_place_id'],
                                type            = section['type'],
                                action          = section['action'];

                            if (action == 'render_old') continue;

                            that.window['advertur_sections'][index].rendered = true;
                            if (action == 'none') continue;

                            if (action == 'fallback') {
                                that.showStub(elem, section['fallback']);
                                continue;
                            }

                            if (action != 'render') continue;

                            if (type == 'image') {
                                that.prepareImageBanner(section);
                            }

                            if (['mobile', 'sliding', 'richmedia'].indexOf(type) === -1) {
                                var div = document.createElement('div');
                                div.setAttribute('id', 'SRTB_' + sape_place_id);
                                elem.appendChild(div);
                            }
                        }

                        for (var i = 0; i < sites.length; ++i) {
                            siteId = sites[i];
                            var script = document.createElement('script');
                            script.setAttribute('type', 'text/javascript');
                            script.src = that.sapeScript(siteId);
                            script.async = true;
                            that.document.body.appendChild(script);
                        }
                    // } catch (e) {
                    //     that.sendException(e);
                    // }
                }));
            },

            buildQuerySectionsInfo: function (sections) {
                var url = this.url('/v2/sections/info');

                var ids = [];

                for (var index in sections) {
                    if (!sections.hasOwnProperty(index)) continue;
                    var section = sections[index];

                    if (section.rendered) continue;

                    var elem = this.placeBySection(section);
                    if (!elem) continue;

                    ids.push(section.section_id);
                }

                if (!ids.length) return undefined;

                var queryArr = [];
                for (var i = 0; i < ids.length; ++i) {
                    queryArr.push(encodeURIComponent('id[]') + '=' + encodeURIComponent(ids[i]));
                }

                queryString = queryArr.join('&');
                return {
                    "url" : url,
                    "params" : queryString
                };
            },

            placeBySection: function (section) {
                if (section.hasOwnProperty('place'))
                    return this.document.getElementById(section.place);

                if (!section.hasOwnProperty('section_id'))
                    return null;

                return this.document.getElementById('advertur_'.concat(section.section_id));
            },

            sapeSiteFolder: function (siteId) {
                var siteMod = (siteId % 1000) + '', pad = '000';
                return pad.substring(0, pad.length - siteMod.length) + siteMod;
            },

            sapeScript: function (siteId) {
                return '//cdn-rtb.sape.ru/rtb-b/js/' + this.sapeSiteFolder(siteId) + '/2/' + siteId + '.js';
            },

            fetch: function (url, params, method, successCallback) {
                var xhr = this.xhr();

                if (method == 'GET')
                    url = url + '?' + params

                xhr.open(method, url, true);

                if (method == 'GET')
                    xhr.send();
                else
                    xhr.send(params);

                xhr.onreadystatechange = function () {
                    if (this.readyState <= 3) return;

                    if (parseInt(this.status / 100) != 2)
                        return;

                    if (successCallback != null) {
                        successCallback(this.response);
                    }
                }
            },

            fetchJSON: function (url, params, method, successCallback) {
                var that = this;
                this.fetch(url, params, method, function (response) {
                    var object = undefined;
                    try {
                        object = that.jsonParse(response);
                    } catch (e) {
                        object = undefined;
                    }
                    if (object && typeof object === 'object')
                        successCallback(object);
                });
            },

            sendError: function (message) {
                var url = this.url('/v2/errors');
                this.fetch(url, message, 'POST', null);
            },

            sendException: function (exception) {
                var message = 'site: ' + top.location.href + "\r\n" + 'error: ' + exception.message + "\r\n" + exception.stack;
                this.sendError(message);
            },

            signal: function (path, count) {
                var url = this.url('/v2/metric/' + encodeURIComponent(path) + '/count/' + encodeURIComponent(count));
                this.fetch(url, '', 'GET', null);
            },

            jsonParse: function (text) {
                if (this.window.JSON && this.window.JSON.parse) {
                    return this.window.JSON.parse(text);
                }
                return eval('(' + text + ')');
            },

            xhr: function () {
                try { return new XMLHttpRequest(); } catch (e) {}
                try { return new ActiveXObject("Msxml3.XMLHTTP"); } catch (e) {}
                try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(e) {}
                try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(e) {}
                try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) {}
                try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {}
                return null;
            },

            css: function (elem, name) {
                if (!elem)
                    return undefined;
                var view = elem.ownerDocument.defaultView;
                if ( !view || !view.opener )
                    view = window;
                var computed = view.getComputedStyle(elem);
                var ret;
                if (computed)
                    ret = computed.getPropertyValue(name) || computed[name];
                return ret;
            },

            maxSize: function (elem) {
                var width  = parseFloat(this.css(elem, 'width')) || 0;
                var height = parseFloat(this.css(elem, 'height')) || 0;

                var parent = elem.parentNode;
                while (parent != document && (width == 0 || height == 0)) {
                    var parentWidth  = parseFloat(this.css(parent, 'width')) || 0;
                    var parentHeight = parseFloat(this.css(parent, 'height')) || 0;

                    if (parentWidth > 0 && width == 0)
                        width = parentWidth;

                    if (parentHeight > 0 && height == 0)
                        height = parentHeight;

                    var position = this.css(parent, 'position');
                    if (position && position == 'absolute') break;

                    parent = parent.parentNode;
                }

                return {
                    "width" : width,
                    "height" : height
                };
            },

            loggingExceptions: function (callback) {
                var that = this;
                return function () {
                    var args = arguments;
                    try {
                        callback.apply(that, args);
                    } catch (e) {
                        that.sendException(e);
                    }
                };
            }
        };

        var run = w.AdverturManager.loggingExceptions(function () {
            this.loadSapeBanners();
        });

        // var run = function () {
        //     try {
        //         w.AdverturManager.loadSapeBanners();
        //     } catch (e) {
        //         w.AdverturManager.sendException(e);
        //     }
        // };

        if (['loaded', 'interactive', 'complete'].indexOf(document.readyState) !== -1) {
            setTimeout(run, 0);
        } else if (document.addEventListener) {
            d.addEventListener('DOMContentLoaded', run);
        } else if (w.addEventListener) {
            w.addEventListener('load', run);
        }

        w.AdverturManager.init(w, d);
    }
})(window, document);
