var continuous = {
    continuousDisplay: function (score) {
        var initChart = document.getElementById('change'); // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(initChart);//填充容器

        data = score;
        var dateList = data.map(function (item) {
            if (item[0] == null) {
                return '没有数据';
            } else {
                return item[0];
            }
        });
        var valueList = data.map(function (item) {
            return item[1];
        });
        option = {
            visualMap: [{
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 0,
                max: 400
            }],
            title: [{
                left: 'center',
                text: '战力变化图'
            }],
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{
                data: dateList
            }],
            yAxis: [{
                splitLine: {show: false}
            }],
            grid: [{
                bottom: '35%'
            }],
            series: [{
                type: 'line',
                showSymbol: false,
                data: valueList
            }]
        };
        myChart.setOption(option); // 使用刚指定的配置项和数据显示图表。
    }
};
