var radar = {
    radarDisplay: function (score) {
        var myChart = document.getElementById('main'); // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(myChart); //自适应宽高
        var nameValue = $("#staff_name").text() ;
        option = {
            title: {
                text: '',
                left: 'center',
                textStyle: {
                    fontSize: 20
                }
            },
            tooltip: {},
            legend: {},
            radar: {
                center: ['50%', '45%'],
                nameGap: 1,
                indicator: [
                    {name: '计划安排', max: 100},
                    {name: '拓客能力', max: 100},
                    {name: '签单能力', max: 100},
                    {name: '市场创新', max: 100},
                    {name: '行动落实', max: 100}
                ],
                name: {
                    textStyle: {
                        fontSize: 15
                    }
                },
            },
            series: [{
                name: '战力值',
                type: 'radar',
                data: [
                    {
                        value: score,
                        name: nameValue
                    }
                ]
            }]
        };
        myChart.setOption(option);   // 使用刚指定的配置项和数据显示图表。
    }
}