package com.wzy.crm.service;

import com.wzy.crm.pojo.Message;
import com.wzy.crm.common.ResponseCode;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.pojo.MessageTag;
import org.apache.http.protocol.ResponseServer;

import java.util.List;
import java.util.Map;

public interface IMessageService {
    ServerResponse saveMessage(Message message, List<String> tags);

    List<Integer> findTags(List<String> tags);

    ServerResponse parseH5Url(String url);

    ServerResponse saveH5Message(String url, Message message, List<String> tags);

    ServerResponse saveH5Page(String urlStr, String realPath);

    ServerResponse parseGraphicUrl(String url);

    ServerResponse saveGraphicMessage(String imgUrl, Message message, String realPath, List<String> tags);

    ServerResponse saveDocMessage(Message message,List<String> tags);

    String saveImage(String imgUrl,String path);

    void addTags(Integer messageId,Map<Integer,List<MessageTag>> map);

    Map<Integer, List<MessageTag>> splitTag(List<String> tags);
}
