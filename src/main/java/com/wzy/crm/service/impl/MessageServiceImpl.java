package com.wzy.crm.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.wzy.crm.dao.MessageMapper;
import com.wzy.crm.dao.MessageTagMapper;
import com.wzy.crm.dao.MessageTagRelationMapper;
import com.wzy.crm.pojo.Message;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.utils.FtpUtil;
import com.wzy.crm.utils.HttpApi;
import com.wzy.crm.utils.PropertiesUtil;
import com.wzy.crm.vo.ResponseCode;
import com.wzy.crm.vo.ServerResponse;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.UUID;

@Service
public class MessageServiceImpl implements IMessageService {

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private MessageTagMapper messageTagMapper;

    @Autowired
    private MessageTagRelationMapper messageTagRelationMapper;

    @Override
    public synchronized ServerResponse saveMessage(Message message,List<String> tags) {
        messageMapper.insert(message);
        Integer messageId = message.getId();
        System.out.println("messageId:"+messageId);
//        List<Integer> oldTags = messageTagRelationMapper.selectTagIdsByParam(messageId);
        List<Integer> needToInsert = findTags(tags);
        handleInsertData(messageId,needToInsert);
        return ServerResponse.createBySuccess(message);
    }

    @Override
    public List<Integer> findTags(List<String> tags){
        List<Integer> tagIds = Lists.newArrayList();
        for(int i = 0;i<tags.size();i++){
            Integer tagId = messageTagMapper.selectByTagName(tags.get(i));
            if(tagId == null){
                MessageTag messageTag = new MessageTag();
                messageTag.setName(tags.get(i));
                messageTagMapper.insert(messageTag);
                tagId = messageTag.getId();
            }
            tagIds.add(tagId);
        }
        return tagIds;
    }

    private void handleInsertData(Integer messageId,List<Integer> needToInsert){
        if(needToInsert!=null&&needToInsert.size()>0){
            messageTagRelationMapper.insertByParam(messageId,needToInsert);
        }
    }

