package com.wzy.crm.service;

import com.wzy.crm.pojo.Message;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.vo.ServerResponse;

import java.util.List;

public interface IMessageService {
    ServerResponse saveMessage(Message message, List<String> tags);
    List<Integer> findTags(List<String> tags);
}
