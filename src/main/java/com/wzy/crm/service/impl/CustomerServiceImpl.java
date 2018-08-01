package com.wzy.crm.service.impl;

import com.wzy.crm.dao.CustomerMapper;
import com.wzy.crm.dao.StaffCustomerFollowRelationMapper;
import com.wzy.crm.pojo.CustomerDetailInfo;
import com.wzy.crm.pojo.StaffCustomerFollowRelation;
import com.wzy.crm.service.ICustomerService;
import com.wzy.crm.vo.ServerResponse;
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
        for(int i = 0;i<oldFollow.size();i++){
            if(!staffIds.contains(oldFollow.get(i)))
                staffCustomerFollowRelationMapper.deleteByParam(customerId,oldFollow.get(i));
        }
        for(int i = 0;i<staffIds.size();i++){
            if(!oldFollow.contains(staffIds.get(i))){
                staffCustomerFollowRelationMapper.insertByParam(customerId,staffIds.get(i));
            }
        }
        return ServerResponse.createBySuccess();
    }
}
