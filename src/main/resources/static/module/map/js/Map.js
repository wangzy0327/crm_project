var module = {};

module.data = {
    m: 3000000,
    corpid: YT.getUrlParam('corpid'),
    groupid: YT.getUrlParam("groupid"),
    myCharts: ['#chart-panel', '#detail-popup .modal-chart'],
    messageIds: []
};

module.service = {
    initControls: function () {
        this.initDom();
    },

    initDom: function () {
        var self = this, module_d = module.data, myCharts = module_d.myCharts;

        // 初始化echarts
        var $chart_panel = $(myCharts[0]), $detail_popup = $(myCharts[1]);
        this.setChartSize();
        module_d.chart_panel = echarts.init($chart_panel[0]);
        module_d.detail_popup = echarts.init($detail_popup[0]);

        this.initChart(module_d.chart_panel);

        // 注册地图事件
        module.eventHandler.handleMapEvent(module_d.chart_panel);

        $.showLoading('加载中...');

        this.initMessageList();
    },

    initChart: function (myChart) {
        var option = {
            title: {
                left: 'center'
            },
            visualMap: {
                min: 0,
                max: 100,
                text: ['高', '低'],
                inRange: {
                    color: ['#e0daff', '#adbfff', '#9cb4ff', '#6a9dff', '#3889ff']
                }
            },
            tooltip: {
                triggerOn: 'click',
                formatter: function (params) {
                    var name = params.name, value = 0, seriesType = params.seriesType;

                    if (seriesType === 'map') {
                        value = params.value;
                    } else if (seriesType === 'scatter' || seriesType === 'effectScatter') {
                        value = params.value[2].value;
                    }

                    return name === '' ? '' : '<div onclick="triggerClickDetail()">' + params.seriesName + '</br>' + params.marker + name + '：' + value + '（详情）</div>';
                }
            },
            geo: {
                map: 'china',
                roam: true,
                zoom: 1.2,
                scaleLimit: {
                    min: 1.2,
                    max: 8
                },
                itemStyle: {
                    normal: {
                        borderColor: '#b9b4b7'
                    }
                },
                label: {
                    emphasis: {
                        show: false
                    }
                }
            },
            series: [
                {
                    type: 'map',
                    mapType: 'china',
                    geoIndex: 0
                }
            ]
        };

        myChart.setOption(option);
    },

    initChartPopup: function (myChart, mapName, mapData) {
        var option = {
            visualMap: {
                min: 0,
                max: module.service.getMaxNum(mapData[0].value),
                text: ['高', '低'],
                inRange: {
                    color: ['#e0daff', '#adbfff', '#9cb4ff', '#6a9dff', '#3889ff']
                }
            },
            geo: {
                show: true,
                type: 'map',
                map: mapName,
                roam: true,
                zoom: 1.1,
                scaleLimit: {
                    min: 1.1,
                    max: 2
                },
                itemStyle: {
                    normal: {
                        borderColor: '#b9b4b7'
                    }
                },
                label: {
                    emphasis: {
                        show: true
                    }
                }
            },
            series: [
                {
                    name: '浏览数量',
                    type: 'map',
                    mapType: mapName,
                    geoIndex: 0,
                    data: mapData
                }
            ]
        };

        myChart.setOption(option);
    },

    // 按企业初始化消息列表
    initMessageList: function () {
        var self = this, module_d = module.data, messageIds = module_d.messageIds;

        this.getMessageList(function (items) {
            var html = '', chart_popup_html = '', message_obj = {};

            if (items.length) {
                html += '<div class="weui-cells">';
                for (var i in items) {
                    var item = items[i];
                    if (item.shareTime) {
                        html += '<a class="weui-cell weui-cell_access detail" data-id="' + item.messageId + '" data-name="' + item.titleText + '">';
                    } else {
                        html += '<div class="weui-cell">';
                    }
                    html += '<div class="weui-cell__bd">';
                    html += '<p>' + self.formatMessageTitle(item.titleText);
                    html += '<span style="font-size: 13px;color:#666;">（' + self.formatTime(item.shareTime) + '分享）</span>';
                    html += '</p></div>';
                    html += '<div class="weui-cell__ft">';
                    html += '<span style="font-size: 13px;color:#666;">浏览：</span>';
                    html += '<span style="color: red;">' + item.count + '</span>';
                    html += '</div>';
                    if (item.shareTime) {
                        html += '</a>';
                    } else {
                        html += '</div>';
                    }

                    messageIds.push(item.messageId);
                }

                html += '<a href="javascript:void(0);" class="weui-cell weui-cell_link searchMore">';
                html += '<div class="weui-cell__bd">查看更多</div>';
                html += '</a>';
                html += '</div>';

                html += '</div>';

                var obj = items[0], titleText = obj.titleText;
                module.data.message_obj = {
                    id: obj.messageId,
                    name: titleText
                }
            } else {
                $.hideLoading();
            }

            $('#message-list').empty();
            $('#message-list').append(items.length > 3 ? chart_popup_html : html);

            if (module_d.message_obj !== undefined) {
                self.getChartMap();
                $.hideLoading();
            }
        });
    },

    // 按省份初始化地图
    initChartMap: function (myChart, isQuery) {
        var self = this, module_d = module.data, message_obj = module_d.message_obj;

        var chart_map = module_d.chart_map_obj[message_obj.id].items;

        var option = {
            title: {
                text: message_obj.name
            },
            visualMap: {
                max: self.getMaxNum(chart_map[0].value)
            },
            series: [
                {
                    name: '传播数量',
                    data: chart_map
                }
            ]
        };

        myChart.setOption(option);

        if (isQuery) {
            self.getChartCity(myChart);
        } else {
            self.initChartCity(myChart);
        }
    },

    // 按市初始化散点图
    initChartCity: function (myChart) {
        var self = this, module_d = module.data, message_obj = module_d.message_obj;

        var chart_city = module_d.chart_city_obj[message_obj.id].items, chart_city_max = chart_city[0].value;

        var option = myChart.getOption();

        module.data.v_max = chart_city_max[2].value;
        module.data.cp_center = [chart_city_max[0], chart_city_max[1]];

        // 设置地图放大中心位置
        option.geo[0].zoom = 4;
        option.geo[0].center = module_d.cp_center;

        var zoom = option.geo[0].zoom;

        option.series.push(
            {

                name: '传播数量',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: chart_city,
                symbolSize: function (val) {
                    return self.getSymbolSize(val[2].value, zoom);
                },
                itemStyle: {
                    normal: {
                        color: '#f90'
                    }
                }
            },
            {
                name: '传播数量',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: chart_city.slice(0, 3),
                symbolSize: function (val) {
                    return self.getSymbolSize(val[2].value, zoom);
                },
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        color: '#333',
                        fontWeight: 'bold'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ef5656'
                    }
                }
            }
        );

        myChart.setOption(option);
    },

    // 按省份详细散点图
    initChartMapDetail: function () {
        var self = this, module_d = module.data, message_obj = module_d.message_obj;

        var v_str = $('#chart-detail').data('v'), v = {};

        if (v_str !== undefined && v_str !== '') {
            v = JSON.parse(v_str);

            var map_pid = v.pid, map_pname = v.pname, cid = v.cid;

            $.getScript('js/province/' + v.ppy + '.js', function () {
                var chart_detail = self.getChartDetail(map_pid), totalCount = 0, detail_popup = module_d.detail_popup;

                for (var i in chart_detail) {
                    totalCount += chart_detail[i].value;
                }

                $('#chart-title').text(self.formatMessageTitle(message_obj.name) + '（' + map_pname + ' ' + totalCount + '）');

                // 初始化echarts
                detail_popup.clear();
                module.service.initChartPopup(detail_popup, map_pname, chart_detail);

                var map_cid = chart_detail[0].item.cid, map_name = chart_detail[0].name;
                if (cid !== undefined) {
                    map_cid = cid;
                    map_name = v.cname;
                }

                self.getCityMessageList(map_pid, map_cid, map_name);

                module.eventHandler.handleMapPopupEvent(detail_popup);
            });
        }
    },

    getMessageList: function (callback) {
        var self = this, module_d = module.data;

        var filter = [
            {field: 'corpid', value: module_d.corpid, operator: '=', relation: 'and'},
            {field: 'group_id', value: module_d.groupid, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module_d.m,
            t: 'v_message_share_map_message',
            filter: JSON.stringify(filter),
            order: 'shareTime desc, count desc',
            r: 3
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    callback(data.object);
                } else {
                    $.alert(data.message);
                }
            }
        });
    },

    getChartMap: function () {
        var self = this, module_d = module.data, chart_panel = module_d.chart_panel, messageIds = module_d.messageIds;

        var filter = [];

        if (messageIds.length) {
            for (var i in messageIds) {
                filter.push({field: 'messageId', value: messageIds[i], operator: '=', relation: 'or'});
            }
        } else {
            filter.push({field: '1', value: 2, operator: '=', relation: 'or'});
        }

        var data = {
            m: module_d.m,
            t: 'v_message_share_map_china',
            filter: JSON.stringify(filter),
            order: 'count desc'
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    var items = data.object, chart_map_obj = {};

                    for (var i in items) {
                        var item = items[i],
                            message_id = item.messageId,
                            pname = item.pname,
                            obj = {
                                name: self.formatCityName(pname),
                                value: item.count,
                                item: {pid: item.pid, pname: pname, ppy: item.ppy}
                            };

                        if (chart_map_obj[message_id] === undefined) {
                            chart_map_obj[message_id] = {
                                name: item.titleText,
                                items: [obj]
                            };
                        } else {
                            chart_map_obj[message_id].items.push(obj);
                        }
                    }

                    module.data.chart_map_obj = chart_map_obj;

                    self.initChartMap(chart_panel, true);
                } else {
                    $.alert(data.message);
                }
            }
        });
    },

    getChartCity: function (myChart) {
        var self = this, module_d = module.data, messageIds = module_d.messageIds;

        var filter = [];

        if (messageIds.length) {
            for (var i in messageIds) {
                filter.push({field: 'messageId', value: messageIds[i], operator: '=', relation: 'or'});
            }
        } else {
            filter.push({field: '1', value: 2, operator: '=', relation: 'and'});
        }

        var data = {
            m: module_d.m,
            t: 'v_message_share_map_city',
            filter: JSON.stringify(filter),
            order: 'count desc'
        };

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    var items = data.object, chart_city_obj = {};

                    for (var i in items) {
                        var item = items[i],
                            message_id = item.messageId,
                            cname = item.cname,
                            obj = {
                                name: self.formatCityName(cname),
                                value: JSON.parse(item.cp).concat({
                                    value: item.count,
                                    pid: item.pid,
                                    pname: self.formatCityName(item.pname),
                                    ppy: item.ppy,
                                    cid: item.cid,
                                    cname: cname
                                })
                            };

                        if (chart_city_obj[message_id] === undefined) {
                            chart_city_obj[message_id] = {
                                name: item.titleText,
                                items: [obj]
                            };
                        } else {
                            chart_city_obj[message_id].items.push(obj);
                        }
                    }

                    module.data.chart_city_obj = chart_city_obj;

                    self.initChartCity(myChart);
                } else {
                    $.alert(data.message);
                }
            }
        });
    },

    getChartDetail: function (map_pid) {
        var self = this, module_d = module.data, message_obj = module_d.message_obj;

        var chart_city = module_d.chart_city_obj[message_obj.id].items, chart_detail = [];

        for (var i in chart_city) {
            var obj = chart_city[i].value[2];
            if (map_pid === obj.pid) {
                chart_detail.push({
                    name: obj.cname,
                    value: obj.value,
                    item: {
                        cid: obj.cid
                    }
                });
            }
        }

        return chart_detail;
    },

    getCityMessageList: function (map_pid, map_cid, map_name) {
        var self = this, module_d = module.data;

        var filter = [
            {field: 'messageId', value: module_d.message_obj.id, operator: '=', relation: 'and'},
            {field: 'pid', value: map_pid, operator: '=', relation: 'and'}
        ];

        var data = {
            m: module_d.m,
            t: 'v_message_share_map_detail',
            filter: JSON.stringify(filter),
            order: 'field(customerId, -1), openTime desc, count desc'
        };

        $.showLoading('加载中...');
        $('#detail-city').text('数据加载中...');
        $('#detail-list').empty();

        YT.query({
            data: data,
            successCallback: function (data) {
                if (200 == data.status) {
                    var items = data.object, city_message_obj = {};

                    for (var i in items) {
                        var item = items[i], cid = item.cid;

                        if (city_message_obj[cid] === undefined) {
                            city_message_obj[cid] = [item];
                        } else {
                            city_message_obj[cid].push(item);
                        }
                    }

                    $.hideLoading();

                    module.data.city_message_obj = city_message_obj;

                    self.initDetailHtml(city_message_obj[map_cid], map_name);

                } else {
                    $.alert(data.message);
                }
            }
        });
    },

    initDetailHtml: function (items, map_name) {
        var self = this, html = '', total = 0;

        $('#detail-city').text('数据加载中...');
        $('#detail-list').empty();

        if (items.length) {
            html += '<div class="weui-cells">';

            for (var i in items) {
                var item = items[i],
                    customer_name = item.customerName || '(未填写)',
                    count = item.count;

                html += '<div class="weui-cell">';
                html += '<div class="weui-cell__bd">';
                html += '<p>' + customer_name;
                html += '<span style="font-size: 13px;color:#666;">（' + self.formatTime(item.openTime) + ' 浏览）</span>';
                html += '</p></div>';
                html += '<div class="weui-cell__ft">';
                html += '<span style="font-size: 13px;color:#666;">浏览：</span>';
                html += '<span style="color: red;">' + count + '</span>';
                html += '</div>';
                html += '</div>';

                total += count;
            }

            html += '</div>';
        }

        $('#detail-city').text(map_name + '浏览详情（总计：' + total + '）');
        $('#detail-list').append(html);
    },

    setChartSize: function () {
        var myCharts = module.data.myCharts, doc_h = document.body.clientHeight, height_panel = doc_h - 30 - 170 - 14;

        for (var i in myCharts) {
            if (i === '1') {
                height_panel = doc_h - 50 - 170 - 36;
            }
            if (window.orientation == 180 || window.orientation == 0) { // 竖屏

            }
            if (window.orientation == 90 || window.orientation == -90) { // 横屏
                height_panel = doc_h - 96;
                if (i === '1') {
                    height_panel = doc_h - 156;
                }

            }
            $(myCharts[i]).css({width: document.body.clientWidth - 20, height: height_panel});
        }
    },

    formatMessageTitle: function (value) {
        if (value.length > 10) {
            value = value.substr(0, 5) + '...' + value.substr(value.length - 5, value.length);
        }
        return value;
    },

    formatTime: function (time) {
        if (!time) {
            return '未';
        }
        var nowTime = new Date().getTime();
        var second = (nowTime - time) / 1000; // 秒
        var minute = second / 60; // 分
        var hour = minute / 60; // 小时
        var day = hour / 24; // 天
        var week = day / 7; // 周
        var month = day / 30; // 月
        var year = day / 365; // 年
        if (minute < 1) {
            return Math.floor(second) + ' 秒前';
        } else if (hour < 1) {
            return Math.floor(minute) + ' 分前';
        } else if (day < 1) {
            return Math.floor(hour) + ' 小时前';
        } else if (week < 1) {
            return Math.floor(day) + ' 天前';
        } else if (month < 1) {
            return Math.floor(week) + ' 周前';
        } else if (year < 1) {
            return Math.floor(month) + ' 月前';
        } else if (year >= 1 && year < 4) {
            return Math.floor(year) + ' 年前';
        } else if (year >= 4) {
            return new Date(time).Format('yyyy-MM-dd hh:mm:ss');
        }
    },

    formatCityName: function (name) {
        var cityName = '', reg = /^.*(省|市|自治州)$/, reg_z = /^(新疆|内蒙古|西藏|广西|宁夏)/;

        if (reg.test(name)) {
            cityName = name.replace(name.match(reg)[1], '');
        } else {
            cityName = name.match(reg_z)[1];
        }

        return cityName;
    },

    getMaxNum: function (value) {
        var num = +value.toString().substr(0, 1);
        num += 1;
        for (var i = 1; i < value.toString().length; i++) {
            num += '0';
        }
        return +num;
    },

    getSymbolSize: function (value, zoom) {
        /**
         * d_min：点的最小值
         * d_max：点的最大值
         * v_min：数据最小值
         * v_max：数据最大值
         * zoom：地图缩放比例
         *
         * @type {number}
         */
        var d_min = 6, d_max = 14, v_min = 1, v_max = module.data.v_max;
        var d_v = (d_max - d_min) / (v_max - v_min) * (value - 1) + d_min;
        return ((d_v || 6) * Math.sqrt(zoom)).toFixed(2);
    }
};

