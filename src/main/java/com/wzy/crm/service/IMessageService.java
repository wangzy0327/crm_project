package com.wzy.crm.service;

import com.wzy.crm.pojo.Message;
import com.wzy.crm.vo.ResponseCode;
import com.wzy.crm.vo.ServerResponse;

import java.util.List;

public interface IMessageService {
    ServerResponse saveMessage(Message message, List<String> tags);

    List<Integer> findTags(List<String> tags);

    ServerResponse parseH5Url(String url);

    ServerResponse saveH5Message(String url, Message message, String realPath, List<String> tags);

    ResponseCode saveH5Page(String urlStr, Message message,String realPath);

    ServerResponse parseGraphicUrl(String url);

    ServerResponse saveGraphicMessage(String imgUrl, Message message, String realPath, List<String> tags);

    String saveImage(String imgUrl,String path);
}
