var radarCompare = {
    radarDisplay: function (score1, score2) {
        var myChart = document.getElementById('main');   // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(myChart);
        option = {
            title: {
                text: '',
                left: 'center',
                textStyle: {
                    fontSize: 20
                }
            },
            tooltip: {},
            legend: {
                data: [score1[0], score2[0]],
            },
            radar: {
                center: ['50%', '55%'],
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
                        fontSize: 14
                    }
                }
            },
            series: [{
                name: '战力值',
                type: 'radar',
                data: [
                    {
                        value: score1.slice(1),
                        name: score1[0]
                    },
                    {
                        value: score2.slice(1),
                        name: score2[0]
                    }
                ]
            }]
        };
        myChart.setOption(option); // 使用刚指定的配置项和数据显示图表。
    }
};