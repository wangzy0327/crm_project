package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.mysql.fabric.Server;
import com.wzy.crm.dao.CustomerMapper;
import com.wzy.crm.dao.CustomerTagMapper;
import com.wzy.crm.dao.CustomerTagRelationMapper;
import com.wzy.crm.dao.StaffCustomerFollowRelationMapper;
import com.wzy.crm.pojo.*;
import com.wzy.crm.service.ICustomerService;
import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.service.IMessageService;
import com.wzy.crm.vo.CustomerShareVo;
import com.wzy.crm.vo.CustomerTagVo;
import com.wzy.crm.vo.CustomerVo;
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
    private CustomerTagRelationMapper customerTagRelationMapper;

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
    public ServerResponse editCustomerStaffRelation(@RequestParam Integer customerId,@RequestParam List<String> userIds){
        System.out.println("customerId:"+customerId);
        return customerService.updateFollow(customerId,userIds);
    }

    @GetMapping("/self")
    public ServerResponse selfCustomers(@RequestParam String userid,@RequestParam Integer page,@RequestParam Integer size){
        System.out.println("userid:"+userid);
        System.out.println("page:"+page);
        System.out.println("size:"+size);
        Integer start = (page - 1)*size;
        return ServerResponse.createBySuccess(staffCustomerFollowRelationMapper.selectCustomersByUserId(userid,"",start,size));
    }

    @PutMapping("/update")
    public ServerResponse updateCustomer(@RequestBody Customer customer){
        System.out.println("id:"+customer.getId());
        System.out.println("name:"+customer.getName());
        return ServerResponse.createBySuccess(customerMapper.updateByPrimaryKey(customer));
    }

    @GetMapping("/hot/tags")
    public ServerResponse getHotTag(){
        return ServerResponse.createBySuccess(customerTagRelationMapper.selectHotTags());
    }

    @PostMapping("/detail")
    public ServerResponse getCustomerDetail(@RequestParam Integer customerId){
        return ServerResponse.createBySuccess(customerMapper.selectByPrimaryKey(customerId));
    }

    @PostMapping("/tags")
    public ServerResponse getCustomerTags(@RequestParam Integer customerId){
        CustomerTagVo customerTagVo = customerTagRelationMapper.selectByCustomerId(customerId);
        List<CustomerTag> tags = customerTagVo.getTags();
        for(int i = 0;i<tags.size();i++){
            System.out.println(tags.get(i));
        }
        return ServerResponse.createBySuccess(customerTagRelationMapper.selectByCustomerId(customerId));
    }

    @PostMapping("/list")
    public ServerResponse listCustomers(@RequestBody CustomerVo customerVo){
        return customerService.getCustomerList(customerVo);
    }

    @GetMapping("/valid")
    public ServerResponse validCustomer(@RequestParam String mobile){
        int count = customerMapper.selectByMobile(mobile);
        if(count>0){
            return ServerResponse.createByError();
        }else{
            return ServerResponse.createBySuccess();
        }
    }

    @PostMapping("/save/share")
    public ServerResponse saveShareCustomer(@RequestBody CustomerShareVo customerShareVo){
        return customerService.saveShareCustomer(customerShareVo);
    }


}