module.eventHandler = {
    handleEvents: function () {
        this.handleClickMessageList();
        this.handleClickMessageSearchMore();
        this.handleClickChartDetail();
        this.handleClosePopup();
    },

    // 点击消息列表，更新地图数据
    handleClickMessageList: function () {
        var module_d = module.data;
        $('#message-list').on('click', '.detail', function () {
            var name = $(this).data('name'), chart_panel = module_d.chart_panel;

            module_d.message_obj = {
                id: $(this).data('id'),
                name: name
            };
            // 清空后调用 getOption 方法返回一个{}空对象
            chart_panel.clear();
            module.service.initChart(chart_panel);
            module.service.initChartMap(chart_panel, false);
        });
    },

    // 点击查看更多，弹出Popup消息列表
    handleClickMessageSearchMore: function () {
        $('#message-list').on('click', '.searchMore', function () {
            window.location.href = '/module/map/map-list.html' + YT.setUrlParams({groupid: module.data.groupid});
        });
    },

    handleClickChartDetail: function () {
        $('#chart-detail').click(function () {
            module.data.chart_panel.dispatchAction({type: 'hideTip'});

            module.service.initChartMapDetail();

            var divScroll = new DivScroll('#detail-popup .modal-content');
            $(document.body).addClass('page-unScroll');
            $('#detail-popup').popup();
        });
    },

    handleClosePopup: function () {
        $('#detail-popup .close').click(function () {
            $(document.body).removeClass('page-unScroll');
            $('#chart-detail').data('v', {});
            $.closePopup('#detail-popup');
        });
    },

    handleMapEvent: function (myChart) {
        // 地图缩放事件
        this.handleZoomMap(myChart);
        // 地图选中区域事件
        this.handleClickMap(myChart);
        // 窗口大小改变事件
        this.handleResizeMap();
    },

    handleMapPopupEvent: function (myChart) {
        var module_d = module.data;

        myChart.on('click', function (params) {
            var map_name = params.name;

            if ('' !== map_name) {
                module.service.initDetailHtml(module_d.city_message_obj[params.data.item.cid], map_name);
            } else {
                $('#detail-city').text('暂无数据');
                $('#detail-list').empty();
            }
        });

        this.handleResizeMap();
    },

    handleZoomMap: function (myChart) {

        myChart.on('georoam', function (params) {
            var option = myChart.getOption(),
                zoom = option.geo[0].zoom;

            getSymbolSize(option, [1, 2], zoom);

            myChart.setOption(option);

        });

        /**
         *
         * @param option
         * @param arr    数组：[1,2,3]
         * @param zoom
         */
        function getSymbolSize(option, arr, zoom) {
            for (var i in arr) {
                var index = arr[i];
                option.series[index].symbolSize = function (val) {
                    return module.service.getSymbolSize(val[2].value, zoom);
                };
            }
        }
    },

    handleClickMap: function (myChart) {

        myChart.on('click', function (params) {
            var seriesType = params.seriesType, name = params.name, v = {};

            if (name) {
                if ('effectScatter' === seriesType || 'scatter' === seriesType) {
                    v = params.data.value[2];
                } else if ('map' === seriesType) {
                    var item = params.data.item;
                    v = {
                        pid: item.pid,
                        pname: module.service.formatCityName(item.pname),
                        ppy: item.ppy
                    };
                }
            }

            $('#chart-detail').data('v', JSON.stringify(v));
        });
    },

    handleResizeMap: function () {
        var module_d = module.data, chart_panel = module_d.chart_panel, detail_popup = module_d.detail_popup;

        window.onorientationchange = function (ev) {
            module.service.setChartSize();

            if (chart_panel !== undefined) {
                var option = chart_panel.getOption();

                // 设置地图放大中心位置
                option.geo[0].zoom = 4;
                option.geo[0].center = module_d.cp_center;

                chart_panel.resize();
            }

            if (detail_popup !== undefined) {
                detail_popup.resize();
            }
        };
    }
};

