package com.wzy.crm.wx.cp.utils;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.wzy.crm.wx.cp.utils.wechat.AccessToken;
import com.wzy.crm.wx.cp.utils.wechat.JSTicket;
import com.wzy.crm.wx.cp.utils.wechat.OAuthAccessToken;

import javax.net.ssl.*;
import java.io.*;
import java.net.URL;
import java.net.URLEncoder;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

public class WxApi {
    //accessToken 接口
//    private static final String GET_ACCESS_TOKEN = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s";
    private static final String GET_ACCESS_TOKEN = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=%s&corpsecret=%s";
    //获取用户信息
    private static final String GET_USER_INFO = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=%s&code=%s";
    private static final String GET_USER_DETAIL_INFO = "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=%s&userid=%s";
    private static final String GET_DEPARTMENT_USER_INFO = "https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=%s&department_id=%s&fetch_child=%s";

    //获取账号粉丝信息
    private static final String GET_FANS_INFO = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=%s&openid=%s&lang=zh_CN";

    private static final String GET_JSAPI_TICKET = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi";
    private static final String SHORTURL_API_URL = "https://api.weixin.qq.com/cgi-bin/shorturl";
    private static final String SEMANTIC_SEMPROXY_SEARCH_URL = "https://api.weixin.qq.com/semantic/semproxy/search";
    //网页授权OAuth2.0获取token
    private static final String GET_OAUTH2_TOKEN = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code";
    private static final String OAUTH2_REFRESH_TOKEN = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=%s&grant_type=refresh_token&refresh_token=%s";
    //网页授权OAuth2.0获取用户信息  lang = zh_CN 默认是中文
    private static final String GET_OAUTH_USERINFO = "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN";
    private static final String OAUTH2_VALIDATE_TOKEN_URL = "https://api.weixin.qq.com/sns/auth?access_token=%s&openid=%s";
    private static final String GET_CALLBACK_IP_URL = "https://api.weixin.qq.com/cgi-bin/getcallbackip";
    private static final String QRCONNECT_URL = "https://open.weixin.qq.com/connect/qrconnect?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s#wechat_redirect";
    //网页授权OAuth2.0获取code
    private static final String GET_OAUTH_CODE = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s#wechat_redirect";
    private static final String GET_CURRENT_AUTOREPLY_INFO_URL = "https://api.weixin.qq.com/cgi-bin/get_current_autoreply_info";
    private static final String CLEAR_QUOTA_URL = "https://api.weixin.qq.com/cgi-bin/clear_quota";
    //获取用户列表
//    private static final String GET_FANS_LIST_FIRST = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=%s";
    private static final String GET_FANS_LIST = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=%s&next_openid=%s";


//    //获取第一次拉取用户列表接口
//    public static String getFansListFirst(String token){
//        return String.format(GET_FANS_LIST_FIRST,token);
//    }

    //获取拉取用户列表接口
    public static String getFansList(String token,String openid){
        return String.format(GET_FANS_LIST,token,openid);
    }


    //获取token接口
    public static String getTokenUrl(String corpId, String appSecret) {
        return String.format(GET_ACCESS_TOKEN, corpId, appSecret);
    }


    //获取用户信息接口
    public static String getUsersInfoUrl(String token, String code) {
        return String.format(GET_USER_INFO, token, code);
    }

    //获取用户详细信息接口
    public static String getUsersDetailInfoUrl(String token,String userId){
        return String.format(GET_USER_DETAIL_INFO,token,userId);
    }


    //获取部门用户接口
    public static String getDepartmentUserInfoUrl(String token,String departmentId,String fetchChild){
        return String.format(GET_DEPARTMENT_USER_INFO,token,departmentId,fetchChild);
    }


    //获取粉丝信息接口
    public static String getFansInfoUrl(String token, String openid) {
        return String.format(GET_FANS_INFO, token, openid);
    }


