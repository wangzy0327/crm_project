package com.wzy.crm.vo;

import com.wzy.crm.pojo.CommentDetail;
import lombok.Data;

import java.util.List;

@Data
public class CommentsListVo {

    private Integer visitId;

    private List<CommentDetail> commentDetail;

}
