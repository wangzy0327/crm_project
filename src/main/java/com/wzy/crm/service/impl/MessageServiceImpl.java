package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.dao.MessageMapper;
import com.wzy.crm.dao.MessageTagMapper;
import com.wzy.crm.dao.MessageTagRelationMapper;
import com.wzy.crm.pojo.Message;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.vo.ServerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements IMessageService {

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private MessageTagMapper messageTagMapper;

    @Autowired
    private MessageTagRelationMapper messageTagRelationMapper;

    @Override
    public ServerResponse saveMessage(Message message,List<String> tags) {
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

}
