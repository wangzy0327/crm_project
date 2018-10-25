package com.wzy.crm.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.wzy.crm.common.MessageType;
import com.wzy.crm.config.DomainConfig;
import com.wzy.crm.config.NginxConfig;
import com.wzy.crm.dao.*;
import com.wzy.crm.pojo.*;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.utils.FtpUtil;
import com.wzy.crm.utils.HttpApi;
import com.wzy.crm.utils.PropertiesUtil;
import com.wzy.crm.common.ResponseCode;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.utils.SendWxMessage;
import com.wzy.crm.vo.MessageDetail;
import com.wzy.crm.vo.MessageResponseVo;
import com.wzy.crm.vo.MessageVo;
import com.wzy.crm.vo.MyShareVo;
import org.apache.camel.spi.AsEndpointUri;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.protocol.ResponseServer;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

@Service
public class MessageServiceImpl implements IMessageService {

    @Autowired
    private DomainConfig domainConfig;

    @Autowired
    private NginxConfig nginxConfig;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private MessageTagMapper messageTagMapper;

    @Autowired
    private MessageTagRelationMapper messageTagRelationMapper;

    @Autowired
    private MessageShareCustomerMapper messageShareCustomerMapper;

    @Autowired
    private MessageShareMapper messageShareMapper;

    @Autowired
    private MessageShareTransmitMapper messageShareTransmitMapper;

    @Autowired
    private CustomerReadinfoMapper customerReadinfoMapper;

