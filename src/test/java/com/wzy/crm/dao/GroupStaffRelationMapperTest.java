package com.wzy.crm.dao;

import com.google.common.collect.Maps;
import com.wzy.crm.pojo.GroupStaffRelation;
import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class GroupStaffRelationMapperTest {

    @Autowired
    private GroupStaffRelationMapper groupStaffRelationMapper;

    @Test
    public void selectStaffNameByParam() throws Exception {
        String staffName = "";
        String groupId = "30";
        Map<String,String> param = Maps.newHashMap();
        if(StringUtils.isNotEmpty(staffName)) {
            param.put("keyword", "%" + (staffName) + "%");
        }
        param.put("groupId",groupId);
        List<GroupStaffRelation> staffs =  groupStaffRelationMapper.selectStaffNameByParam(param);
        System.out.println("********************");
        for(int i = 0;i<staffs.size();i++){
            System.out.println(staffs.get(i));
        }
        System.out.println("********************");
    }

}