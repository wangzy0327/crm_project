package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.dao.CustomerMapper;
import com.wzy.crm.dao.GroupStaffRelationMapper;
import com.wzy.crm.dao.StaffCustomerFollowRelationMapper;
import com.wzy.crm.pojo.CustomerDetailInfo;
import com.wzy.crm.service.ICustomerService;
import com.wzy.crm.common.ServerResponse;
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
    private GroupStaffRelationMapper groupStaffRelationMapper;

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
            return ServerResponse.createBySuccess(staffCustomerFollowRelationMapper.selectCustomersByUserId(userId,keyword,start,size));
        }else{
//            return ServerResponse.createBySuccess(groupStaffRelationMapper.selectCustomersByGroupId(groupId,keyword,start,size));
            return ServerResponse.createBySuccess();
        }
    }

}
