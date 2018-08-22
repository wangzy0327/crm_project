package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.dao.MessageMapper;
import com.wzy.crm.dao.MessageTagMapper;
import com.wzy.crm.dao.MessageTagRelationMapper;
import com.wzy.crm.pojo.Message;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.vo.ResponseCode;
import com.wzy.crm.vo.ServerResponse;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
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
    public ServerResponse parseUrl(String url) {
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
//            Element ul = document.getElementsByClass("page-list").first();
//            Elements li = ul.getElementsByTag("li");
//            System.out.println("li_size:"+li.size());
//            System.out.println("ul_li_size:"+ul.size());
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

}
