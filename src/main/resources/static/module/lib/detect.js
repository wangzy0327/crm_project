var OSTool = OSTool || {};
var city;
OSTool.Exp_USERAGENT = {
    //browser
    MSIE : /(msie) ([\w.]+)/,
    MOZILLA : /(mozilla)(?:.*? rv:([\w.]+)|)/,
    SAFARI : /(safari)(?:.*version|)[\/]([\d.]+)/,
    CHROME : /(chrome|crios)[\/](?:.*version|)([\w.]+)/,
    OPERA : /(opera|opr)(?:.*version|)[\/]([\w.]+)/,
    FIREFOX : /(firefox)(?:.*version|)[\/]([\w.]+)/,
    WEBOS : /(webos|hpwos)[\s\/]([\d.]+)/,
    DOLFIN : /(dolfin)(?:.*version|)[\/]([\w.]+)/, //
    SILK : /(silk)(?:.*version|)[\/]([\w.]+)/, //
    UC : /(uc)browser(?:.*version|)[\/]([\w.]+)/, //UC浏览器
    TAOBAO : /(tao|taobao)browser(?:.*version|)[\/]([\w.]+)/,
    LIEBAO : /(lb)browser(?:.*? rv:([\w.]+)|)/,
    //AMAYA:/(amaya)[\/]([\w.]+)/,
    //SEAMONKEY:/(seamonkey)[\/]([\w.]+)/,
    //OMNIWEB:/(omniweb)[\/]v([\w.]+)/,
    //FLOCK:/(flock)[\/]([\w.]+)/,
    //EPIPHANY:/(epiphany)[\/]([\w.]+)/,
    MicroMessenger :/(micromessenger)(?:.*version|)[\/]([\w.]+)/,//微信浏览器
    QQ:/(mqqbrowser|qzone|qqbrowser)(?:.*version|)[\/]([\w.]+)/,//QQ浏览器

    //engine
    WEBKIT : /webkit[\/]([\w.]+)/,//苹果、谷歌内核
    GECKO : /gecko[\/]([\w.]+)/,//火狐内核
    PRESTO : /presto[\/]([\w.]+)/,//opera内核
    TRIDENT : /trident[\/]([\w.]+)/,//IE内核

    //device
    MAC : /(mac os x)\s+([\w_]+)/, //
    WINNDOWS : /(windows nt)\s+([\w.]+)/, //
    LINUX : /linux/, //
    //IOS : /i(?:pad|phone|pod)(?:.*)cpu(?: iphone)? os/,
    IOS : /(i(?:pad|phone|pod))(?:.*)cpu(?: i(?:pad|phone|pod))? os (\d+(?:[\.|_]\d+){1,})/,
    ANDROID : /(android)\s+([\d.]+)/,
    WINDOWSPHONE : /windowsphone/, //
    IPAD : /(ipad).*os\s([\d_]+)/,
    IPHONE : /(iphone\sos)\s([\d_]+)/,
    IPOD : /(ipod)(?:.*)cpu(?: iphone)? os (\d+(?:[\.|_]\d+){1,})/,
    TOUCHPAD : /touchpad/,
    BLACKBERRY : /(playbook|blackberry|bb\d+).*version\/([\d.]+)/,
    RIMTABLET : /rimtablet/, //
    BADA : /bada/, //
    CHROMEOS : /cromeos///
};
OSTool.detectOS = function(ua){
    var os = {},
    //browser
        chrome = ua.match(OSTool.Exp_USERAGENT.CHROME),
        opera = ua.match(OSTool.Exp_USERAGENT.OPERA),
        firefox = ua.match(OSTool.Exp_USERAGENT.FIREFOX),
        msie = ua.match(OSTool.Exp_USERAGENT.MSIE),
        safari = (ua + ua.replace(OSTool.Exp_USERAGENT.SAFARI, ' ')).match(OSTool.Exp_USERAGENT.SAFARI), //modify the jquery bug
        mozilla = ua.match(OSTool.Exp_USERAGENT.MOZILLA),
        webos = ua.match(OSTool.Exp_USERAGENT.WEBOS),
        dolphi = ua.match(OSTool.Exp_USERAGENT.DOLFIN),
        silk = ua.match(OSTool.Exp_USERAGENT.SILK),
        uc = ua.match(OSTool.Exp_USERAGENT.UC),
        taobao=ua.match(OSTool.Exp_USERAGENT.TAOBAO),
        liebao=ua.match(OSTool.Exp_USERAGENT.LIEBAO),
        micromessage = ua.match(OSTool.Exp_USERAGENT.MicroMessenger),
        qq=ua.match(OSTool.Exp_USERAGENT.QQ),

    //engine
        webkit = ua.match(OSTool.Exp_USERAGENT.WEBKIT),
        gecko = ua.match(OSTool.Exp_USERAGENT.GECKO),
        presto = ua.match(OSTool.Exp_USERAGENT.PRESTO),
        trident = ua.match(OSTool.Exp_USERAGENT.TRIDENT),

    //device
        mac = ua.match(OSTool.Exp_USERAGENT.MAC),
        windows = ua.match(OSTool.Exp_USERAGENT.WINNDOWS),
        linux = ua.match(OSTool.Exp_USERAGENT.LINUX),
        chromeos = ua.match(OSTool.Exp_USERAGENT.CHROMEOS),

    //pad
        ipad = ua.match(OSTool.Exp_USERAGENT.IPAD),
        rimtablet = ua.match(OSTool.Exp_USERAGENT.RIMTABLET),
        touchpad = webos && ua.match(OSTool.Exp_USERAGENT.TOUCHPAD),

    //mobile
        ios = ua.match(OSTool.Exp_USERAGENT.IOS),
        ipod = ua.match(OSTool.Exp_USERAGENT.IPOD),
        iphone = !ipad && ua.match(OSTool.Exp_USERAGENT.IPHONE),
        android = ua.match(OSTool.Exp_USERAGENT.ANDROID),
        windowsphone = ua.match(OSTool.Exp_USERAGENT.WINDOWSPHONE),
        blackberry = ua.match(OSTool.Exp_USERAGENT.BLACKBERRY),
        bada = ua.match(OSTool.Exp_USERAGENT.BADA);


    //engine
    os.engine = {};
    if (webkit)
        os.engine = 'webkit';
    if (gecko)
        os.engine = 'gecko';
    if (presto)
        os.engine = 'presto';
    if (trident)
        os.engine = 'trident';
    //device
    if (mac)
        os.deviceName = 'mac os', os.deviceVersion = mac[2];
    if (windows)
        os.deviceName = 'windows', os.deviceVersion = windows[2];
    if (linux)
        os.deviceName = 'linux',os.deviceVersion = ''; //
    if (chromeos)
        os.deviceName = 'chromeos', os.deviceVersion = chromeos[2];
    if (android)
        os.deviceName = 'android', os.deviceVersion = android[2];
    if (iphone)
        os.deviceName = 'iphone',os.deviceVersion = iphone[2].replace(/_/g, '.');
    if (ipod)
        os.deviceName = 'ipod',os.deviceVersion = ipod[2].replace(/_/g, '.');
    if (ipad)
        os.deviceName = 'ipad', os.deviceVersion = ipad[2].replace(/_/g, '.');
    if (webos)
        os.deviceName = 'webos',os.deviceVersion = webos[2];
    if (blackberry)
        os.deviceName = 'blackberry', os.deviceVersion = blackberry[2];
    if (bada)
        os.deviceName = 'bada',os.deviceVersion = ''; //
    if (rimtablet)
        os.deviceName = 'rimtablet', os.deviceVersion = ''; //
    if (touchpad)
        os.deviceName = 'touchpad',os.deviceVersion = ''; //

    if (!(android || iphone || ipad || ipod || webos || blackberry || bada || rimtablet || touchpad)){
        os.type = 'desktop';
        var version = os.deviceVersion;
        if(os.deviceName == 'windows' && version){
            if(parseFloat(version) == parseFloat(5.0) || ua.indexOf("windows 2000") > -1){
                os.deviceVersion = '2000';
            }else if(parseFloat(version) == parseFloat(5.1) || ua.indexOf("windows xp") > -1){
                os.deviceVersion = 'XP';
            }else if(parseFloat(version) == parseFloat(5.2) || ua.indexOf("windows 2003") > -1){
                os.deviceVersion = '2003';
            }else if(parseFloat(version) == parseFloat(6.0) || ua.indexOf("windows vista") > -1){
                os.deviceVersion = 'Vista';
            }else if(parseFloat(version) == parseFloat(6.1) || ua.indexOf("windows 7") > -1){
                os.deviceVersion = '7';
            }else if(parseFloat(version) == parseFloat(6.2) || ua.indexOf("windows 8") > -1){
                os.deviceVersion = '8';
            }else if(parseFloat(version) == parseFloat(10.0) || ua.indexOf("windows 10") > -1){
                os.deviceVersion = '10';
            }else{
                os.deviceVersion = '';
            }
            var is64 = (ua.indexOf("wow64") > -1 || ua.indexOf('win64') > -1 || ua.indexOf('x64') > -1);
            if (is64) {
                os.deviceVersion += " 64-bit";
            }else{
                os.deviceVersion += " 32-bit";
            }
        }
    }

    //browser
    var match = dolphi || silk || micromessage || qq || uc || msie || taobao || liebao || opera || chrome || firefox || safari || (ua.indexOf('compatible') < 0 && mozilla);
    os.browserName = match[1];
    os.browserVersion = match[2]||'';
    //major
    os.browserVersion && (os.major = parseInt(os.browserVersion,10) || '');

    //safari
    if ((os.deviceName == 'iphone' ||
        os.deviceName == 'ipod' ||
        os.deviceName == 'ipad') &&
        os.engine == 'webkit' &&
        os.type != 'desktop') {
        try{
            os.safari = (window.canSetSearchEngine || window.TrackEvent) ? true : false;
        }catch(e){}
        os.major && (os.major = os.major || parseInt(os['device-version'],10) || '');
    }
    //ie
    if(os.engine == 'trident'){
        os.browserName='msie';

    }
    //blackberry
    if(os.browserName == 'blackberry'){

    }
    delete os.mozilla;
    delete os.safari;
    try{
        os.orientation = (window.orientation === 180 || window.orientation === 0) ? '1' : '0';
    }catch(e){}
    if(os.type != 'desktop'){
        os.type='mobile';
    }

    return os;
};
OSTool.baiduCallback = function(data){
    pointX = data.content.point.x;
    pointY = data.content.point.y;
    city = data.content.address;
};
OSTool.detectIP = function(callback){
    if(callback){
        var allTime = 0;
        var getLoaction = 0;
        var defaultLoation = {
            province : '',
            city : '',
            district :  '',
            street : '',
            streetNumber : ''
        };

        //百度获取位置
        /*new BMap.Geolocation().getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    if(r.accuracy != null){
                        new BMap.Geocoder().getLocation(new BMap.Point(r.point.lng,r.point.lat), function (rs) {
                            getLoaction = {
                                province : rs.addressComponents.province || '',
                                city : rs.addressComponents.city || '',
                                district : rs.addressComponents.district || '',
                                street : rs.addressComponents.street || '',
                                streetNumber : rs.addressComponents.streetNumber || ''
                            };
                        });
                    }else{
                        getLoaction = defaultLoation;
                    }
                }else{
                    getLoaction = defaultLoation;
                }
            },
            function(){
                getLoaction = defaultLoation;
            }
        );*/
        getLoaction = defaultLoation;
        var script1 = document.createElement("script");
        script1.src = "http://pv.sohu.com/cityjson?ie=utf-8";
        document.head.insertBefore(script1, document.head.firstChild);
        var _script = document.createElement('script');
        _script.type = "text/javascript";
        _key = "55UbnVOR7XovezZC4jFvTqNDPAamsuoo";//百度地图可以申请到
        _script.src = "http://api.map.baidu.com/location/ip?ak="+_key+"&coor=bd09ll&ip&callback=OSTool.baiduCallback";//拼接URL
        document.head.appendChild(_script);
        function returnCBK(){
            callback({
                ip:returnCitySN.cip || '',
                cid:returnCitySN.cid || '',
                city:city || '',
                location:JSON.stringify(getLoaction || {})
            });
        }
        var timer_ip = window.setInterval(function(){
            allTime += 100;
            if(allTime >= 3000){
                window.clearInterval(timer_ip);
                if((typeof(returnCitySN) != "undefined" && typeof(city) != "undefined")|| getLoaction != 0){
                    returnCBK();
                }else{
                    callback('none');
                }
                return false;
            }
            if(typeof(returnCitySN) != "undefined" && getLoaction != 0){
                window.clearInterval(timer_ip);
                returnCBK();
                return false;
            }
        },100);
    }
};