    @Override
    public ServerResponse parseH5Url(String url) {
        try {
            Document document = Jsoup.connect(url)
                    .timeout(3000)
                    .userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:23.0) Gecko/20100101 Firefox/23.0")
                    .maxBodySize(0)
                    .get();
            Element element = document.select("meta[itemprop='name']").first();
            String title = "";
            title = element.attr("content");
            System.out.println("title:"+title);
            Message message = new Message();
            message.setTitle(title);
            return ServerResponse.createBySuccess(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ServerResponse.createByError();
    }

    @Override
    public ServerResponse saveH5Message(String url,Message message,String realPath,List<String> tags) {
        if(ResponseCode.SUCCESS == saveH5Page(url,message,realPath)){
            //todo
            System.out.println(message);
            messageMapper.insert(message);
            Integer messageId = message.getId();
            List<Integer> needToInsert = findTags(tags);
            handleInsertData(messageId,needToInsert);
            return ServerResponse.createBySuccess(message);
        }else{
            return ServerResponse.createByError();
        }
    }

    @Override
    public ResponseCode saveH5Page(String urlStr,Message message,String realPath){
        try {
            String uuid = UUID.randomUUID().toString();
            int ind = urlStr.indexOf("?mobile");
            String h5Url = urlStr.substring(0,ind);
            URL url = new URL(urlStr.toString());
            InputStream input;
            input = url.openStream();   // 打开输入流
            String text = IOUtils.toString(input, "UTF-8");
            input.close();

            StringBuffer sb = new StringBuffer(text);
            int index = text.indexOf("</body>");
            // 指定位置插入js
//            sb.insert(index, "<script src=\"../../js/share.js\"></script>");
//            sb.insert(index,"<script src=\"../../js/initWxConfig.js\"></script>");
//            sb.insert(index,"<script src=\"../../js/h5-page-listen.js\"></script>");
//            sb.insert(index, "<script src=\"../../js/jweixin-1.2.0.js\"></script>");
//            sb.insert(index, "<script src=\"https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js\"></script>");
//            sb.insert(index, "<script src=\"/wechat-tools/js/weui/lib/jquery-2.1.4.js\"></script>");

            StringBuffer pagePath = new StringBuffer();
            pagePath.append("web/h5/page/").append(uuid+"/").append(h5Url.substring(h5Url.lastIndexOf("/")+1,h5Url.length())+".html");
            File dist = new File(realPath+pagePath.toString());
            FileUtils.writeStringToFile(dist, sb.toString(), "UTF-8");
            System.out.println("文件保存成功！");
            message.setDescription(pagePath.toString());
            return ResponseCode.SUCCESS;

        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseCode.ERROR;
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseCode.ERROR;
        }
    }

    @Override
    public ServerResponse parseGraphicUrl(String url) {
        String d = url.substring(url.indexOf("?d=")+3,url.length());
        System.out.println("params d = "+d);
        String url_str = "https://api.chuangkit.com/share/getShareInfoV3.do?_dataType=json&d=" + d;
        JSONObject jsonObject = HttpApi.httpsRequest(url_str,"GET",null);
        System.out.println("jsonObject:");
        System.out.println(jsonObject);
//        System.out.println(jsonObject.get("header"));
//        JSONObject header = (JSONObject) jsonObject.get("header");
        System.out.println(jsonObject.get("body"));
        JSONObject body = (JSONObject) jsonObject.get("body");
        String error = String.valueOf(body.getString("error"));
        if(error!=null && StringUtils.isNotBlank(error) && !error.equals("null")){
            return ServerResponse.createByErrorMessage(error);
        }else{
            String imgUrl = String.valueOf(body
                    .getJSONObject("bean")
                    .getString("imgUrl"));
            String designTitle = String.valueOf(body
                    .getJSONObject("bean")
                    .getString("designKindTitle"));
            System.out.println("imgUrl:"+imgUrl);
            System.out.println("designTitle:"+designTitle);
            String str = "{\"imgUrl\":\""+imgUrl+"\",\"title\":\""+designTitle+"\"}";
            System.out.println("testJsonStr:  "+str);
            JSONObject responseJson = JSONObject.parseObject(str);
            System.out.println(responseJson.toJSONString());
            return ServerResponse.createBySuccess(responseJson);
        }
    }

    @Override
    public ServerResponse saveGraphicMessage(String imgUrl, Message message, String realPath, List<String> tags) {
        if(imgUrl.indexOf("http:")<0){
            imgUrl+="http:"+imgUrl;
        }
        String picUrl = PropertiesUtil.getProperty("ftp.server.http.prefix")+this.saveImage(imgUrl,realPath);
        System.out.println("picUrl:"+picUrl);
        message.setPicUrl(picUrl);
        messageMapper.insert(message);
        Integer messageId = message.getId();
        System.out.println("messageId:"+messageId);
        List<Integer> needToInsert = findTags(tags);
        handleInsertData(messageId,needToInsert);
        return ServerResponse.createBySuccess(message);
    }

    @Override
    public String saveImage(String imgUrl,String path){
        try {
            //new一个URL对象
            URL url = new URL(imgUrl);
            //打开链接
            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            //设置请求方式为"GET"
            conn.setRequestMethod("GET");
            //超时响应时间为5秒
            conn.setConnectTimeout(5 * 1000);
            //通过输入流获取图片数据
            InputStream inStream = conn.getInputStream();
            //得到图片的二进制数据，以二进制封装得到数据，具有通用性
            byte[] data = readInputStream(inStream);
//            byte[] data = RequestUtil.getImageBytes(imgUrl);
            //new一个文件对象用来保存图片，默认保存当前工程根目录
            String uuid = UUID.randomUUID().toString();
            File imageFile = new File(path,uuid+".jpg");
            //创建输出流
            FileOutputStream outStream = new FileOutputStream(imageFile);
            //写入数据
            outStream.write(data);
            //关闭输出流
            outStream.close();
            //将imageFile上传到ftp服务器中
            FtpUtil.uploadFile(Lists.newArrayList(imageFile));
            //上传到ftp服务器中成功
            //上传完成之后删除upload下的文件
            imageFile.delete();
            return imageFile.getName();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static byte[] readInputStream(InputStream inStream) throws Exception{
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        //创建一个Buffer字符串
        byte[] buffer = new byte[1024];
        //每次读取的字符串长度，如果为-1，代表全部读取完毕
        int len = 0;
        //使用一个输入流从buffer里把数据读取出来
        while( (len=inStream.read(buffer)) != -1 ){
            //用输出流往buffer里写入数据，中间参数代表从哪个位置开始读，len代表读取的长度
            outStream.write(buffer, 0, len);
        }
        //关闭输入流
        inStream.close();
        //把outStream里的数据写入内存
        return outStream.toByteArray();
    }


}
