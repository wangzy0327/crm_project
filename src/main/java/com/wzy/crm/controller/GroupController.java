package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.dao.GroupMapper;
import com.wzy.crm.pojo.Group;
import com.wzy.crm.service.IGroupService;
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
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private IGroupService groupService;

    @Autowired
    private GroupMapper groupMapper;

    @GetMapping("")
    public List<Group> findAll(HttpServletRequest request, HttpSession session, @RequestParam String title){
        Map<String,String> param = Maps.newHashMap();
        if(StringUtils.isNotEmpty(title)) {
            param.put("keyword", "%" + (title) + "%");
        }
        return groupMapper.selectGroupByParam(param);
    }

    @GetMapping("/one")
    public ServerResponse findGroup(@RequestParam String id){
        return ServerResponse.createBySuccess(groupMapper.selectByPrimaryKey(Integer.valueOf(id)));
    }

    @PutMapping("/edit")
    public ServerResponse editGroup(@RequestBody Group group){
        if(groupMapper.selectGroupByName(group.getId(),group.getName())<=0)
            return ServerResponse.createBySuccess(groupMapper.updateByPrimaryKey(group));
        else{
            return ServerResponse.createByErrorCodeMessage(ResponseCode.DUPLICATE.getCode(),ResponseCode.DUPLICATE.getStatus(),ResponseCode.DUPLICATE.getDesc());
        }
    }

    @PostMapping("/add")
    public ServerResponse addGroup(@RequestBody Group group){
        System.out.println(group);
        if(groupMapper.selectGroupByName(null,group.getName())<=0)
            if(groupMapper.insert(group)>0)
                return ServerResponse.createBySuccess();
            else
                return ServerResponse.createByError();
        else{
            return ServerResponse.createByErrorCodeMessage(ResponseCode.DUPLICATE.getCode(),ResponseCode.DUPLICATE.getStatus(),ResponseCode.DUPLICATE.getDesc());
        }
    }

    @DeleteMapping("/delete")
    public ServerResponse deleteGroup(@RequestParam String id){
        return ServerResponse.createBySuccess(groupMapper.deleteByPrimaryKey(Integer.valueOf(id)));
    }

    @GetMapping("/groupName")
    public Map<String,Boolean> isDuplicate(@RequestParam String title){
        Map<String,Boolean> map = Maps.newHashMap();
        if(groupMapper.selectGroupByName(null,title)<=0){
            map.put("valid",true);
        }else{
            map.put("valid",false);
        }
        return map;
    }

    @PutMapping("/staffRelation/edit")
    public ServerResponse editGroupStaffRelation(@RequestParam Integer groupId,@RequestParam List<Integer> staffIds ){
        System.out.println("groupId:"+groupId);
        return groupService.updateStaffRelation(groupId,staffIds);
    }

    @PutMapping("/messageRelation/edit")
    public ServerResponse editGroupMessageRelation(@RequestParam Integer groupId,@RequestParam List<Integer> messageIds ){
        System.out.println("groupId:"+groupId);
        return groupService.updateMessageRelation(groupId,messageIds);
    }


}
