package com.wzy.crm.dao;

import com.wzy.crm.pojo.VisitLog;
import com.wzy.crm.pojo.VisitPlan;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface VisitLogMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(VisitLog record);

    VisitLog selectByPrimaryKey(Integer id);

    List<VisitLog> selectAll();

    int updateByPrimaryKey(VisitLog record);

    List<VisitLog> selectLogByParam(Map<String, String> param);

    Integer findLogCountByParam(Map<String, String> param);

    Integer findLogCount(Integer customerId);

    List<VisitLog> selectByUserIdAndCustomerId(@Param("userId") String userId, @Param("customerId") Integer customerId, @Param("start")Integer start, @Param("size")Integer size);

    VisitLog selectDetailByPrimaryKey(@Param("id") Integer id);

}