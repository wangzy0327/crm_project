package com.wzy.crm.service.impl;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.dao.CommentsMapper;
import com.wzy.crm.dao.StaffCommentLogMapper;
import com.wzy.crm.dao.StaffCommentPlanMapper;
import com.wzy.crm.pojo.Comments;
import com.wzy.crm.pojo.StaffCommentLog;
import com.wzy.crm.pojo.StaffCommentPlan;
import com.wzy.crm.service.ICommentService;
import com.wzy.crm.utils.SendWxMessage;
import com.wzy.crm.vo.CommentVo;
import com.wzy.crm.vo.CommentsListVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentServiceImpl implements ICommentService {

    @Autowired
    private SendWxMessage sendWxMessage;

    @Autowired
    private CommentsMapper commentsMapper;

    @Autowired
    private StaffCommentLogMapper staffCommentLogMapper;

    @Autowired
    private StaffCommentPlanMapper staffCommentPlanMapper;

    @Override
    public ServerResponse saveComment(CommentVo commentVo) {
        if(commentVo.getToStaff()!=null){
            sendWxMessage.handleSendCommentMessage(commentVo);
        }
        Comments comments = new Comments();
        comments.setContent(commentVo.getContent());
        commentsMapper.insert(comments);
        if(commentVo.getType().intValue() == 1){
            StaffCommentPlan staffCommentPlan = new StaffCommentPlan();
            staffCommentPlan.setCommentId(comments.getId());
            staffCommentPlan.setPlanId(commentVo.getVisitId());
            staffCommentPlan.setUserId(commentVo.getUserId());
            staffCommentPlanMapper.insert(staffCommentPlan);
        }else{
            StaffCommentLog staffCommentLog = new StaffCommentLog();
            staffCommentLog.setCommentId(comments.getId());
            staffCommentLog.setLogId(commentVo.getVisitId());
            staffCommentLog.setUserId(commentVo.getUserId());
            staffCommentLogMapper.insert(staffCommentLog);
        }
        return ServerResponse.createBySuccess();
    }

    @Override
    public ServerResponse getCommentList(Integer visitId, Integer type) {
        CommentsListVo commentsListVo = null;
        if(type.intValue() == 1){
            commentsListVo = staffCommentPlanMapper.selectByPrimaryKey(visitId);
        }else{
            commentsListVo = staffCommentLogMapper.selectByPrimaryKey(visitId);
        }
        return ServerResponse.createBySuccess(commentsListVo);
    }

}
