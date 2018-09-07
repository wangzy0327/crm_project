package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.Staff;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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
    public void selectByUserId() throws Exception {
        String userId = "hdy";
        Staff staff = staffMapper.selectByUserId(userId);
        System.out.println("staff: "+staff);
    }

    @Test
    public void selectUserIds() throws Exception {
        List<Integer> staffIds = Arrays.asList(1000,1001,1002);
        List<String> userIds = staffMapper.selectUserIds(staffIds);
        for(int i = 0;i<userIds.size();i++){
            System.out.println("userId:"+userIds.get(i));
        }
    }

}