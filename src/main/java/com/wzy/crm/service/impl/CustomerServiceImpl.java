package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.dao.CustomerMapper;
import com.wzy.crm.dao.GroupStaffRelationMapper;
import com.wzy.crm.dao.StaffCustomerCreateRelationMapper;
import com.wzy.crm.dao.StaffCustomerFollowRelationMapper;
import com.wzy.crm.pojo.*;
import com.wzy.crm.service.ICustomerService;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.vo.CustomerShareVo;
import com.wzy.crm.vo.CustomerVo;
import org.apache.commons.lang3.StringUtils;
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

    @Autowired
    private StaffCustomerCreateRelationMapper staffCustomerCreateRelationMapper;

    @Autowired
    private GroupStaffRelationMapper groupStaffRelationMapper;

    @Autowired
    private IMessageService messageService;

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

    @Override
    public ServerResponse getCustomerList(CustomerVo customerVo){
        String userId = customerVo.getUserId();
        Integer page = customerVo.getPage();
        Integer size = customerVo.getSize();
        Integer groupId = customerVo.getGroupId();
        String keyword = customerVo.getSearchInput();
        if(StringUtils.isNotBlank(keyword)){
            keyword = "%"+keyword+"%";
        }
        Integer start = (page - 1)*size;
        if(userId!=null){
            List<Customer> customers = staffCustomerFollowRelationMapper.selectCustomersByUserId(userId,keyword,start,size);
            if(customers.size()>0){
                return ServerResponse.createBySuccess(customers);
            }else{
                return ServerResponse.createBySuccess();
            }
        }else{
            return ServerResponse.createBySuccess(groupStaffRelationMapper.selectCustomersByGroupId(groupId,keyword,start,size));
        }
    }

    @Override
    public ServerResponse saveShareCustomer(CustomerShareVo customerShareVo) {
        Customer customer = customerShareVo.getCustomer();
        System.out.println("customer:"+customer);
        customerMapper.insert(customer);
        System.out.println("save customer:"+customer);
        StaffCustomerFollowRelation staffCustomerFollowRelation = new StaffCustomerFollowRelation();
        staffCustomerFollowRelation.setUserId(customerShareVo.getUserId());
        staffCustomerFollowRelation.setCustomerId(customer.getId());
        staffCustomerFollowRelation.setIsFollow(1);
        staffCustomerFollowRelationMapper.insert(staffCustomerFollowRelation);
        StaffCustomerCreateRelation staffCustomerCreateRelation = new StaffCustomerCreateRelation();
        staffCustomerCreateRelation.setUserId(customerShareVo.getUserId());
        staffCustomerCreateRelation.setCustomerId(customer.getId());
        staffCustomerCreateRelation.setIsCreate(1);
        staffCustomerCreateRelationMapper.insert(staffCustomerCreateRelation);
        MessageShareCustomer messageShareCustomer = new MessageShareCustomer();
        messageShareCustomer.setUserId(customerShareVo.getUserId());
        messageShareCustomer.setMessageId(customerShareVo.getMessageId());
        messageShareCustomer.setShareId(customerShareVo.getShareId());
        messageShareCustomer.setCustomerId(customerShareVo.getCustomer().getId());
        messageShareCustomer.setOpenId(customerShareVo.getCustomer().getOpenId());
        return messageService.saveShareCustomer(messageShareCustomer);
    }


}
