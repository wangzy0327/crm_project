package com.wzy.crm.dao;

import com.google.common.collect.Maps;
import com.wzy.crm.Application;
import com.wzy.crm.pojo.GroupStaffRelation;
import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
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

    @Test
    public void selectAllStaffIdsByGroupId() throws Exception {
        Integer groupId = 30;
        List<Integer> staffIds = groupStaffRelationMapper.selectAllStaffIdsByGroupId(groupId);
        for(int i = 0;i<staffIds.size();i++){
            System.out.println((i+1)+":"+staffIds.get(i));
        }
    }


    @Test
    public void deleteByParam() throws Exception {
        Integer groupId = 30;
        String[] strs = {"wzy","yanxg"};
        List<String> staffs = Arrays.asList(strs);
        groupStaffRelationMapper.deleteByParam(groupId,staffs);
    }

    @Test
    public void selectCountByGroupId() throws Exception {
        Integer groupId = 30;
        Integer count = groupStaffRelationMapper.selectCountByGroupId(groupId);
        System.out.println("count:"+count);
    }

}