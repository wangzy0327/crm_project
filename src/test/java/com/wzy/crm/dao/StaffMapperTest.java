package com.wzy.crm.dao;

import com.wzy.crm.CrmApplication;
import com.wzy.crm.pojo.Staff;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class StaffMapperTest {

    @Autowired
    private StaffMapper staffMapper;

    @Test
    public void insert() throws Exception {
        Staff staff = new Staff();
        staff.setName("hdy");
        staff.setRole(0);
        staff.setPassword("123");
        staff.setAge(27);
        staff.setPhone("18909981778");
        int id = staffMapper.insert(staff);
        System.out.println("id:"+staff.getId());
    }

    @Test
    public void selectByPrimaryKey() throws Exception {
        Integer id = 1000;
        Staff staff = staffMapper.selectByPrimaryKey(id);
        System.out.println(staff);
    }

}