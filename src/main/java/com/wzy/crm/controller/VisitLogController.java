package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.mysql.fabric.Server;
import com.wzy.crm.dao.VisitLogMapper;
import com.wzy.crm.pojo.VisitLog;
import com.wzy.crm.service.IVisitLogService;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.vo.PlanAndLog;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/log")
public class VisitLogController {

    @Autowired
    private IVisitLogService visitLogService;

    @Autowired
    private VisitLogMapper visitLogMapper;

    @GetMapping("")
    public Map<String,Object> findAll(HttpServletRequest request, HttpSession session, @RequestParam String customerId, @RequestParam String searchValue, @RequestParam String startTime, @RequestParam String endTime){
        String draw = request.getParameter("draw");
        Integer start = Integer.valueOf(request.getParameter("start"));
        Integer length = Integer.valueOf(request.getParameter("length"));
        System.out.println("searchValue:"+searchValue);
//        String sv = request.getParameter("search[value]");
        String orderColumnIndex = request.getParameter("order[0][column]");
        String orderType = request.getParameter("order[0][dir]");
        String orderColumnName = request.getParameter("columns["+orderColumnIndex+"][name]");

        Map<String,String> param = Maps.newHashMap();
        param.put("customerId",customerId);
        param.put("start",String.valueOf(start));
        param.put("length",String.valueOf(length));
        if(StringUtils.isNotEmpty(searchValue)) {
//            param.put("title","%" + (searchValue) + "%");
//            param.put("category","%" + (searchValue) + "%");
            param.put("keyword", "%" + (searchValue) + "%");
        }
        param.put("orderColumn",orderColumnName);
        param.put("orderType",orderType);
        param.put("startTime",startTime);
        param.put("endTime",endTime);

        Map<String,Object> result = Maps.newHashMap();
        List<VisitLog> planList = this.visitLogService.findLogByParam(param);
        Integer count = this.visitLogMapper.findLogCount(Integer.valueOf(customerId));
        Integer filteredCount = this.visitLogMapper.findLogCountByParam(param);

        result.put("draw",draw);
        result.put("recordsTotal",count); //总记录数
        result.put("recordsFiltered",filteredCount); //过滤出来的数量
        result.put("data",planList);

        return result;
    }

    @GetMapping("/detail")
    public ServerResponse<VisitLog> findPlanDetail(@RequestParam String id){
        return ServerResponse.createBySuccess(visitLogMapper.selectByPrimaryKey(Integer.valueOf(id)));
    }

    @PostMapping("/add")
    public ServerResponse addVisitLog(@RequestBody PlanAndLog planAndLog){
        System.out.println(planAndLog);
        System.out.println(planAndLog.getTags());
        System.out.println("plan:  "+planAndLog.getVisitPlan());
        System.out.println("log:  "+planAndLog.getVisitLog());
        return visitLogService.addLogAndPlan(planAndLog.getVisitLog(),planAndLog.getVisitPlan(),planAndLog.getTags());
    }

}
