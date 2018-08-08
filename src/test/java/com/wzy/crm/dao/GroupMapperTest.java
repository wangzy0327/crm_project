package com.wzy.crm.dao;

import com.google.common.collect.Maps;
import com.wzy.crm.pojo.Group;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class GroupMapperTest {

    @Autowired
    private GroupMapper groupMapper;

    @Test
    public void selectAll() throws Exception {
        List<Group> groups = groupMapper.selectAll();
        System.out.println(groups);
    }

    @Test
    public void selectGroupByParam() throws Exception {
        Map<String,String> map = Maps.newHashMap();
        String title = "ad";
        map.put("keyword","%"+title+"%");
        List<Group> groups = groupMapper.selectGroupByParam(map);
        System.out.println(groups);
    }

    @Test
    public void selectGroupByName() throws Exception {
        Integer id = 1001;
        String name = "admin的默认组";
        Integer count = groupMapper.selectGroupByName(null,name);
        System.out.println("******************");
        System.out.println("count:"+count);
        System.out.println("******************");
    }

    @Test
    public void updateByPrimaryKey() throws Exception {
        Group group = new Group();
        group.setId(31);
        group.setName("admin3组");
        group.setCreateGroup(1002);
        Integer count = groupMapper.updateByPrimaryKey(group);
        System.out.println("******************");
        System.out.println("count:"+count);
        System.out.println("******************");
    }

}