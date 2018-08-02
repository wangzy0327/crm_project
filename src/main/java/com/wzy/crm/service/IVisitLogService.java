package com.wzy.crm.service;

import com.wzy.crm.pojo.VisitLog;

import java.util.List;
import java.util.Map;

public interface IVisitLogService {
    List<VisitLog> findLogByParam(Map<String, String> param);
}
