package com.wzy.crm.service;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.pojo.CustomerTag;
import com.wzy.crm.pojo.VisitLog;
import com.wzy.crm.pojo.VisitPlan;

import java.util.List;
import java.util.Map;

public interface IVisitLogService {
    List<VisitLog> findLogByParam(Map<String, String> param);

    ServerResponse addLogAndPlan(VisitLog visitLog, VisitPlan visitPlan, List<CustomerTag> tags);
}
