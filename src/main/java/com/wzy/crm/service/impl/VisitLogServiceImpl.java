package com.wzy.crm.service.impl;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.dao.CustomerTagMapper;
import com.wzy.crm.dao.CustomerTagRelationMapper;
import com.wzy.crm.dao.VisitLogMapper;
import com.wzy.crm.dao.VisitPlanMapper;
import com.wzy.crm.pojo.CustomerTag;
import com.wzy.crm.pojo.VisitLog;
import com.wzy.crm.pojo.VisitPlan;
import com.wzy.crm.service.IVisitLogService;
import org.apache.camel.spi.AsEndpointUri;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class VisitLogServiceImpl implements IVisitLogService{

    @Autowired
    private VisitLogMapper visitLogMapper;

    @Autowired
    private VisitPlanMapper visitPlanMapper;

    @Autowired
    private CustomerTagMapper customerTagMapper;

    @Autowired
    private CustomerTagRelationMapper customerTagRelationMapper;

    @Override
    public List<VisitLog> findLogByParam(Map<String, String> param) {
        return visitLogMapper.selectLogByParam(param);
    }

    @Override
    public ServerResponse addLogAndPlan(VisitLog visitLog, VisitPlan visitPlan, List<CustomerTag> tags) {
        String userId = visitLog.getUserId();
        Integer customerId = visitLog.getCustomerId();
        visitLogMapper.insert(visitLog);
        if(visitPlan!=null)
            visitPlanMapper.insert(visitPlan);
        handleCustomerTag(tags);
        handleCustomerTagRelation(customerId,tags);
        return ServerResponse.createBySuccess();
    }

    private void handleCustomerTag(List<CustomerTag> tags){
        for(int i = 0;i<tags.size();i++){
            int count = customerTagMapper.insertTag(tags.get(i));
            if(count == 0){
                CustomerTag tag = customerTagMapper.selectByKey(tags.get(i).getName());
                tags.set(i,tag);
            }
        }
    }


    private void handleCustomerTagRelation(Integer customerId,List<CustomerTag> tags){
        for(int i = 0;i<tags.size();i++){
            int count = customerTagRelationMapper.updateByCustomerIdAndTagId(customerId,tags.get(i).getId());
            if(count == 0)
                customerTagRelationMapper.insertByCustomerIdAndTagId(customerId,tags.get(i).getId());
        }
    }
}
