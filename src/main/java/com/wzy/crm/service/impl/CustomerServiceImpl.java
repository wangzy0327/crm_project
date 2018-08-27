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
    public ServerResponse updateFollow(Integer customerId, List<Integer> staffIds) {
        List<Integer> oldFollow = staffCustomerFollowRelationMapper.selectStaffIdsByParam(customerId);
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
        handleFollowData(customerId,needToDel,needToInsert);
        return ServerResponse.createBySuccess();
    }

    private void handleFollowData(Integer customerId, List<Integer> needToDel, List<Integer> needToInsert){
        if(needToDel!=null&&needToDel.size()>0)
            staffCustomerFollowRelationMapper.deleteByParam(customerId,needToDel);
        if(needToInsert!=null&&needToInsert.size()>0)
            staffCustomerFollowRelationMapper.insertByParam(customerId,needToInsert);
    }

}
