package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.dao.GroupStaffRelationMapper;
import com.wzy.crm.service.IGroupService;
import com.wzy.crm.vo.ServerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupServiceImpl implements IGroupService {

    @Autowired
    private GroupStaffRelationMapper groupStaffRelationMapper;

    @Override
    public ServerResponse updateFollow(Integer groupId, List<Integer> staffIds) {
        List<Integer> oldFollow = groupStaffRelationMapper.selectStaffIdsByParam(groupId);
        List<Integer> needToDel = Lists.newArrayList();
        List<Integer> needToInsert = Lists.newArrayList();
        for(int i = 0;i<oldFollow.size();i++){
            if(!staffIds.contains(oldFollow.get(i)))
                needToDel.add(oldFollow.get(i));
        }
        for(int i = 0;i<staffIds.size();i++){
            if(!oldFollow.contains(staffIds.get(i))){
                needToInsert.add(staffIds.get(i));
            }
        }
        handleFollowData(groupId,needToDel,needToInsert);
        return ServerResponse.createBySuccess();
    }

    private void handleFollowData(Integer groupId, List<Integer> needToDel, List<Integer> needToInsert){
        if(needToDel!=null&&needToDel.size()>0)
            groupStaffRelationMapper.deleteByParam(groupId,needToDel);
        if(needToInsert!=null&&needToInsert.size()>0)
            groupStaffRelationMapper.insertByParam(groupId,needToInsert);
    }

}
