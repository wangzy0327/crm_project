package com.wzy.crm.common;

import java.util.HashMap;
import java.util.Map;

public class MessageType {

    public static final Map<Integer,String> map;

    static {
        map = new HashMap();
        map.put(1,"文章");
        map.put(2,"资料");
        map.put(3,"图片");
        map.put(4,"二维码图片");
        map.put(5,"H5");
        map.put(6,"平面");
    }
}
