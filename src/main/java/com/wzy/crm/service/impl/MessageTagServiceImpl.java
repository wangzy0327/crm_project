package com.wzy.crm.service.impl;

import com.wzy.crm.dao.MessageTagMapper;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.service.IMessageTagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class MessageTagServiceImpl implements IMessageTagService {

    @Autowired
    private MessageTagMapper messageTagMapper;

    @Override
    public List<MessageTag> findMessageTagByParam(Map<String, String> param) {
        List<MessageTag> messageTags = messageTagMapper.selectMessageTagByParam(param);
        return messageTags;
    }
}
