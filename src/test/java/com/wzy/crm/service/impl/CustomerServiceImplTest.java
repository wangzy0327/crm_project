package com.wzy.crm.service.impl;

import com.wzy.crm.dao.StaffCustomerFollowRelationMapper;
import com.wzy.crm.service.ICustomerService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class CustomerServiceImplTest {

    @Autowired
    private ICustomerService customerService;

    @Autowired
    private StaffCustomerFollowRelationMapper staffCustomerFollowRelationMapper;

    @Test
    public void updateFollow() throws Exception {

        Integer customerId = 100;
        List<Integer> staffs = new ArrayList<>(Arrays.asList(1002,1001));
        customerService.updateFollow(customerId,staffs);
        List<Integer> newFollow = staffCustomerFollowRelationMapper.selectStaffIdsByParam(customerId);
        for(int i = 0;i<newFollow.size();i++){
            System.out.println((i+1)+":"+newFollow.get(i));
        }
    }

}