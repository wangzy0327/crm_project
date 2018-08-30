package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.dao.GroupMessageRelationMapper;
import com.wzy.crm.pojo.GroupMessageRelation;
import com.wzy.crm.pojo.Message;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.common.ServerResponse;
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

    @PostMapping("/parseH5Url")
    public ServerResponse parseH5Url(HttpServletRequest request,@RequestParam String url){
        System.out.println("url:"+url);
        String realPath = request.getSession().getServletContext().getRealPath("/");
        return messageService.saveH5Page(url,realPath);
//        return messageService.parseH5Url(url);
    }

    @PostMapping("/h5/add")
    public ServerResponse h5Add(@RequestParam String url,@RequestBody Message message){
//        String realPath = "D:\\project\\wechat-tools\\tlarget\\crm-project\\";
        message.setUrl("http://crm.youitech.com/module/web/message/h5/h5-share.html");
        List<String> tags = message.getTags();
        return messageService.saveH5Message(url,message,tags);
//        return null;
    }

    @PostMapping("/parseGraphicUrl")
    public ServerResponse parseGraphicUrl(@RequestParam String url){
        System.out.println("url:"+url);
        return messageService.parseGraphicUrl(url);
    }

    @PostMapping("/graphic/add")
    public ServerResponse graphicAdd(HttpServletRequest request,@RequestParam String imgUrl,@RequestBody Message message,@RequestParam List<String> tags){
        String realPath = request.getSession().getServletContext().getRealPath("/");
//        String realPath = "D:\\project\\wechat-tools\\tlarget\\crm-project\\";
        System.out.println("realPath:"+realPath);
        message.setUrl("http://crm.youitech.com/module/web/message/graphic/graphic-share.html");
        return messageService.saveGraphicMessage(imgUrl,message,realPath,tags);
    }

    @PostMapping("/doc/add")
    public ServerResponse docAdd(HttpServletRequest request,@RequestBody Message message){
        String realPath = request.getSession().getServletContext().getRealPath("/");
//        String realPath = "D:\\project\\wechat-tools\\tlarget\\crm-project\\";
        System.out.println("realPath:"+realPath);
        message.setUrl("http://crm.youitech.com/module/web/message/doc/doc-share.html");
        System.out.println(message);
        String contentAttach = message.getContentattach();
        System.out.println("contentAttach:{"+contentAttach+"}");
        List<String> tags = message.getTags();
        return messageService.saveDocMessage(message,tags);
    }

}
