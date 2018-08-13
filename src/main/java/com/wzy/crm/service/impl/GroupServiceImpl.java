package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.dao.GroupMessageRelationMapper;
import com.wzy.crm.dao.GroupStaffRelationMapper;
import com.wzy.crm.pojo.GroupMessageRelation;
import com.wzy.crm.service.IGroupService;
import com.wzy.crm.vo.ServerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupServiceImpl implements IGroupService {

    @Autowired
    private GroupStaffRelationMapper groupStaffRelationMapper;

    @Autowired
    private GroupMessageRelationMapper groupMessageRelationMapper;

    @Override
    public ServerResponse updateStaffRelation(Integer groupId, List<Integer> staffIds) {
        List<Integer> oldRel = groupStaffRelationMapper.selectStaffIdsByParam(groupId);
        List<Integer> needToDel = Lists.newArrayList();
        List<Integer> needToInsert = Lists.newArrayList();
        for(int i = 0;i<oldRel.size();i++){
            if(!staffIds.contains(oldRel.get(i)))
                needToDel.add(oldRel.get(i));
        }
        for(int i = 0;i<staffIds.size();i++){
            if(!oldRel.contains(staffIds.get(i))){
                needToInsert.add(staffIds.get(i));
            }
        }
        handleStaffRelData(groupId,needToDel,needToInsert);
        return ServerResponse.createBySuccess();
    }

    @Override
    public ServerResponse updateMessageRelation(Integer groupId, List<Integer> messageIds) {
        List<Integer> oldRel = groupMessageRelationMapper.selectMessageIdsByParam(groupId);
        List<Integer> needToDel = Lists.newArrayList();
        List<Integer> needToInsert = Lists.newArrayList();
        for(int i = 0;i<oldRel.size();i++){
            if(!messageIds.contains(oldRel.get(i)))
                needToDel.add(oldRel.get(i));
        }
        for(int i = 0;i<messageIds.size();i++){
            if(!oldRel.contains(messageIds.get(i))){
                needToInsert.add(messageIds.get(i));
            }
        }
        handleMessageRelData(groupId,needToDel,needToInsert);
        return ServerResponse.createBySuccess();
    }

    private void handleMessageRelData(Integer groupId, List<Integer> needToDel, List<Integer> needToInsert){
        synchronized (this){
            if(needToDel!=null&&needToDel.size()>0)
                groupMessageRelationMapper.deleteByParam(groupId,needToDel);
            if(needToInsert!=null&&needToInsert.size()>0)
                groupMessageRelationMapper.insertByParam(groupId,needToInsert);
        }
    }

    private void handleStaffRelData(Integer groupId, List<Integer> needToDel, List<Integer> needToInsert){
        synchronized (this){
            if(needToDel!=null&&needToDel.size()>0)
                groupStaffRelationMapper.deleteByParam(groupId,needToDel);
            if(needToInsert!=null&&needToInsert.size()>0)
                groupStaffRelationMapper.insertByParam(groupId,needToInsert);
        }
    }

}
