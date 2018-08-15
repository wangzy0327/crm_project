package com.wzy.crm.service.impl;

import com.google.common.collect.Lists;
import com.wzy.crm.service.IFileService;
import com.wzy.crm.utils.FtpUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileServiceImpl implements IFileService {
    private Logger logger = LoggerFactory.getLogger(FileServiceImpl.class);
    //通过路径获得上传文件的路径
    @Override
    public String upload(MultipartFile file,String path){
        //获得原始文件路径名
        String fileName = file.getOriginalFilename();
//        String fileName = file.getName();
        logger.info("in service fileName is " + fileName);
        //获得扩展名
        //abc.jpg ---> jpg
        String fileExtentionName = fileName.substring(fileName.lastIndexOf(".") + 1);
        //上传文件名 防止上传形同的文件名而造成文件的覆盖
        String uploadFileName = UUID.randomUUID().toString() + "." + fileExtentionName;
        logger.info("开始上传文件，上传文件的文件名：{}，上传的路径：{},新文件名：{}",fileName,path,uploadFileName);
        //创建一个文件对象
        File fileDir = new File(path);
        logger.info("fileDir is " + fileDir.exists());
        if(!fileDir.exists()){
            //看一看该文件是否存在:如果不存在创建之
            //如果存在的话将写权限打开
            fileDir.setWritable(true);
            fileDir.mkdirs();
        }
        //在path路径下创建一个子路径或者文件
        File targetFile = new File(path,uploadFileName);
        logger.info("in service targetFile is " + targetFile);
        try {
            if(file.isEmpty()){
                return "";
            }
            //将文件提交到目的地文件系统中
            file.transferTo(targetFile);
            //文件已经上传成功
            //将targetFile上传到ftp服务器中
            FtpUtil.uploadFile(Lists.newArrayList(targetFile));
            //上传到ftp服务器中成功
            //上传完成之后删除upload下的文件
            targetFile.delete();

        } catch (IllegalStateException | IOException e) {

            logger.error("error",e);
            return null;
        }
        return targetFile.getName();
    }
}
