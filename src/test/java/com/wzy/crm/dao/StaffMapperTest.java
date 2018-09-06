package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.Staff;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class StaffMapperTest {

    @Autowired
    private StaffMapper staffMapper;

    @Test
    public void insert() throws Exception {
        Staff staff = new Staff();
        staff.setName("hdy");
        int id = staffMapper.insert(staff);
        System.out.println("id:"+staff.getId());
    }

    @Test
    public void selectByPrimaryKey() throws Exception {
        Integer id = 1000;
        Staff staff = staffMapper.selectByPrimaryKey(id);
        System.out.println(staff);
    }

    @Test
    public void selectByUserId() throws Exception {
        String userId = "hdy";
        Staff staff = staffMapper.selectByUserId(userId);
        System.out.println("staff: "+staff);
    }

}