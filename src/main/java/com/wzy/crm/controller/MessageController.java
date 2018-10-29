package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.config.DomainConfig;
import com.wzy.crm.config.NginxConfig;
import com.wzy.crm.config.PathConfig;
import com.wzy.crm.config.RequestPathConfig;
import com.wzy.crm.dao.*;
import com.wzy.crm.pojo.*;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.vo.MessageDetail;
import com.wzy.crm.vo.MessageShareVo;
import com.wzy.crm.vo.MessageVo;
import com.wzy.crm.vo.MyShareVo;
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
    private DomainConfig domainConfig;

    @Autowired
    private PathConfig pathConfig;

    @Autowired
    private NginxConfig nginxConfig;

    @Autowired
    private GroupMessageRelationMapper groupMessageRelationMapper;

    @Autowired
    private IMessageService messageService;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private MessageShareMapper messageShareMapper;

    @Autowired
    private MessageTagRelationMapper messageTagRelationMapper;


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
        String url = domainConfig.getUrl()+"/module/web/message/message-share.html";
        message.setUrl(url);
//        message.setUrl("http://crm.youitech.com/module/message/message-share.html");
        return messageService.saveMessage(message,tags);
    }

    @PostMapping("/parseH5Url")
    public ServerResponse parseH5Url(HttpServletRequest request,@RequestParam String url){
        System.out.println("url:"+url);
        String realPath = pathConfig.getPath();
        System.out.println("realPath: "+realPath);
//        String realPath = request.getSession().getServletContext().getRealPath("/");
        return messageService.saveH5Page(url,realPath);
//        return messageService.parseH5Url(url);
    }

    @PostMapping("/h5")
    public ServerResponse loadH5Message(@RequestParam Integer id){
        return messageService.findH5Message(id);
    }

    @PostMapping("/graphic")
    public ServerResponse loadGraphicMessage(@RequestParam Integer id){
        return messageService.findGraphicMessage(id);
    }

    @PostMapping("/doc")
    public ServerResponse loadDocMessage(@RequestParam Integer id){
        return messageService.findDocMessage(id);
    }

    @PostMapping("/richText")
    public ServerResponse loadRichTextMessage(@RequestParam Integer id){ return messageService.findRichTextMessage(id); }

    @PostMapping("/h5/add")
    public ServerResponse h5Add(@RequestParam String url,@RequestBody Message message){
        String h5Url = domainConfig.getUrl()+"/module/web/message/h5/h5-share.html";
        message.setUrl(h5Url);
//        message.setUrl("http://crm.youitech.com/module/message/h5/h5-share.html");
        List<String> tags = message.getTags();
        return messageService.saveH5Message(url,message,tags);
    }

    @PostMapping("/h5/update")
    public ServerResponse h5Update(@RequestBody Message message){
        String h5Url = domainConfig.getUrl()+"module/web/message/h5/h5-share.html";
        String description = message.getDescription().substring(message.getDescription().indexOf(domainConfig.getUrl())+domainConfig.getUrl().length());
        message.setDescription(description);
        message.setUrl(h5Url);
//        message.setUrl("http://crm.youitech.com/module/message/h5/h5-share.html");
        List<String> tags = message.getTags();
        return messageService.updateH5Message(message,tags);
//        return null;
    }

    @PostMapping("/graphic/update")
    public ServerResponse graphicUpdate(@RequestBody Message message,@RequestParam List<String> tags){
        String graphicUrl = domainConfig.getUrl()+"/module/web/message/graphic/graphic-share.html";
        message.setUrl(graphicUrl);
//        message.setUrl("http://crm.youitech.com/module/message/graphic/graphic-share.html");
        return messageService.updateGraphic(message,tags);
    }

    @PostMapping("/doc/update")
    public ServerResponse docUpdate(@RequestBody Message message){
        String docUrl = domainConfig.getUrl()+"/module/web/message/doc/doc-share.html";
        message.setUrl(docUrl);
//        message.setUrl("http://crm.youitech.com/module/message/doc/doc-share.html");
        return messageService.updateDocMessage(message);
    }

    @PostMapping("/richText/update")
    public ServerResponse richTextUpdate(@RequestBody Message message){
        String richTextUrl = domainConfig.getUrl()+"/module/web/message/message-share.html";
        message.setUrl(richTextUrl);
//        message.setUrl("http://crm.youitech.com/module/message/message-share.html");
        return messageService.updateDocMessage(message);
    }

    @PostMapping("/parseGraphicUrl")
    public ServerResponse parseGraphicUrl(@RequestParam String url){
        System.out.println("url:"+url);
        return messageService.parseGraphicUrl(url);
    }

    @PostMapping("/graphic/add")
    public ServerResponse graphicAdd(HttpServletRequest request,@RequestParam String imgUrl,@RequestBody Message message,@RequestParam List<String> tags){
        String realPath = request.getSession().getServletContext().getRealPath("/");
//        String realPath = "D:\\project\\wechat-tools\\target\\crm-project\\";
        System.out.println("realPath:"+realPath);
        String graphicUrl = domainConfig.getUrl()+"/module/web/message/graphic/graphic-share.html";
        message.setUrl(graphicUrl);
//        message.setUrl("http://crm.youitech.com/module/message/graphic/graphic-share.html");
        return messageService.saveGraphicMessage(imgUrl,message,realPath,tags);
    }

    @PostMapping("/doc/add")
    public ServerResponse docAdd(HttpServletRequest request,@RequestBody Message message){
        String realPath = nginxConfig.getServer();
//        String realPath = request.getSession().getServletContext().getRealPath("/");
//        String realPath = "D:\\project\\wechat-tools\\tlarget\\crm-project\\";
        System.out.println("realPath:"+realPath);
        String docUrl = domainConfig.getUrl()+"/module/web/message/doc/doc-share.html";
        message.setUrl(docUrl);
//        message.setUrl("http://crm.youitech.com/module/message/doc/doc-share.html");
        System.out.println(message);
        String contentAttach = message.getContentattach();
        System.out.println("contentAttach:{"+contentAttach+"}");
        List<String> tags = message.getTags();
        return messageService.saveDocMessage(message,tags);
    }

    @PostMapping("")
    public Map<String,Object> findAll(HttpServletRequest request, HttpSession session,@RequestParam String searchValue,@RequestParam String startTime,@RequestParam String endTime){
        String draw = request.getParameter("draw");
        Integer start = Integer.valueOf(request.getParameter("start"));
        Integer length = Integer.valueOf(request.getParameter("length"));
        System.out.println("searchValue:"+searchValue);
//        String sv = request.getParameter("search[value]");
        String orderColumnIndex = request.getParameter("order[0][column]");
        String orderType = request.getParameter("order[0][dir]");
        String orderColumnName = request.getParameter("columns["+orderColumnIndex+"][name]");

        Map<String,String> param = Maps.newHashMap();
        param.put("start",String.valueOf(start));
        param.put("length",String.valueOf(length));
        if(StringUtils.isNotEmpty(searchValue)) {
//            param.put("title","%" + (searchValue) + "%");
//            param.put("category","%" + (searchValue) + "%");
            param.put("keyword", "%" + (searchValue) + "%");
        }
        param.put("orderColumn",orderColumnName);
        param.put("orderType",orderType);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        Map<String,Object> result = Maps.newHashMap();
        List<MessageDetail> messageDetails = this.messageService.findMessageByParam(param);
        Integer count = messageMapper.findMessageCount();
        Integer filteredCount = messageMapper.findMessageCountByParam(param);

        result.put("draw",draw);
        result.put("recordsTotal",count); //总记录数
        result.put("recordsFiltered",filteredCount); //过滤出来的数量
        result.put("data",messageDetails);

        return result;

    }

    @GetMapping("/stop")
    public ServerResponse stopMessage(@RequestParam Integer id){
        System.out.println("id:"+id);
        int count = messageMapper.updateStatusStop(id);
        if(count > 0)
            return ServerResponse.createBySuccess();
        else
            return ServerResponse.createByError();
    }

    @GetMapping("/start")
    public ServerResponse startMessage(@RequestParam Integer id){
        System.out.println("id:"+id);
        int count = messageMapper.updateStatusStart(id);
        if(count > 0)
            return ServerResponse.createBySuccess();
        else
            return ServerResponse.createByError();
    }

    @DeleteMapping("/delete")
    public ServerResponse deleteMessage(@RequestParam Integer id){
        System.out.println("id:"+id);
        int count = messageMapper.deleteByPrimaryKey(id);
        messageTagRelationMapper.deleteByMessageId(id);
        if(count > 0)
            return ServerResponse.createBySuccess();
        else
            return ServerResponse.createByError();
    }

    @PostMapping("/list")
    public ServerResponse getMessageList(@RequestBody MessageVo messageVo){
        System.out.println("groupId:"+messageVo.getGroupId());
        System.out.println("tagId:"+messageVo.getTagId());
        System.out.println("order:"+messageVo.getOrder());
        return messageService.getMobileMessageList(messageVo);
    }

    @PostMapping("/share")
    public ServerResponse shareMessage(@RequestBody MessageShare messageShare){
        if(messageShare.getId()!=null){
            messageShareMapper.updateByPrimaryKey(messageShare);
        }else{
            messageShareMapper.insert(messageShare);
        }
        return ServerResponse.createBySuccess(messageShare);
    }

    @PostMapping("/share/customer")
    public ServerResponse shareMessageCustomer(@RequestBody MessageShareCustomer messageShareCustomer){
        return messageService.saveShareCustomer(messageShareCustomer);
    }

    @PostMapping("/customer/transmit")
    public ServerResponse recordCustomerTransmit(@RequestBody MessageShareTransmit messageShareTransmit){
        return messageService.saveCustomerTransmit(messageShareTransmit);
    }

    @PostMapping("/share/self")
    public ServerResponse selfShare(@RequestBody MyShareVo myShareVo){
        return messageService.findSelfShare(myShareVo);
    }

    @PostMapping("/shareDetail")
    public ServerResponse getMessageShareDetail(@RequestBody MessageShareVo messsageShareVo){
        return messageService.getMessageShareDetail(messsageShareVo);
    }

}
