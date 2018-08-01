package com.wzy.crm.dao;

import com.wzy.crm.pojo.VisitPlan;
import java.util.List;
import java.util.Map;

public interface VisitPlanMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(VisitPlan record);

    VisitPlan selectByPrimaryKey(Integer id);

    List<VisitPlan> selectAll();

    int updateByPrimaryKey(VisitPlan record);

    List<VisitPlan> selectPlanByParam(Map<String,String> param);

    Integer findPlanCountByParam(Map<String, String> param);

    Integer findPlanCount(Integer customerId);
}