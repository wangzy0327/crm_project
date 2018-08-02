package com.wzy.crm.service.impl;

import com.wzy.crm.dao.VisitLogMapper;
import com.wzy.crm.pojo.VisitLog;
import com.wzy.crm.service.IVisitLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VisitLogServiceImpl implements IVisitLogService{

    @Autowired
    private VisitLogMapper visitLogMapper;

    @Override
    public List<VisitLog> findLogByParam(Map<String, String> param) {
        return visitLogMapper.selectLogByParam(param);
    }
}