$(function () {
    module.service.initControls();
    module.eventHandler.handleEvents();
});

function triggerClickDetail() {
    $('#chart-detail').trigger('click');
}

// 弹出层滚动条不影响到body [layerNode：需要滚动的元素]
var DivScroll = function (layerNode) {
    // 如果没有这个元素的话，那么将不再执行下去
    if (!document.querySelector(layerNode)) return;

    this.popupLayer = document.querySelector(layerNode);
    this.startX = 0;
    this.startY = 0;

    this.popupLayer.addEventListener('touchstart', function (e) {
        this.startX = e.changedTouches[0].pageX;
        this.startY = e.changedTouches[0].pageY;
    }, false);

    // 仿innerScroll方法
    this.popupLayer.addEventListener('touchmove', function (e) {

        e.stopPropagation();

        var deltaX = e.changedTouches[0].pageX - this.startX;
        var deltaY = e.changedTouches[0].pageY - this.startY;

        // 只能纵向滚
        if (Math.abs(deltaY) < Math.abs(deltaX)) {
            e.preventDefault();
            return false;
        }

        if (this.offsetHeight + this.scrollTop >= this.scrollHeight) {
            if (deltaY < 0) {
                e.preventDefault();
                return false;
            }
        }
        if (this.scrollTop === 0) {
            if (deltaY > 0) {
                e.preventDefault();
                return false;
            }
        }
        // 会阻止原生滚动
        // return false;
    }, false);

};