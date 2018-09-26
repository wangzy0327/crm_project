package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.dao.MessageTagMapper;
import com.wzy.crm.pojo.MessageTag;
import com.wzy.crm.service.IMessageTagService;
import com.wzy.crm.common.ResponseCode;
import com.wzy.crm.common.ServerResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tag")
public class MessageTagController {


    @Autowired
    private IMessageTagService messageTagService;

    @Autowired
    private MessageTagMapper messageTagMapper;

    @GetMapping("")
    public Map<String,Object> findAll(HttpServletRequest request, HttpSession session, @RequestParam String searchValue){
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

        Map<String,Object> result = Maps.newHashMap();
        List<MessageTag> staffList = this.messageTagService.findMessageTagByParam(param);
        Integer count = messageTagMapper.findMessageTagCount();
        Integer filteredCount = messageTagMapper.findMessageTagCountByParam(param);

        result.put("draw",draw);
        result.put("recordsTotal",count); //总记录数
        result.put("recordsFiltered",filteredCount); //过滤出来的数量
        result.put("data",staffList);

        return result;
    }

    @PostMapping("/add")
    public ServerResponse addTag(@RequestBody MessageTag messageTag){
        if(messageTagMapper.selectMessageTagCountByName(messageTag.getName())<=0)
            return ServerResponse.createBySuccess(messageTagMapper.insert(messageTag));
        else{
            return ServerResponse.createByErrorCodeMessage(ResponseCode.DUPLICATE.getCode(),ResponseCode.DUPLICATE.getStatus(),ResponseCode.DUPLICATE.getDesc());
        }
    }

    @GetMapping("/one")
    public ServerResponse findTag(@RequestParam String id){
        return ServerResponse.createBySuccess(messageTagMapper.selectByPrimaryKey(Integer.valueOf(id)));
    }


    @PutMapping("/edit")
    public ServerResponse editTag(@RequestBody MessageTag messageTag){
        if(messageTagMapper.selectMessageTagCountByName(messageTag.getName())<=0)
            return ServerResponse.createBySuccess(messageTagMapper.updateByPrimaryKey(messageTag));
        else{
            return ServerResponse.createByErrorCodeMessage(ResponseCode.DUPLICATE.getCode(),ResponseCode.DUPLICATE.getStatus(),ResponseCode.DUPLICATE.getDesc());
        }
    }

    @DeleteMapping("/delete")
    public ServerResponse deleteTag(@RequestParam String id){
        return ServerResponse.createBySuccess(messageTagMapper.deleteByPrimaryKey(Integer.valueOf(id)));
    }

    @PostMapping("/hot")
    public ServerResponse getHotTag(){
        return ServerResponse.createBySuccess(messageTagMapper.selectHotTags());
    }


}
