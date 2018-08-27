package com.wzy.crm.common;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;

public class ServerResponse<T> implements Serializable {

    private int code;
    private String status;
    private String msg;
    private T data;

    private ServerResponse(int code,String status) {
        this.code = code;
        this.status = status;
    }
    private ServerResponse(int code, String status,String msg) {
        this.code = code;
        this.status = status;
        this.msg = msg;
    }

    private ServerResponse(int code, String status,String msg, T data) {
        this.code = code;
        this.status = status;
        this.msg = msg;
        this.data = data;
    }

    private ServerResponse(int code, String msg,T data) {
        this.code = code;
        this.data = data;
    }

    @JsonIgnore
    //使之序列化后不会显示在json中
    public boolean isSuccess() {
        return this.code == ResponseCode.SUCCESS.getCode();
    }

    public int getCode() {
        return this.code;
    }

    public String getMsg() {
        return this.msg;
    }

    public String getStatus() {return this.status;}

    public T getData() {
        return this.data;
    }

    public static <T> ServerResponse<T> createBySuccess() {
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(),ResponseCode.SUCCESS.getStatus());
    }

    public static <T> ServerResponse<T> createBySuccessMessage(String msg) {
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(),ResponseCode.SUCCESS.getStatus(), msg);
    }

    public static <T> ServerResponse<T> createBySuccess(T data) {
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(),ResponseCode.SUCCESS.getStatus(), data);
    }

    public static <T> ServerResponse<T> createBySuccess(String msg, T data) {
        return new ServerResponse<T>(ResponseCode.SUCCESS.getCode(), msg, data);
    }

    public static <T> ServerResponse<T> createByError() {
        return new ServerResponse<T>(ResponseCode.ERROR.getCode(),ResponseCode.ERROR.getStatus());
    }

    public static <T> ServerResponse<T> createByErrorMessage(String errorMessage) {
        return new ServerResponse<T>(ResponseCode.ERROR.getCode(),ResponseCode.ERROR.getStatus(), errorMessage);
    }

    public static <T> ServerResponse<T> createByErrorCodeMessage(int code,String status, String errorMessage) {
        return new ServerResponse<T>(code,status,errorMessage);
    }

}
