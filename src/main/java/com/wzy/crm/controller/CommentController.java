package com.wzy.crm.controller;

import com.wzy.crm.common.ServerResponse;
import com.wzy.crm.service.ICommentService;
import com.wzy.crm.vo.CommentVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private ICommentService commentService;

    @PostMapping("/save")
    public ServerResponse saveComment(@RequestBody CommentVo commentVo){
        System.out.println("comment :"+commentVo);
        return commentService.saveComment(commentVo);
    }

    @PostMapping("/list")
    public ServerResponse loadCommentList(@RequestParam Integer visitId,@RequestParam Integer type){
        System.out.println("visitId:"+visitId);
        return commentService.getCommentList(visitId,type);
    }


}
