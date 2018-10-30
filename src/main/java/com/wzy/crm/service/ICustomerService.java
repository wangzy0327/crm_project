package com.wzy.crm.service;

import com.wzy.crm.pojo.CustomerDetailInfo;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.pojo.CustomerReadinfo;
import com.wzy.crm.vo.CustomerShareVo;
import com.wzy.crm.vo.CustomerVo;

import java.util.List;
import java.util.Map;

public interface ICustomerService {

    List<CustomerDetailInfo> findCustomerByParam(Map<String,String> map);

    ServerResponse updateFollow(Integer customerId,List<String> userIds);

    ServerResponse getCustomerList(CustomerVo customerVo);

    ServerResponse getCustomerListDetail(CustomerVo customerVo);

    ServerResponse saveShareCustomer(CustomerShareVo customerShareVo);

    ServerResponse updateCustomerReadInfo(CustomerReadinfo customerReadinfo);

    ServerResponse findCustomer(Integer shareId,String openid);

    ServerResponse findReadMessage(CustomerVo customerVo);

}
