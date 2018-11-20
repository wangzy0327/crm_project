package com.wzy.crm.dao;

import com.wzy.crm.Application;
import com.wzy.crm.pojo.CommentDetail;
import com.wzy.crm.vo.CommentsListVo;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class StaffCommentLogMapperTest {

    @Autowired
    private StaffCommentLogMapper staffCommentLogMapper;

    @Test
    public void selectByPrimaryKey() throws Exception {
        Integer visitId = 35;
        CommentsListVo commentsListVo = staffCommentLogMapper.selectByPrimaryKey(visitId);
        System.out.println("commentsListVoId:"+commentsListVo.getVisitId());
        List<CommentDetail> commentDetails = commentsListVo.getCommentDetail();
        for(int i = 0;i<commentDetails.size();i++){
            System.out.println(commentDetails.get(i));
        }
    }

}