package com.wzy.crm.wx.cp.common;

import java.util.Formatter;

public class ByteHex {
    /**
     * 方法名：byteToHex
     * 详述：字符串加密辅助方法
     * @param hash
     * @return 说明返回值含义
     */
    public static String byteToHex(final byte[] hash) {
        Formatter formatter = new Formatter();
        for (byte b : hash) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;

    }
}
