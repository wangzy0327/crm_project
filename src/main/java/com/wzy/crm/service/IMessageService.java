package com.wzy.crm.service;

import com.google.common.collect.Lists;
import com.wzy.crm.pojo.Message;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.vo.ResponseCode;
import com.wzy.crm.vo.ServerResponse;

import java.util.List;

public interface IMessageService {
    ServerResponse saveMessage(Message message, List<String> tags);

    List<Integer> findTags(List<String> tags);

    ServerResponse parseUrl(String url);

    ServerResponse saveH5Message(String url, Message message, String realPath, List<String> tags);

    ResponseCode saveH5Page(String urlStr, Message message,String realPath);
}
