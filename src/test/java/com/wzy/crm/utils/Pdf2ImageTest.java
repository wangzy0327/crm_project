package com.wzy.crm.utils;

import org.junit.Test;

import java.io.File;

import static org.junit.Assert.*;

public class Pdf2ImageTest {

    @Test
    public void change() throws Exception {
        String filePath = "test.pdf";
        File pdfFile = new File(filePath);
        Pdf2Image.change(pdfFile);
    }

}