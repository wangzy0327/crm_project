package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.dao.MessageMapper;
import com.wzy.crm.pojo.Group;
import com.wzy.crm.pojo.Message;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageMapper messageMapper;

    @GetMapping("/name")
    public List<Message> findAllTitle(HttpServletRequest request, HttpSession session, @RequestParam String title){
        Map<String,String> param = Maps.newHashMap();
        if(StringUtils.isNotEmpty(title)) {
            param.put("keyword", "%" + (title) + "%");
        }
        return messageMapper.selectMessageTitleByParam(param);
    }

}
