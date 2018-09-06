package com.wzy.crm.controller;

import com.google.common.collect.Maps;
import com.wzy.crm.dao.GroupStaffRelationMapper;
import com.wzy.crm.dao.StaffMapper;
import com.wzy.crm.pojo.GroupStaffRelation;
import com.wzy.crm.pojo.Staff;
import com.wzy.crm.service.IStaffService;
import com.wzy.crm.common.ServerResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private StaffMapper staffMapper;

    @Autowired
    private GroupStaffRelationMapper groupStaffRelationMapper;

//    @GetMapping("/hello")
//    public ServerResponse<Staff> hello(){
//        Staff staff = new Staff();
//        staff.setName("hdy");
//        staff.setPassword("123456");
//        staff.setAge(19);
//        staff.setPhone("13809880912");
//        staff.setEmail("hdy@test.com");
//        return ServerResponse.createBySuccess(staff);
//    }

    @PostMapping("/save")
    public ServerResponse<Staff> saveStaff(@RequestBody Staff staff){
        return this.staffService.saveStaff(staff);
    }

    @PutMapping("/edit")
    public ServerResponse<Staff> editStaff(@RequestBody Staff staff){
        return this.staffService.editStaff(staff);
    }

    @DeleteMapping("/delete")
    public ServerResponse deleteStaff(@RequestParam String id){
        if(this.staffMapper.deleteByPrimaryKey(Integer.parseInt(id))>0){
            return ServerResponse.createBySuccess("删除成功");
        }else{
            return ServerResponse.createByErrorMessage("删除失败");
        }
    }

    @GetMapping("")
    public Map<String,Object> findAll(HttpServletRequest request, HttpSession session,@RequestParam String searchValue,@RequestParam String startTime,@RequestParam String endTime){
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
        List<Staff> staffList = this.staffService.findStaffByParam(param);
        Integer count = staffMapper.findStaffCount();
        Integer filteredCount = staffMapper.findStaffCountByParam(param);

        result.put("draw",draw);
        result.put("recordsTotal",count); //总记录数
        result.put("recordsFiltered",filteredCount); //过滤出来的数量
        result.put("data",staffList);

        return result;
    }

    @GetMapping("/name")
    public List<GroupStaffRelation> findAllName(HttpServletRequest request, HttpSession session, @RequestParam String groupId, @RequestParam String staffName){
        Map<String,String> param = Maps.newHashMap();
        if(StringUtils.isNotEmpty(staffName)) {
            param.put("keyword", "%" + (staffName) + "%");
        }
        param.put("groupId",groupId);
        return groupStaffRelationMapper.selectStaffNameByParam(param);
    }

    @GetMapping("/one")
    public ServerResponse<Staff> findStaff(@RequestParam String id){
        return ServerResponse.createBySuccess(staffMapper.selectByPrimaryKey(Integer.parseInt(id)));
    }

    @GetMapping("/getAll")
    public ServerResponse<List<Staff>> findAllStaff(){
        return ServerResponse.createBySuccess(staffMapper.selectAll());
    }

    @PostMapping("/staffIds")
    public ServerResponse getAllStaffIds(@RequestParam Integer groupId){
        System.out.println("groupId:"+groupId);
        return ServerResponse.createBySuccess(groupStaffRelationMapper.selectAllStaffIdsByGroupId(groupId));
    }

}