    //网页授权OAuth2.0获取code
    public static String getOAuthCodeUrl(String appId, String redirectUrl, String scope, String state) {
        return String.format(GET_OAUTH_CODE, appId, urlEnodeUTF8(redirectUrl), scope, state);
    }

    //网页授权OAuth2.0获取token
    public static String getOAuthTokenUrl(String appId, String appSecret, String code) {
        return String.format(GET_OAUTH2_TOKEN, appId, appSecret, code);
    }

    //网页授权OAuth2.0获取用户信息
    public static String getOAuthUserinfoUrl(String token, String openid) {
        return String.format(GET_OAUTH_USERINFO, token, openid);
    }

    //获取js ticket url
    public static String getJsApiTicketUrl(String token) {
        return String.format(GET_JSAPI_TICKET, token);
    }


    /**
     * 获取创建临时二维码post data
     *
     * @param expireSecodes 该二维码有效时间，以秒为单位。 最大不超过2592000（即30天），此字段如果不填，则默认有效期为30秒。
     * @param scene         临时二维码时为32位非0整型，永久二维码时最大值为100000（目前参数只支持1--100000)
     * @return
     */
    public static String getQrcodeJson(Integer expireSecodes, Integer scene) {
        String postStr = "{\"expire_seconds\":%d,\"action_name\":\"QR_SCENE\",\"action_info\":{\"scene\":{\"scene_id\":%d}}";
        return String.format(postStr, expireSecodes, scene);
    }

    /**
     * 获取创建临时二维码post data
     *
     * @param scene 临时二维码时为32位非0整型，永久二维码时最大值为100000（目前参数只支持1--100000)
     * @return
     */
    public static String getQrcodeLimitJson(Integer scene) {
        String postStr = "{\"action_name\":\"QR_LIMIT_SCENE\",\"action_info\":{\"scene\":{\"scene_id\":%d}}";
        return String.format(postStr, scene);
    }

    //获取永久二维码
    public static String getQrcodeLimitJson(String sceneStr) {
        String postStr = "{\"action_name\":\"QR_LIMIT_STR_SCENE\",\"action_info\":{\"scene\":{\"scene_str\":%s}}";
        return String.format(postStr, sceneStr);
    }

    //获取接口访问凭证
    public static AccessToken getAccessToken(String appId, String appSecret) {
        AccessToken token = null;
        String tockenUrl = WxApi.getTokenUrl(appId, appSecret);
        JSONObject jsonObject = httpsRequest(tockenUrl, HttpMethod.GET.getMethodName(), null);
        if (null != jsonObject && jsonObject.containsKey("access_token")) {
            try {
                token = new AccessToken();
                token.setAccessToken(jsonObject.getString("access_token"));
                token.setExpiresIn(Integer.valueOf(jsonObject.getString("expires_in")));
            } catch (JSONException e) {
                token = null;//获取token失败
            }
        } else if (null != jsonObject) {
            token = new AccessToken();
            token.setErrcode(Integer.valueOf(jsonObject.getString("errcode")));
        }
        return token;
    }

    //获取js ticket
    public static JSTicket getJSTicket(String token) {
        JSTicket jsTicket = null;
        String jsTicketUrl = WxApi.getJsApiTicketUrl(token);
        JSONObject jsonObject = httpsRequest(jsTicketUrl, HttpMethod.GET.getMethodName(), null);
        if (null != jsonObject && jsonObject.containsKey("errcode") && Integer.valueOf(jsonObject.getString("errcode")) == 0) {
            try {
                jsTicket = new JSTicket();
                jsTicket.setTicket(jsonObject.getString("ticket"));
                jsTicket.setExpiresIn(Integer.valueOf(jsonObject.getString("expires_in")));
            } catch (JSONException e) {
                jsTicket = null;//获取token失败
            }
        } else if (null != jsonObject) {
            jsTicket = new JSTicket();
            jsTicket.setErrcode(Integer.valueOf(jsonObject.getString("errcode")));
        }
        return jsTicket;
    }

