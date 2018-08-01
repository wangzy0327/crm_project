package com.wzy.crm.service.impl;

import com.wzy.crm.dao.StaffMapper;
import com.wzy.crm.pojo.Staff;
import com.wzy.crm.service.IStaffService;
import com.wzy.crm.utils.MD5Util;
import com.wzy.crm.vo.ResponseCode;
import com.wzy.crm.vo.ServerResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StaffServiceImpl implements IStaffService {

    @Autowired
    private StaffMapper staffMapper;

    @Override
    public ServerResponse<Staff> saveStaff(Staff staff) {
        // 密码登录MD5
        staff.setId(null);
        if(staffMapper.selectByPhone(staff.getPhone())!=null){
            return ServerResponse.createByErrorCodeMessage(ResponseCode.DUPLICATE.getCode(),ResponseCode.DUPLICATE.getStatus(),"手机号已被注册！");
        }
        staff.setPassword(MD5Util.MD5EncodeUtf8(staff.getPassword()));
        if(this.staffMapper.insert(staff)>0){
            return ServerResponse.createBySuccess(staff);
        }else{
            return ServerResponse.createByErrorMessage("添加失败！");
        }
    }

    @Override
    public List<Staff> findAll() {
        return staffMapper.selectAll();
    }

    @Override
    public List<Staff> findStaffByParam(Map<String,String> map) {
        return staffMapper.selectStaffByParam(map);
    }

    @Override
    public ServerResponse<Staff> editStaff(Staff staff) {
        if (staffMapper.updateByPrimaryKey(staff)>0){
            return ServerResponse.createBySuccess(staff);
        }else{
            return ServerResponse.createByErrorMessage("更新失败!");
        }
    }

}