    @Autowired
    private SendWxMessage sendWxMessage;


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
            Integer tagId = null;
            List<Integer> tagList = messageTagMapper.selectByTagName(tags.get(i));
            if(tagList == null || tagList.size() == 0){
                MessageTag messageTag = new MessageTag();
                messageTag.setName(tags.get(i));
                messageTagMapper.insert(messageTag);
                tagId = messageTag.getId();
            }else{
                tagId = tagList.get(0);
            }
            tagIds.add(tagId);
        }
        return tagIds;
    }

    @Override
    public void needToDelTags(Integer messageId){
        int count = messageTagRelationMapper.deleteByMessageId(messageId);
        System.out.println("delCount:"+count);
    }

    @Override
    public void addTags(Integer messageId,Map<Integer,List<MessageTag>> map){
        List<MessageTagRelation> messageTagRelations = new ArrayList<>();
        for(Map.Entry<Integer, List<MessageTag>> entry : map.entrySet()){
            Integer key = entry.getKey();
            List<MessageTag> messageTags = entry.getValue();
            for(int j = 0;j<messageTags.size();j++){
                List<Integer> tagList  = messageTagMapper.selectByTagName(messageTags.get(j).getName());
                if(tagList == null || tagList.size() == 0){
                    messageTagMapper.insert(messageTags.get(j));
                }else{
                    Integer tagId = tagList.get(0);
                    messageTags.get(j).setId(tagId);
                }
                MessageTagRelation messageTagRelation = new MessageTagRelation();
                messageTagRelation.setMessageId(messageId);
                messageTagRelation.setTagId(messageTags.get(j).getId());
                messageTagRelation.setPage(key);
                messageTagRelations.add(messageTagRelation);
            }
        }
        if(messageTagRelations.size()>0)
            messageTagRelationMapper.insertByMessageTagRelation(messageTagRelations);
    }

    @Override
    public Map<Integer, List<MessageTag>> splitTag(List<String> tags){
        Map<Integer,List<MessageTag>> map = Maps.newHashMap();
        if(tags!=null&&tags.size()>0){
            for(int i = 0;i<tags.size();i++){
                String [] strs = tags.get(i).split(",");
                List<MessageTag> messageTags = Lists.newArrayList();
                if(strs!=null && strs.length>0){
                    for(int j = 0;j<strs.length;j++){
                        if(StringUtils.isNotBlank(strs[j])){
                            MessageTag messageTag = new MessageTag();
                            messageTag.setName(strs[j]);
                            messageTags.add(messageTag);
                        }
                    }
                }
                if(messageTags.size()>0){
                    map.put(i,messageTags);
                }
            }
        }
        return map;
    }

    @Override
    public ServerResponse getMobileMessageList(MessageVo messageVo) {
        System.out.println("groupId:"+messageVo.getGroupId());
        System.out.println("tagId:"+messageVo.getTagId());
        System.out.println("order:"+messageVo.getOrder());
        System.out.println("page:"+messageVo.getPage());
        System.out.println("size:"+messageVo.getSize());
        Integer page = messageVo.getPage();
        Integer size = messageVo.getSize();
        String[] orders = new String[2];
        orders = messageVo.getOrder().split(" ");
        System.out.println(orders[0]);
        System.out.println(orders[1]);
        Integer start = (page - 1)*size;
        return ServerResponse.createBySuccess(messageMapper.selectMobileMessage(messageVo.getGroupId(),messageVo.getTagId(),orders[0],orders[1],start,size));
    }

    @Override
    public ServerResponse saveShareCustomer(MessageShareCustomer messageShareCustomer) {
        Integer shareId = messageShareCustomer.getShareId();
        String userId = messageShareCustomer.getUserId();
        Integer msgId = messageShareCustomer.getMessageId();
        Integer customerId = messageShareCustomer.getCustomerId();
        System.out.println("shareId:"+shareId);
        System.out.println("userId:"+userId);
        System.out.println("msgId:"+msgId);
        System.out.println("customerId:"+customerId);
        int count = messageShareCustomerMapper.insert(messageShareCustomer);
        if(count > 0)
            return ServerResponse.createBySuccess(messageShareCustomer);
        else
            return ServerResponse.createByError();
    }

    @Override
    public ServerResponse saveCustomerTransmit(MessageShareTransmit messageShareTransmit) {
        Integer customerId = messageShareTransmit.getCustomerId();
        Integer messageId = messageShareTransmit.getMessageId();
        Integer shareId = messageShareTransmit.getShareId();
        sendWxMessage.handleSendCustomerTransmit(messageShareTransmit);
        System.out.println("..........转发........");
        MessageShareTransmit messageShareTransmit1 = messageShareTransmitMapper.selectByKey(shareId);
        if(messageShareTransmit1!=null){
            messageShareTransmit.setId(messageShareTransmit1.getId());
            messageShareTransmitMapper.updateByPrimaryKey(messageShareTransmit);
        }else{
            messageShareTransmit.setTransmitTimes(1);
            messageShareTransmitMapper.insert(messageShareTransmit);
        }
        return ServerResponse.createBySuccess(messageShareTransmit);
    }

    @Override
    public ServerResponse findSelfShare(MyShareVo myShareVo) {
        System.out.println("page:"+myShareVo.getPage());
        System.out.println("size:"+myShareVo.getSize());
        String userId = myShareVo.getUserId();
        Integer page = myShareVo.getPage();
        Integer size = myShareVo.getSize();
        Integer start = (page - 1)*size;
        return ServerResponse.createBySuccess(messageShareMapper.selectSelfShare(userId,start,size));
    }

    @Override
    public ServerResponse getMessageShareDetail(String userId, Integer messageId) {
        List<MessageReadInfo> messageReadInfos = customerReadinfoMapper.selectMessageShareDetail(userId,messageId);
        System.out.println("count:"+messageReadInfos.size());
        return ServerResponse.createBySuccess(messageReadInfos);
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
    public ServerResponse findH5Message(Integer id){
        Message message = messageMapper.selectByPrimaryKey(id);
        List<String> tags = getMultiPageTags(message);
        message.setDescription(domainConfig.getUrl()+message.getDescription());
        message.setTags(tags);
        return ServerResponse.createBySuccess(message);
    }

    @Override
    public ServerResponse findGraphicMessage(Integer id){
        Message message = messageMapper.selectByPrimaryKey(id);
        List<String> tags = new ArrayList<>();
        System.out.println("nginxServer:"+nginxConfig.getServer());
        String picUrl = nginxConfig.getServer()+ message.getPicUrl();
        message.setPicUrl(picUrl);
        List<MessageTagRelation> messageTagRelations = messageTagRelationMapper.selectTags(id);
        for(int i = 0;i<messageTagRelations.size();i++){
            tags.add(messageTagRelations.get(i).getTag());
        }
        message.setTags(tags);
        return ServerResponse.createBySuccess(message);
    }

    @Override
    public ServerResponse findDocMessage(Integer id){
        Message message = messageMapper.selectByPrimaryKey(id);
        String coverPicAttach = message.getCoverpicattach();
        String[] cpa = coverPicAttach.split(",");
        List<String> coverPicAttachs = new ArrayList<>();
        System.out.println("nginxServer:"+nginxConfig.getServer());
        for(int i = 0;i<cpa.length;i++){
            coverPicAttachs.add(nginxConfig.getServer()+cpa[i]);
        }
        coverPicAttach = String.join(",",coverPicAttachs);
        message.setCoverpicattach(coverPicAttach);
        List<String> tags = getMultiPageTags(message);
        message.setTags(tags);
        return ServerResponse.createBySuccess(message);
    }

    @Override
    public ServerResponse findRichTextMessage(Integer id){
        Message message = messageMapper.selectByPrimaryKey(id);
        List<String> tags = new ArrayList<>();
        String picUrl = PropertiesUtil.getProperty("nginx.server")+ message.getPicUrl();
        message.setPicUrl(picUrl);
        List<MessageTagRelation> messageTagRelations = messageTagRelationMapper.selectTags(id);
        for(int i = 0;i<messageTagRelations.size();i++){
            tags.add(messageTagRelations.get(i).getTag());
        }
        message.setTags(tags);
        return ServerResponse.createBySuccess(message);
    }


    public List<String> getMultiPageTags(Message message){
        Integer pages = message.getPagecount();
        Integer id = message.getId();
        List<MessageTagRelation> messageTagRelations = messageTagRelationMapper.selectTags(id);
        List<String> tags = new ArrayList<>();
        for(int i = 0;i<pages;i++){
            List<String> tagStrs = new ArrayList<>();
            for(int j = 0;j<messageTagRelations.size();j++){
                if(messageTagRelations.get(j).getPage().equals(Integer.valueOf(i))){
                    tagStrs.add(messageTagRelations.get(j).getTag());
                }
            }
            if(tagStrs == null || tagStrs.size() == 0){
                tags.add("");
            }else{
                tags.add(String.join(",",tagStrs));
            }
        }
        return tags;
    }


    @Override
    public ServerResponse saveH5Message(String url,Message message,List<String> tags) {
        System.out.println(message);
        JSONObject thirdParam = JSONObject.parseObject(message.getThirdParams());
        String thirdUrl = thirdParam.getString("url");
        String thirdParamId = thirdUrl.substring(thirdUrl.lastIndexOf("/")+1,thirdUrl.length());
        System.out.println("thirdParamId:"+thirdParamId);
        message.setThirdParamId(thirdParamId);
        int count = messageMapper.insert(message);
        if (count <= 0) {
            return ServerResponse.createByError();
        }
        message.setUrl(nginxConfig.getServer()+message.getUrl());
        Map<Integer,List<MessageTag>> map = splitTag(tags);
        addTags(message.getId(),map);
        return ServerResponse.createBySuccess(message);
    }

    @Override
    public ServerResponse updateH5Message(Message message,List<String> tags) {
        System.out.println(message);
        JSONObject thirdParam = JSONObject.parseObject(message.getThirdParams());
        String thirdUrl = thirdParam.getString("url");
        String thirdParamId = thirdUrl.substring(thirdUrl.lastIndexOf("/")+1,thirdUrl.length());
        System.out.println("thirdParamId:"+thirdParamId);
        message.setThirdParamId(thirdParamId);
        int count = messageMapper.updateByPrimaryKey(message);
        if (count <= 0) {
            return ServerResponse.createByError();
        }
        Map<Integer,List<MessageTag>> map = splitTag(tags);
        needToDelTags(message.getId());
        addTags(message.getId(),map);
        return ServerResponse.createBySuccess(message);
    }

    @Override
    public ServerResponse updateGraphic(Message message,List<String> tags){
        Integer messageId = message.getId();
        needToDelTags(messageId);
        List<Integer> needToInsert = findTags(tags);
        handleInsertData(messageId,needToInsert);
        messageMapper.updateByPrimaryKey(message);
        return ServerResponse.createBySuccess(message);
    }

    @Override
    public ServerResponse updateDocMessage(Message message){
        List<String> tags = message.getTags();
        int count = messageMapper.updateByPrimaryKey(message);
        if (count <= 0) {
            return ServerResponse.createByError();
        }
        Map<Integer,List<MessageTag>> map = splitTag(tags);
        needToDelTags(message.getId());
        addTags(message.getId(),map);
        return ServerResponse.createBySuccess(message);
    }


    @Override
    public ServerResponse saveH5Page(String urlStr, String realPath){
        String thirdParamId = urlStr.substring(urlStr.lastIndexOf("/")+1,urlStr.lastIndexOf("?"));
        String thirdParamUrl = urlStr.substring(0,urlStr.lastIndexOf("?"));
        System.out.println("thirdParamUrl:"+thirdParamUrl);
        List<Message> messages = messageMapper.selectByThirdParamId(thirdParamId);
        if(messages!=null && messages.size()>0){
            return ServerResponse.createBySuccess(messages.get(0).getDescription());
        }
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
            sb.insert(index, "<script src=\"/module/web/message/h5/js/h5-page-listen.js\"></script>");
            // 指定位置插入js
//            sb.insert(index, "<script src=\"../../js/share.js\"></script>");
//            sb.insert(index,"<script src=\"../../js/initWxConfig.js\"></script>");
//            sb.insert(index,"<script src=\"../../js/h5-page-listen.js\"></script>");
//            sb.insert(index, "<script src=\"../../js/jweixin-1.2.0.js\"></script>");
//            sb.insert(index, "<script src=\"https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js\"></script>");
//            sb.insert(index, "<script src=\"/wechat-tools/js/weui/lib/jquery-2.1.4.js\"></script>");

            StringBuffer pagePath = new StringBuffer();
            pagePath.append("/web/h5/page/").append(uuid+"/").append(h5Url.substring(h5Url.lastIndexOf("/")+1,h5Url.length())+".html");
            File dist = new File(realPath+pagePath.toString());
            FileUtils.writeStringToFile(dist, sb.toString(), "UTF-8");
            System.out.println("文件保存成功！");
            String str = "{\"thirdParamUrl\":\""+thirdParamUrl+"\",\"pageUrl\":\""+pagePath+"\"}";
            System.out.println("responseJsonStr:  "+str);
            JSONObject responseJson = JSONObject.parseObject(str);
            System.out.println(responseJson.toJSONString());
            return ServerResponse.createBySuccess(responseJson);

        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ServerResponse.createByError();
        } catch (IOException e) {
            e.printStackTrace();
            return ServerResponse.createByError();
        }
    }

    @Override
    public ServerResponse parseGraphicUrl(String url) {
        String d = url.substring(url.indexOf("?d=")+3,url.length());
        System.out.println("params d = "+d);
        List<Message> messages = messageMapper.selectByThirdParamId(d);
        String imgUrl = "";
        String designTitle = "";
        if(messages == null || messages.size() == 0){
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
                imgUrl = String.valueOf(body
                        .getJSONObject("bean")
                        .getString("imgUrl"));
                designTitle = String.valueOf(body
                        .getJSONObject("bean")
                        .getString("designKindTitle"));
                System.out.println("imgUrl:"+imgUrl);
                System.out.println("designTitle:"+designTitle);
            }
        }else{
            imgUrl = PropertiesUtil.getProperty("nginx.server")+messages.get(0).getPicUrl();
            designTitle = messages.get(0).getTitle();
        }
        String str = "{\"imgUrl\":\""+imgUrl+"\",\"title\":\""+designTitle+"\",\"d\":\""+d+"\"}";
        System.out.println("testJsonStr:  "+str);
        JSONObject responseJson = JSONObject.parseObject(str);
        System.out.println(responseJson.toJSONString());
        return ServerResponse.createBySuccess(responseJson);

    }

    @Override
    public ServerResponse saveGraphicMessage(String imgUrl, Message message, String realPath, List<String> tags) {
        if(imgUrl.indexOf("http:")<0){
            imgUrl+="http:"+imgUrl;
        }
        String picUrl = this.saveImage(imgUrl,realPath);
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
    public List<MessageDetail> findMessageByParam(Map<String, String> map) {
        List<MessageDetail> messageDetails = messageMapper.selectMessageByParam(map);
        for(int i = 0;i<messageDetails.size();i++){
            MessageDetail messageDetail = messageDetails.get(i);
            Integer msgId = messageDetail.getMsgtype();
            messageDetail.setMsgName(MessageType.map.get(msgId));
        }
        return messageDetails;
    }

    @Override
    public ServerResponse saveDocMessage(Message message,List<String> tags) {
        int count = messageMapper.insert(message);
        if (count <= 0) {
            return ServerResponse.createByError();
        }
        Map<Integer,List<MessageTag>> map = splitTag(tags);
        addTags(message.getId(),map);
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
