package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.dao.CustomerMapper;
import com.wzy.crm.dao.StaffCustomerFollowRelationMapper;
import com.wzy.crm.pojo.CustomerDetailInfo;
import com.wzy.crm.service.ICustomerService;
import com.wzy.crm.common.ServerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CustomerServiceImpl implements ICustomerService {

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private StaffCustomerFollowRelationMapper staffCustomerFollowRelationMapper;

    @Override
    public List<CustomerDetailInfo> findCustomerByParam(Map<String,String> map) {
        return customerMapper.selectCustomerDetailByParam(map);
    }

    @Override
    public ServerResponse updateFollow(Integer customerId, List<String> userIds) {
        List<String> oldFollow = staffCustomerFollowRelationMapper.selectStaffIdsByParam(customerId);
        List<String> needToDel = Lists.newArrayList();
        List<String> needToInsert = Lists.newArrayList();
        for(int i = 0;i<oldFollow.size();i++){
            if(!userIds.contains(oldFollow.get(i)))
                needToDel.add(oldFollow.get(i));
        }
        for(int i = 0;i<userIds.size();i++){
            if(!oldFollow.contains(userIds.get(i))){
                needToInsert.add(userIds.get(i));
            }
        }
        handleFollowData(customerId,needToDel,needToInsert);
        return ServerResponse.createBySuccess();
    }

    private void handleFollowData(Integer customerId, List<String> needToDel, List<String> needToInsert){
        if(needToDel!=null&&needToDel.size()>0)
            staffCustomerFollowRelationMapper.deleteByParam(customerId,needToDel);
        if(needToInsert!=null&&needToInsert.size()>0)
            staffCustomerFollowRelationMapper.insertByParam(customerId,needToInsert);
    }

}
