var rankCommmon = rankCommmon || {};
rankCommmon.service = {
    getUserInfo: function (callback) {
        YT.getUserInfo(function (data) {
            rankCommmon.userInfo = data;
            callback();
        });
    }
};