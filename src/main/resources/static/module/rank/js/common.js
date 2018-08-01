var commonModule = commonModule || {};
commonModule.data = {
    ticket: YT.getUrlParam('tkt'),
    corpid: YT.getUrlParam('corpid'),
    groupid: YT.getUrlParam('groupid') || '-1'
};
commonModule.eventHandler = {
    handleEvents: function () {
        this.handleClickEvents();
    },
    handleClickEvents: function () {
        //总排名
        $("#Rank_Total").click(function () {
            window.location.href = "fighting-rank-new.html" +
                "?tkt=" + commonModule.data.ticket +
                "&corpid="+commonModule.data.corpid +
                "&groupid="+commonModule.data.groupid;
        });
        //本周
        $("#Rank_Month").click(function () {
            window.location.href = "fighting-rank-month.html" +
                "?tkt=" + commonModule.data.ticket +
                "&corpid="+commonModule.data.corpid +
                "&groupid="+commonModule.data.groupid;
        });
        //本月
        $("#Rank_Week").click(function () {
            window.location.href = "fighting-rank-week.html" +
                "?tkt=" + commonModule.data.ticket +
                "&corpid="+commonModule.data.corpid +
                "&groupid="+commonModule.data.groupid;
        });
    },
    getRankStr:function(items){
        var str = '';
        for (var m = 0; m < items.length; m++) {
            var strAdom = '<a class="weui-cell weui-cell_access" href="../self-fighting/fighting-detail.html?tkt=' + module.data.ticket+'&username=' + items[m].name + '&id=' + items[m].staff_id+'">';
            var strDataStart = ' <div class="weui-cell__bd">';
            var strIconSateStart = '<p>';
            var svgIconDomStart = ' <svg class="icon" aria-hidden="true"> ';
            var strIconDiff = "";
            if(''+items[m].rank_num === '-1'){
                strIconDiff = '<span class="num">-</span> ';
            } else if (''+items[m].rank_num === '1') {
                strIconDiff = '<use xlink:href="#icon-jichutubiao_jinpai"></use>';
            } else if (''+items[m].rank_num === '2') {
                strIconDiff = '<use xlink:href="#icon-jichutubiao_jinpaifuben"></use>';
            } else if (''+items[m].rank_num === '3') {
                strIconDiff = '<use xlink:href="#icon-jichutubiao_jinpaifuben1"></use>';
            } else {
                strIconDiff = '<span class="num">' + parseInt(items[m].rank_num) + '</span> ';
            }
            var svgIconDomEnd = ' </svg> ';
            if (items[m].avatar == null) {
                items[m].avatar = '../../images/staff-head/1001.jpg';
            }
            var headerStart = ' <i class="iconfont" style="color:#2889d6"><img src="' + items[m].avatar + '"/></i>';
            var strNameStart = ' <span class="name">';
            var strNameShow = items[m].name;
            var strNameEnd = '</span>';
            var scoreStartDom = '  <span class="score">';
            var staffScore = items[m].score;
            if (items[m].score == undefined) {
                staffScore = 0;
            }
            var scoreEndDom = '</span>';
            //排名情况
            var iconRanking = '';
            var numberIconRankingStart = '';

            var numberDateShow = parseInt(items[m].rank_change);

            if (isNaN(numberDateShow)) {
                numberDateShow = 0;
            }
            var numberIconRankingEnd = '</span>';
            var strIconSateEnd = ' </p>';
            var starDataEnd = '</div>';
            var hookLink = '<div class="weui-cell__ft"></div>';
            var strAEnd = '</a>';
            if (items[m].rank_change > 0) {
                iconRanking = '<i class="iconfont paimingshangsheng" >&#xe60d;</i>';
                numberIconRankingStart = '<span class="changeUp">';
            } else if (items[m].rank_change == 0) {
                if(''+items[m].rank_num === '-1'){
                    numberIconRankingStart = '<span class="changeUnableStyle">';
                    numberDateShow = '-';
                }else{
                    iconRanking = '<svg class="iconfont nochange" aria-hidden="true"><use xlink:href="#icon-paiming_nochange"></use></svg>';
                    numberIconRankingStart = '<span class="changeUpStyle">';
                }
            } else {
                iconRanking = '<i class="iconfont paimingxiajiang" >&#xe60e;</i>';
                numberIconRankingStart = '<span class="changeDown">';
            }

            if (parseInt(items[m].rank_num) > 3 || ''+items[m].rank_num === '-1') {
                str += strAdom + strDataStart + strIconDiff + headerStart + strNameStart + strNameShow
                    + strNameEnd + scoreStartDom + staffScore + scoreEndDom + scoreEndDom
                    + iconRanking + numberIconRankingStart + numberDateShow + numberIconRankingEnd + strIconSateEnd
                    + starDataEnd + hookLink + strAEnd;

            } else {
                str += strAdom + strDataStart + svgIconDomStart + svgIconDomStart + strIconDiff + svgIconDomEnd + strIconSateStart + headerStart + strNameStart + strNameShow
                    + strNameEnd + scoreStartDom + staffScore + scoreEndDom + scoreEndDom
                    + iconRanking + numberIconRankingStart + numberDateShow + numberIconRankingEnd + strIconSateEnd
                    + starDataEnd + hookLink + strAEnd;
            }
        }
        return str;
    }
}

