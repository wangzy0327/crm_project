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

    @PostMapping("/parseUrl")
    public ServerResponse parseUrl(@RequestParam String url){
        System.out.println("url:"+url);
        return messageService.parseUrl(url);
    }

    @PostMapping("/h5/add")
    public ServerResponse h5add(HttpServletRequest request,@RequestParam String url,@RequestBody Message message,@RequestParam List<String> tags){
        String realPath = request.getSession().getServletContext().getRealPath("/");
//        String realPath = "D:\\project\\wechat-tools\\target\\crm-project\\";
        System.out.println("11111111111111");
        System.out.println("realPath:"+realPath);
        message.setUrl("http://crm.youitech.com/module/web/message/h5/h5-share.html");
        return messageService.saveH5Message(url,message,realPath,tags);
    }

}
