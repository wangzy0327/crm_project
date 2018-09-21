package com.wzy.crm.service;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.vo.CommentVo;

public interface ICommentService {

    ServerResponse saveComment(CommentVo commentVo);

    ServerResponse getCommentList(Integer visitId,Integer type);

}
