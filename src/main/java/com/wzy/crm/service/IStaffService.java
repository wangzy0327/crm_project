package com.wzy.crm.service;

import com.wzy.crm.pojo.Staff;
import com.wzy.crm.vo.ServerResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

public interface IStaffService {

    ServerResponse<Staff> saveStaff(Staff staff);

    List<Staff> findAll();

    List<Staff> findStaffByParam(Map<String,String> map);

    ServerResponse<Staff> editStaff(Staff staff);

}
