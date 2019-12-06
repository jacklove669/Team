function slider(e) {
    this.pageNum = e.pageNum || 1,
    this.pageSize = e.pageSize || 1,
    this.pageCount = e.pageCount || 1,
    this.viewContent = e.parentView,
    this.viewShow = e.childView,
    this.viewWidth = ""
}
weather = {
    init: function() {
        var e = getQueryString("cityId");
        e ? weather.getWeatherInfo("", "", "", e) : weather.getLocationInfoByIp(),
        weather.bindEvent()
    },
    getLocation: function() {
        navigator.geolocation ? navigator.geolocation.getCurrentPosition(weather.showPosition, weather.errorPosition) : alert("\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u5b9a\u4f4d\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9!")
    },
    showPosition: function(e) {
        weather.showPositionByBaidu(e)
    },
    errorPosition: function(e) {
        alert("\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u5b9a\u4f4d\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9!"),
        weather.cityId = "01012507"
    },
    showPositionByBaidu: function(e, t) {
        var a = "https://api.map.baidu.com/geocoder/v2/?ak=XgNQS6ubZZoQlluTkF7gdqVOpCnFOmKC&callback=renderReverse&location=" + (e.coords.latitude + "," + e.coords.longitude) + "&output=json&pois=0";
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            url: a,
            beforeSend: function() {},
            success: function(e) {},
            error: function(e, t, a) {}
        })
    },
    getLocationInfoByIp: function() {
        $.getScript("https://api.map.baidu.com/location/ip?ak=XgNQS6ubZZoQlluTkF7gdqVOpCnFOmKC&coor=bd09ll&callback=weather.showLocation")
    },
    showLocation: function(e) {
        var t = e.content.address_detail.province,
        a = e.content.address_detail.city;
        weather.getWeatherInfo(t, a, "", "")
    },
    getWeatherInfo: function(e, t, a, i) {
        var n = encodeURI("ProcCode=2059&appId=web2&Uid=web&cityName=" + t + "&province=" + e + "&district=" + a + "&city=" + i);
        $.ajax({
            data: {
                p: n,
                output: "json"
            },
            url: "https://ext.zuimeitianqi.com/extDataServer/3.0/",
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "callback",
            error: function() {},
            success: function(e) {
                0 < e.data.length ? (weather.showWeatherInfo(e), reportStat(9999)) : alert("\u6682\u65e0\u6570\u636e,\u8bf7\u91cd\u65b0\u9009\u62e9\uff01")
            }
        },
        !1)
    },
    showWeatherInfo: function(e) {
        if (e = e.data[0]) {
            var t = weather.getClassByWea(e.actual.wea),
            a = ($(".weather-detail").height(), document.documentElement.clientWdith || document.body.clientWidth),
            i = $(window).height() + 350;
            if ($("body").width(a).height(i).removeClass().addClass(t), $("#current-city").attr("data-cityId") || $("#current-city").attr("data-cityId", e.cityCode), $(".location .name").text(e.cityName), $(".hour-top .city-name").text(e.cityName), e.forecast.length < 15 && ($(".left-arrow").hide(), $(".right-arrow").hide()), weather.showManyDayList(e), $(".weather-detail").show(), e.forecast) if (e.forecast[1].date.substring(0, 10) == (new Date).Format("yyyy-MM-dd")) {
                var n = "\u519c\u5386\uff1a" + e.forecast[1].ldt.substring(3);
                $(".wea-info .date").show().text(n)
            }
            var r = e.actual.feelT + "\xb0C";
            $(".wea-info .temp").text(r);
            var c = weather.getWeaByCode(e.actual.wea);
            if ($(".wea-info .status").text(c), e.actual.wp) {
                var o = e.actual.wp + "\u7ea7";
                $("#wind").show(),
                $("#wind span").text(o)
            }
            if (e.actual.hum) {
                var s = e.actual.hum + "%";
                $("#hum").show(),
                $("#hum span").text(s)
            }
            weather.showAirData(e),
            weather.makeHourList(e)
        }
    },
    getClassByWea: function(e) {
        var t = (new Date).Format("hh"),
        a = 18,
        i = "";
        return "0" == e ? i = a < t ? "night-fine": "day-fine": "1" == e ? i = a < t ? "night-cloudy": "day-cloudy": "2" == e ? i = a < t ? "night-overcast": "day-overcast": "4" == e || "5" == e || "6" == e || "7" == e || "8" == e || "9" == e || "10" == e || "11" == e || "12" == e | "3" == e || "19" == e || "21" == e || "22" == e || "23" == e || "24" == e || "25" == e ? i = a < t ? "night-raindy": "day-raindy": "13" == e || "14" == e || "15" == e || "16" == e || "17" == e || "26" == e || "27" == e || "28" == e ? i = a < t ? "night-snowy": "day-snowy": "18" == e || "53" == e ? i = a < t ? "night-haze": "day-haze": "20" != e && "29" != e && "30" != e && "31" != e || (i = a < t ? "night-sandy": "day-sandy"),
        i
    },
    showManyDayList: function(e) {
        if (0 < e.forecast.length) {
            var t = weather.parseForecast(e.forecast);
            console.log(t);
            for (var a = "",
            i = 0,
            n = t.length; i < n; i++) a += '<li class="' + t[i].class + '"><div class="temp-mask"></div><span class="date">' + t[i].day + '</span><span class="week">' + t[i].weekText + '</span><span class="icon"><img src="../images/' + t[i].wxDayImg + '"></span><span class="high-temp">' + t[i].highTmp + '</span><span class="segment">|</span><span class="low-temp">' + t[i].lowTmp + '</span><span class="wind-direction">' + t[i].windd + '</span><span class="wind-power">' + t[i].wp + "</span></li>";
            $(".weather-list ul").empty().append(a)
        }
        weather.forecastSlider()
    },
    parseForecast: function(e) {
        new Date;
        for (var t = {
            v: [],
            low: [],
            high: [],
            min: 9999,
            max: -9999
        },
        a = (e.length, 0); a < e.length; a++) {
            var i = e[a],
            n = i.wea,
            r = i.wp,
            c = i.wd;
            if (0 < n.indexOf("/")) {
                var o = n.split("/")[0],
                s = weather.weatherPicMap(weather.weatherMap(o));
                i.wxDayImg = s
            } else {
                o = n,
                s = weather.weatherPicMap(weather.weatherMap(n));
                i.wxDayImg = s
            }
            i.windd = weather.getWinddByCode(c),
            i.windp = weather.getWindpByCode(r),
            i.wp = i.wp + "\u7ea7";
            var h = i.date,
            p = h.split(" ")[0].split("-")[2],
            u = h.split(" ")[0].split("-")[1] + "." + p;
            i.day = u;
            var w = i.week;
            0 == a ? (i.weekText = u + " " + weather.getWeekText(w), i.day = "\u6628\u5929") : 1 == a ? (i.class = "active", i.weekText = u + " " + weather.getWeekText(w), i.day = "\u4eca\u5929") : 2 == a ? (i.weekText = u + " " + weather.getWeekText(w), i.day = "\u660e\u5929") : i.weekText = weather.getWeekText(w),
            i.highTmp = i.high + "\xb0C",
            i.lowTmp = i.low + "\xb0C",
            t.v[a] = a
        }
        return e
    },
    getWinddByCode: function(e) {
        return "0" == e ? "\u5fae\u98ce": "1" == e ? "\u4e1c\u5317\u98ce": "2" == e ? "\u4e1c\u98ce": "3" == e ? "\u4e1c\u5357\u98ce": "4" == e ? "\u5357\u98ce": "5" == e ? "\u897f\u5357\u98ce": "6" == e ? "\u897f\u98ce": "7" == e ? "\u897f\u5317\u98ce": "8" == e ? "\u5317\u98ce": "9" == e ? "\u65cb\u8f6c\u98ce": void 0
    },
    getWindpByCode: function(e) {
        return "0" == e ? "\u5fae\u98ce": "1" == e ? "\u5fae\u98ce": "2" == e ? "\u5fae\u98ce": "3" == e ? "\u5fae\u98ce": e + "\u7ea7\u98ce"
    },
    getWeekText: function(e) {
        return "1" == e ? "\u661f\u671f\u65e5": "2" == e ? "\u661f\u671f\u4e00": "3" == e ? "\u661f\u671f\u4e8c": "4" == e ? "\u661f\u671f\u4e09": "5" == e ? "\u661f\u671f\u56db": "6" == e ? "\u661f\u671f\u4e94": "7" == e ? "\u661f\u671f\u516d": void 0
    },
    weatherMap: function(e) {
        return "21" == e ? "7": "22" == e ? "8": "23" == e ? "9": "24" == e || "25" == e || "10" == e || "11" == e || "12" == e ? "10": "26" == e ? "14": "27" == e ? "15": "17" == e || "28" == e ? "16": "31" == e || "30" == e ? "30": "20" == e || "29" == e ? "20": e
    },
    showAirData: function(e) {
        if (e.air) {
            $("#aqi").show();
            var t = e.air.aqigrad;
            0 <= t.indexOf("\u4f18") ? t = "\u4f18\u8d28": 0 <= t.indexOf("\u826f") && (t = "\u826f\u597d");
            var a = e.air.aqi;
            $("#aqi-num").empty().append(a),
            $("#aqi-txt").empty().append(t),
            $(".suggestion").empty().text(e.air.suggestion)
        } else $("#aqi-num").empty(),
        $("#aqi-txt").empty(),
        $(".suggestion").empty()
    },
    makeHourList: function(e) {
        weather.hour24List(e.hours, e.actual.feelT, e.actual.wea, e.forecast)
    },
    hourSlider: function() {
        var e = new slider({
            parentView: $(".hour-list"),
            childView: $(".hour-list ul"),
            pageNum: 12,
            pageSize: 1,
            pageCount: 1
        });
        e.init(),
        $(".hour-right-arrow").click(function() {
            e.next()
        }).mouseover(function() {
            $(this).css({
                background: "#d2e9ff"
            })
        }).mouseleave(function() {
            $(this).css("background", "#e6e6e6")
        }),
        $(".hour-left-arrow").click(function() {
            e.next()
        }).mouseover(function() {
            $(this).css("background", "#d2e9ff")
        }).mouseleave(function() {
            $(this).css("background", "#e6e6e6")
        })
    },
    forecastSlider: function() {
        var e = new slider({
            parentView: $(".view-content"),
            childView: $(".weather-list"),
            pageNum: 8,
            pageSize: 1,
            pageCount: 1
        });
        e.init(),
        $(".left-arrow, .right-arrow").mouseover(function() {
            $(this).addClass("active")
        }).mouseleave(function() {
            $(this).removeClass("active")
        }),
        $(".right-arrow").click(function() {
            e.next()
        }),
        $(".left-arrow").click(function() {
            e.prev()
        })
    },
    weatherPicMap: function(e) {
        switch (e) {
        case "0":
            return "icon/ic_sunny.png";
        case "1":
            return "icon/ic_cloudy.png";
        case "2":
            return "icon/ic_overcast.png";
        case "3":
            return "icon/ic_shower.png";
        case "4":
            return "icon/ic_thundeshower.png";
        case "5":
            return "icon/ic_thundeshowerhail.png";
        case "6":
            return "icon/ic_rainsnow.png";
        case "7":
            return "icon/ic_lightrain.png";
        case "8":
            return "icon/ic_moderraterain.png";
        case "9":
            return "icon/ic_heavyrain.png";
        case "10":
            return "icon/ic_rainstorm.png";
        case "13":
            return "icon/ic_snow.png";
        case "14":
            return "icon/ic_lightsnow.png";
        case "15":
            return "icon/ic_moderatesnow.png";
        case "16":
            return "icon/ic_heavysnow.png";
        case "18":
            return "icon/ic_fog.png";
        case "19":
            return "icon/ic_sleet.png";
        case "20":
            return "icon/ic_sandstorm.png";
        case "30":
            return "icon/ic_dust.png";
        case "53":
            return "icon/ic_haze.png";
        case "-1":
            return "icon/ic_sunrise.png";
        case "-2":
            return "icon/ic_sunset.png";
        default:
            return "icon/ic_default.png"
        }
    },
    getWeaByCode: function(e) {
        var t = "";
        switch (e) {
        case "0":
            t = "\u6674",
            "icon/ic_sunny.png";
            break;
        case "1":
            t = "\u591a\u4e91",
            "icon/ic_cloudy.png";
            break;
        case "2":
            t = "\u9634",
            "icon/ic_overcast.png";
            break;
        case "3":
            t = "\u9635\u96e8",
            "icon/ic_shower.png";
            break;
        case "4":
            t = "\u96f7\u9635\u96e8",
            "icon/ic_thundeshower.png";
            break;
        case "5":
            t = "\u96f7\u9635\u96e8\u5e76\u4f34\u6709\u51b0\u96f9",
            "icon/ic_thundeshowerhail.png";
            break;
        case "6":
            t = "\u96e8\u5939\u96ea",
            "icon/ic_rainsnow.png";
            break;
        case "7":
            t = "\u5c0f\u96e8",
            "icon/ic_lightrain.png";
            break;
        case "8":
            t = "\u4e2d\u96e8",
            "icon/ic_moderraterain.png";
            break;
        case "9":
            t = "\u5927\u96e8",
            "icon/ic_heavyrain.png";
            break;
        case "10":
            t = "\u66b4\u96e8",
            "icon/ic_rainstorm.png";
            break;
        case "11":
            t = "\u5927\u66b4\u96e8",
            "icon/ic_rainstorm.png";
            break;
        case "12":
            t = "\u7279\u5927\u66b4\u96e8",
            "icon/ic_rainstorm.png";
            break;
        case "13":
            t = "\u9635\u96ea",
            "icon/ic_snow.png";
            break;
        case "14":
            t = "\u5c0f\u96ea",
            "icon/ic_lightsnow.png";
            break;
        case "15":
            t = "\u4e2d\u96ea",
            "icon/ic_moderatesnow.png";
            break;
        case "16":
            t = "\u5927\u96ea",
            "icon/ic_heavysnow.png";
            break;
        case "17":
            t = "\u66b4\u96ea",
            "icon/ic_heavysnow.png";
            break;
        case "18":
            t = "\u96fe",
            "icon/ic_fog.png";
            break;
        case "19":
            t = "\u51bb\u96e8",
            "icon/ic_sleet.png";
            break;
        case "20":
            t = "\u6c99\u5c18\u66b4",
            "icon/ic_sandstorm.png";
            break;
        case "21":
            t = "\u5c0f\u96e8-\u4e2d\u96e8";
            break;
        case "22":
            t = "\u4e2d\u96e8-\u5927\u96e8";
            break;
        case "23":
            t = "\u5927\u96e8-\u66b4\u96e8";
            break;
        case "24":
            t = "\u4e2d\u66b4\u96e8-\u5927\u66b4\u96e8";
            break;
        case "25":
            t = "\u5927\u66b4\u96e8-\u7279\u5927\u66b4\u96e8";
            break;
        case "26":
            t = "\u5c0f\u96ea-\u4e2d\u96ea";
            break;
        case "27":
            t = "\u4e2d\u96ea-\u5927\u96ea";
            break;
        case "28":
            t = "\u5927\u96ea-\u66b4\u96ea";
            break;
        case "29":
            t = "\u6d6e\u5c18";
            break;
        case "30":
            t = "\u626c\u6c99";
            break;
        case "31":
            t = "\u5f3a\u6c99\u5c18\u66b4";
            break;
        case "32":
            t = "\u98d1";
            break;
        case "33":
            t = "\u9f99\u5377\u98ce";
            break;
        case "34":
            t = "\u5f31\u9ad8\u5439\u96ea";
            break;
        case "35":
            t = "\u8f7b\u96fe";
            break;
        case "53":
            t = "\u973e"
        }
        return t
    },
    getQualtiyPic: function(e) {
        return 0 <= e && e <= 50 ? "pm/ic_pm25_01.png": 50 < e && e <= 100 ? "pm/ic_pm25_02.png": 100 < e && e <= 200 ? "pm/ic_pm25_03.png": 200 < e && e <= 300 ? "pm/ic_pm25_04.png": 300 < e && e <= 500 ? "pm/ic_pm25_05.png": "pm/ic_pm25_06.png"
    },
    searchCity: function(e) {
        var t = encodeURI("SeaCon=" + e + "&Uid=web&ProcCode=2093&SeaType=1");
        $.ajax({
            data: {
                p: t
            },
            url: "http://ext.zuimeitianqi.com/extDataServer/3.0",
            dataType: "jsonp",
            jsonp: "callback",
            success: function(e) {
                0 < e.data.length && weather.searchCityList(e.data)
            }
        },
        !1)
    },
    searchCityList: function(e) {
        for (var t = "",
        a = 0,
        i = e.length; a < i; a++) t += "<li data-cityId = " + e[a].cityCode + ">" + e[a].cityName + "</li>";
        $("#search-box ul").empty().append(t)
    },
    bindEvent: function() {
        $(".nav li").mouseover(function() {
            $(this).find("a").addClass("active"),
            $(this).find("em").show()
        }).mouseleave(function() {
            $(this).find("a").removeClass("active"),
            $(".nav li em").hide(),
            $(".nav li").eq(1).find("a").addClass("active"),
            $(".nav li").eq(1).find("em").show()
        }),
        $("#search-input").keyup(function() {
            var e = $("#search-input").val();
            0 != $.trim(e).length ? (weather.searchBoxShow(), weather.searchCity(e)) : weather.searchBoxHide()
        }),
        $("#search-box ul").on("click", "li",
        function(e) {
            weather.cityId = $(this).attr("data-cityId");
            var t = $("#current-city").attr("data-cityid");
            weather.cityId == t ? $(".location .icon").show() : $(".location .icon").hide(),
            weather.getWeatherInfo("", "", "", weather.cityId),
            weather.searchBoxHide(),
            e.stopPropagation()
        }),
        $("#search-button").click(function() {
            var e = $("#search-input").val();
            0 != $.trim(e).length ? weather.getWeatherInfo("", e, e, "") : weather.searchBoxHide()
        }),
        $("body").click(function() {
            weather.searchBoxHide()
        })
    },
    searchBoxShow: function() {
        $("#search-mask").show(),
        $("#search-box").show()
    },
    searchBoxHide: function() {
        $("#search-mask").hide(),
        $("#search-box").hide(),
        $("#search-input").val("")
    },
    hour24List: function(e, t, a, i) {
        var n = Date.now(),
        r = {
            time: n,
            tmp: t,
            wea: a,
            desc: "\u73b0\u5728"
        },
        c = i[1],
        o = new Date(c.date.split(" ")[0].replace(new RegExp("-", "gm"), "/") + " " + c.rc + ":00"),
        s = o.getTime();
        s = o.getTime();
        var h = new Date(c.date.split(" ")[0].replace(new RegExp("-", "gm"), "/") + " " + c.rl + ":00").getTime(),
        p = {
            time: s,
            tmp: "\u65e5\u51fa",
            wea: "-1"
        },
        u = {
            time: h,
            tmp: "\u65e5\u843d",
            wea: "-2"
        },
        w = i[2],
        g = {
            time: new Date(w.date.split(" ")[0].replace(new RegExp("-", "gm"), "/") + " " + w.rc + ":00").getTime(),
            tmp: "\u65e5\u51fa",
            wea: "-1"
        },
        l = {
            time: new Date(w.date.split(" ")[0].replace(new RegExp("-", "gm"), "/") + " " + w.rl + ":00").getTime(),
            tmp: "\u65e5\u843d",
            wea: "-2"
        };
        s <= n && n < h ? weather.makeHourData(e, u, g, r) : h <= n ? weather.makeHourData(e, l, g, r) : weather.makeHourData(e, u, p, r)
    },
    makeHourData: function(e, t, a, i) {
        for (var n, r, c, o = 0; o < e.length; o++) if (e[o].time > a.time) {
            r = o;
            break
        }
        e.splice(r, 0, a);
        for (o = 0; o < e.length; o++) if (e[o].time > t.time) {
            n = o;
            break
        }
        e.splice(n, 0, t);
        for (o = 0; o < e.length; o++) if (e[o].time > i.time) {
            c = o;
            break
        }
        e.splice(c, 0, i),
        weather.getHourList(e, a, t, i)
    },
    getHourList: function(e, t, a, i) { (new Date).getHours();
        for (var n = 0; n < e.length; n++) {
            var r = e[n],
            c = weather.u2d(r.time, !0, 8);
            null != r.desc || null != r.desc ? (e[n].hour = "\u5f53\u524d", e[n].class = "active") : (e[n].hour = c, e[n].class = ""),
            1 * t.time < 1 * a.time ? 1 * e[n].time >= 1 * t.time && 1 * e[n].time <= 1 * a.time ? e[n].wimg = weather.weatherPicMap(r.wea.toString()) : e[n].wimg = weather.weatherPicNigMap(r.wea.toString()) : 1 * e[n].time >= 1 * a.time && 1 * e[n].time <= 1 * t.time ? e[n].wimg = weather.weatherPicNigMap(r.wea.toString()) : e[n].wimg = weather.weatherPicMap(r.wea.toString()),
            "\u65e5\u51fa" != e[n].tmp && "\u65e5\u843d" != e[n].tmp && (e[n].tmp = e[n].tmp + "\xb0C")
        }
        if (0 < e.length) {
            $(".hour-list ul").empty();
            for (var o = "",
            s = 0; s < 24; s++) o += '<li class="' + e[s].class + '"><span class="temp">' + e[s].tmp + '</span><span class="icon"><img src="../images/' + e[s].wimg + '"></span><span class="time">' + e[s].hour + "</span></li>";
            $(".hour-list ul").append(o),
            weather.hourSlider()
        }
    },
    weatherPicNigMap: function(e) {
        return "0" == e ? "icon/ic_nightsunny.png": "1" == e || "2" == e ? "icon/ic_nightcloudy.png": "3" == e || "7" == e || "8" == e || "9" == e || "10" == e || "11" == e || "12" == e || "21" == e || "22" == e || "23" == e || "24" == e || "25" == e || "4" == e || "6" == e ? "icon/ic_nightrain.png": "13" == e || "14" == e || "15" == e || "16" == e || "17" == e || "26" == e || "27" == e || "28" == e || "34" == e ? "icon/nightsnow.png": "18" == e ? "icon/ic_nightfog.png": "20" == e || "29" == e || "30" == e || "31" == e || "53" == e ? "icon/ic_nighthaze.png": "-1" == e ? "icon/ic_sunrise.png": "-2" == e ? "icon/ic_sunset.png": "icon/ic_default.png"
    },
    u2d: function(e, t, a) {
        e /= 1e3,
        "number" == typeof a && (e = parseInt(e) + 60 * parseInt(a) * 60);
        var i = new Date(1e3 * e),
        n = "";
        return n += i.getUTCFullYear() + "-",
        n += i.getUTCMonth() + 1 + "-",
        n += i.getUTCDate(),
        !0 === t && (n += " " + i.getUTCHours() + ":", n += i.getUTCMinutes()),
        "0" == n.split(" ")[1].split(":")[1] && (n += "0"),
        n.split(" ")[1]
    }
},
slider.prototype = {
    init: function() {
        this.pageCount = Math.ceil(this.viewShow.find("li").length / this.pageNum),
        this.viewWidth = this.viewContent.width()
    },
    next: function() {
        this.viewShow.is(":animated") || (this.pageSize == this.pageCount ? (this.viewShow.animate({
            left: "0px"
        },
        "slow"), this.pageSize = 1) : (this.viewShow.animate({
            left: "-=" + this.viewWidth
        },
        "slow"), this.pageSize++))
    },
    prev: function() {
        this.viewShow.is(":animated") || (1 == this.pageSize ? (this.viewShow.animate({
            left: "-=" + (this.pageCount - 1) * this.viewWidth + "px"
        },
        "slow"), this.pageSize = this.pageCount) : (this.viewShow.animate({
            left: "+=" + this.viewWidth
        },
        "slow"), this.pageSize--))
    }
},
$(function() {
    weather.init()
});