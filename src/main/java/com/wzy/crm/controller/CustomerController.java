package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.dao.CustomerMapper;
import com.wzy.crm.dao.StaffCustomerFollowRelationMapper;
import com.wzy.crm.pojo.CustomerDetailInfo;
import com.wzy.crm.pojo.Staff;
import com.wzy.crm.service.ICustomerService;
import com.wzy.crm.common.ServerResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private ICustomerService customerService;

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private StaffCustomerFollowRelationMapper staffCustomerFollowRelationMapper;

    @GetMapping("")
    public Map<String,Object> findAll(HttpServletRequest request, HttpSession session, @RequestParam String searchValue, @RequestParam String startTime, @RequestParam String endTime){
        String draw = request.getParameter("draw");
        Integer start = Integer.valueOf(request.getParameter("start"));
        Integer length = Integer.valueOf(request.getParameter("length"));
        System.out.println("searchValue:"+searchValue);
//        String sv = request.getParameter("search[value]");
        String orderColumnIndex = request.getParameter("order[0][column]");
        String orderType = request.getParameter("order[0][dir]");
        String orderColumnName = request.getParameter("columns["+orderColumnIndex+"][name]");

        Map<String,String> param = Maps.newHashMap();
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
        List<CustomerDetailInfo> customerList = this.customerService.findCustomerByParam(param);
        Integer count = customerMapper.findCustomerCount();
        Integer filteredCount = customerMapper.findCustomerCountByParam(param);

        result.put("draw",draw);
        result.put("recordsTotal",count); //总记录数
        result.put("recordsFiltered",filteredCount); //过滤出来的数量
        result.put("data",customerList);

        return result;
    }

    @GetMapping("/getCustomerFollow")
    public ServerResponse<List<Staff>> getCustomerFollow(@RequestParam String id){
        return ServerResponse.createBySuccess(staffCustomerFollowRelationMapper.selectStaffsByParam(Integer.valueOf(id)));
    }

    @PutMapping("/relation/edit")
    public ServerResponse editCustomerStaffRelation(@RequestParam Integer customerId,@RequestParam List<Integer> staffIds){
        System.out.println("customerId:"+customerId);
        return customerService.updateFollow(customerId,staffIds);
    }

}