    //获取OAuth2.0 Token
    public static OAuthAccessToken getOAuthAccessToken(String appId, String appSecret, String code) {
        OAuthAccessToken token = null;
        String tockenUrl = getOAuthTokenUrl(appId, appSecret, code);
        JSONObject jsonObject = httpsRequest(tockenUrl, HttpMethod.GET.getMethodName(), null);
        if (null != jsonObject && !jsonObject.containsKey("errcode")) {
            try {
                token = new OAuthAccessToken();
                token.setAccessToken(jsonObject.getString("access_token"));
                token.setExpiresIn(Integer.valueOf(jsonObject.getString("expires_in")));
                token.setOpenid(jsonObject.getString("openid"));
                token.setScope(jsonObject.getString("scope"));
            } catch (JSONException e) {
                token = null;//获取token失败
            }
        } else if (null != jsonObject) {
            token = new OAuthAccessToken();
            token.setErrcode(Integer.valueOf(jsonObject.getString("errcode")));
        }
        return token;
    }

    //发送请求
    public static JSONObject httpsRequest(String requestUrl, String requestMethod) {
        return httpsRequest(requestUrl, requestMethod, null);
    }

    public static JSONObject httpsRequest(String requestUrl, String requestMethod, String outputStr) {
        JSONObject jsonObject = null;
        try {
            TrustManager[] tm = {new JEEWeiXinX509TrustManager()};
            SSLContext sslContext = SSLContext.getInstance("SSL", "SunJSSE");
            sslContext.init(null, tm, new java.security.SecureRandom());
            SSLSocketFactory ssf = sslContext.getSocketFactory();

            URL url = new URL(requestUrl);
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
            conn.setSSLSocketFactory(ssf);

            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            conn.setRequestMethod(requestMethod);
            if (null != outputStr) {
                OutputStream outputStream = conn.getOutputStream();
                outputStream.write(outputStr.getBytes("UTF-8"));
                outputStream.close();
            }
            InputStream inputStream = conn.getInputStream();
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "UTF-8");
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
            String str = null;
            StringBuffer buffer = new StringBuffer();
            while ((str = bufferedReader.readLine()) != null) {
                buffer.append(str);
            }
            bufferedReader.close();
            inputStreamReader.close();
            inputStream.close();
            inputStream = null;
            conn.disconnect();
            jsonObject = JSONObject.parseObject(buffer.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

    public static byte[] httpsRequestByte(String requestUrl, String requestMethod) {
        return httpsRequestByte(requestUrl, requestMethod, null);
    }

    public static byte[] httpsRequestByte(String requestUrl, String requestMethod, String outputStr) {
        try {
            TrustManager[] tm = {new JEEWeiXinX509TrustManager()};
            SSLContext sslContext = SSLContext.getInstance("SSL", "SunJSSE");
            sslContext.init(null, tm, new java.security.SecureRandom());
            SSLSocketFactory ssf = sslContext.getSocketFactory();

            URL url = new URL(requestUrl);
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
            conn.setSSLSocketFactory(ssf);

            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            conn.setRequestMethod(requestMethod);
            if (null != outputStr) {
                OutputStream outputStream = conn.getOutputStream();
                outputStream.write(outputStr.getBytes("UTF-8"));
                outputStream.close();
            }
            InputStream inputStream = conn.getInputStream();
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            int n = 0;
            while (-1 != (n = inputStream.read(buffer))) {
                output.write(buffer, 0, n);
            }
            return output.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String urlEnodeUTF8(String str) {
        String result = str;
        try {
            result = URLEncoder.encode(str, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}

class JEEWeiXinX509TrustManager implements X509TrustManager {
    public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
    }

    public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
    }

    public X509Certificate[] getAcceptedIssuers() {
        return null;
    }
}
