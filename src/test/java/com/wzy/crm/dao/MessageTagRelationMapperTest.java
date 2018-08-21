package com.wzy.crm.dao;

import com.google.common.collect.Lists;
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
public class MessageTagRelationMapperTest {

    @Autowired
    private MessageTagRelationMapper messageTagRelationMapper;

    @Test
    public void insertByParam() throws Exception {
        Integer messageId = 1;
        List<Integer> tagIds = new ArrayList<Integer>(Arrays.asList(1,2,3,4));
        System.out.println("num:"+messageTagRelationMapper.insertByParam(messageId,tagIds));
    }

}