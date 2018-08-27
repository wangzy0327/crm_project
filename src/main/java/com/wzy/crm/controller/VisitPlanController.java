package com.wzy.crm.controller;


import com.google.common.collect.Maps;
import com.wzy.crm.dao.VisitPlanMapper;
import com.wzy.crm.pojo.VisitPlan;
import com.wzy.crm.service.IVisitPlanService;
import com.wzy.crm.common.ServerResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/plan")
public class VisitPlanController {

    @Autowired
    private IVisitPlanService visitPlanService;

    @Autowired
    private VisitPlanMapper visitPlanMapper;

    @GetMapping("")
    public Map<String,Object> findAll(HttpServletRequest request, HttpSession session,@RequestParam String customerId, @RequestParam String searchValue, @RequestParam String startTime, @RequestParam String endTime){
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
        List<VisitPlan> planList = this.visitPlanService.findPlanByParam(param);
        Integer count = this.visitPlanMapper.findPlanCount(Integer.valueOf(customerId));
        Integer filteredCount = this.visitPlanMapper.findPlanCountByParam(param);

        result.put("draw",draw);
        result.put("recordsTotal",count); //总记录数
        result.put("recordsFiltered",filteredCount); //过滤出来的数量
        result.put("data",planList);

        return result;
    }

    @GetMapping("/detail")
    public ServerResponse<VisitPlan> findPlanDetail(@RequestParam String id){
        return ServerResponse.createBySuccess(visitPlanMapper.selectByPrimaryKey(Integer.valueOf(id)));
    }

}
