package com.wzy.crm.service;

import com.wzy.crm.pojo.CustomerDetailInfo;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.vo.CustomerVo;

import java.util.List;
import java.util.Map;

public interface ICustomerService {

    List<CustomerDetailInfo> findCustomerByParam(Map<String,String> map);

    ServerResponse updateFollow(Integer customerId,List<String> userIds);

    ServerResponse getCustomerList(CustomerVo customerVo);


}
