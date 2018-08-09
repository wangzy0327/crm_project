package com.wzy.crm.dao;

import com.google.common.collect.Maps;
import com.wzy.crm.pojo.GroupMessageRelation;
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
public class GroupMessageRelationMapperTest {

    @Autowired
    private GroupMessageRelationMapper groupMessageRelationMapper;

    @Test
    public void selectMessageTitleByParam() throws Exception {
        String title = "";
        String groupId = "30";
        Map<String,String> param = Maps.newHashMap();
        if(StringUtils.isNotEmpty(title)) {
            param.put("keyword", "%" + (title) + "%");
        }
        param.put("groupId",groupId);
        List<GroupMessageRelation> messages = groupMessageRelationMapper.selectMessageTitleByParam(param);
        System.out.println("***************");
        for(int i = 0;i<messages.size();i++){
            System.out.println(messages.get(i));
        }
        System.out.println("***************");
    }

}