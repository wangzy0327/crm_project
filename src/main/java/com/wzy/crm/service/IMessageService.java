package com.wzy.crm.service;

import com.wzy.crm.pojo.Message;
import com.wzy.crm.common.ResponseCode;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.pojo.MessageShareCustomer;
import com.wzy.crm.pojo.MessageShareTransmit;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.vo.*;
import org.apache.http.protocol.ResponseServer;

import java.util.List;
import java.util.Map;

public interface IMessageService {
    ServerResponse saveMessage(Message message, List<String> tags);

    List<Integer> findTags(List<String> tags);

    ServerResponse parseH5Url(String url);

    ServerResponse findH5Message(Integer id);

    ServerResponse findGraphicMessage(Integer id);

    ServerResponse findDocMessage(Integer id);

    ServerResponse findRichTextMessage(Integer id);

    ServerResponse saveH5Message(String url, Message message, List<String> tags);

    ServerResponse updateH5Message(Message message,List<String> tags);

    ServerResponse updateGraphic(Message message,List<String> tags);

    ServerResponse updateDocMessage(Message message,List<String> tags);

    ServerResponse updateRichTextMessage(Message message,List<String> tags);

    void needToDelTags(Integer messageId);

    ServerResponse saveH5Page(String urlStr, String realPath);

    ServerResponse parseGraphicUrl(String url);

    ServerResponse saveGraphicMessage(String imgUrl, Message message, String realPath, List<String> tags);

    List<MessageDetail> findMessageByParam(Map<String,String> map);

    ServerResponse saveDocMessage(Message message,List<String> tags);

    String saveImage(String imgUrl,String path);

    void addTags(Integer messageId,Map<Integer,List<MessageTag>> map);

    Map<Integer, List<MessageTag>> splitTag(List<String> tags);

    ServerResponse getMobileMessageList(MessageVo messageVo);

    ServerResponse saveShareCustomer(MessageShareCustomer messageShareCustomer);

    ServerResponse saveCustomerTransmit(MessageShareTransmit messageShareTransmit);

    ServerResponse findSelfShare(MyShareVo myShareVo);

    ServerResponse getMessageShareDetail(MessageShareVo messageShareVo);

    ServerResponse getRecommendMessageList(String customerId);

}
