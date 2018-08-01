package com.wzy.crm.dao;

import com.wzy.crm.pojo.Staff;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class StaffCustomerFollowRelationMapperTest {

    @Autowired
    private StaffCustomerFollowRelationMapper staffCustomerFollowRelationMapper;

    @Test
    public void selectStaffsByParam() throws Exception {
        Integer customerId = 100;
        List<Staff> staffs = staffCustomerFollowRelationMapper.selectStaffsByParam(customerId);
        System.out.println("************************");
        for(int i = 0;i<staffs.size();i++){
            System.out.println(staffs.get(i));
        }
        System.out.println("************************");
    }

}