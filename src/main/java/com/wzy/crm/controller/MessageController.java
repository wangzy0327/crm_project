package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.dao.GroupMessageRelationMapper;
import com.wzy.crm.dao.MessageMapper;
import com.wzy.crm.pojo.Group;
import com.wzy.crm.pojo.GroupMessageRelation;
import com.wzy.crm.pojo.Message;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.vo.ServerResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/message")
public class MessageController {


    @Autowired
    private GroupMessageRelationMapper groupMessageRelationMapper;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private IMessageService messageService;

    @GetMapping("/name")
    public List<GroupMessageRelation> findAllTitle(HttpServletRequest request, HttpSession session, @RequestParam String groupId, @RequestParam String title){
        Map<String,String> param = Maps.newHashMap();
        if(StringUtils.isNotEmpty(title)) {
            param.put("keyword", "%" + (title) + "%");
        }
        param.put("groupId",groupId);
        return groupMessageRelationMapper.selectMessageTitleByParam(param);
    }

    @PostMapping("/messageIds")
    public ServerResponse getAllStaffIds(@RequestParam Integer groupId){
        System.out.println("groupId:"+groupId);
        return ServerResponse.createBySuccess(groupMessageRelationMapper.selectAllMessageIdsByGroupId(groupId));
    }

    @PostMapping("/save/richText")
    public ServerResponse saveMessage(@RequestParam List<String> tags, @RequestBody Message message){
        System.out.println("tags:"+tags);
        for(int i = 0;i<tags.size();i++){
            System.out.println("tag"+(i+1)+":"+tags.get(i));
        }
        System.out.println("message:"+message);
        message.setUrl("http://crm.youitech.com/module/web/message/message-share.html");
        return messageService.saveMessage(message,tags);
    }

}
