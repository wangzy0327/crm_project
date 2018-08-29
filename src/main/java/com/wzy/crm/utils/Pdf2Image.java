package com.wzy.crm.utils;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;

import javax.imageio.ImageIO;

public class Pdf2Image {


    /***
     * PDF文件转PNG图片，全部页数
     *
     * @param PdfFilePath pdf完整路径
     * @param dstImgFolder 图片存放的文件夹
     * @param dpi dpi越大转换后越清晰，相对转换速度越慢
     * @return
     */
    public static List<String> change(File inputFile) throws IOException {
        //TODO 校验输入文件是否存在 以及是否为PDF
        //TODO 对于PDF加密后的处理
        PDDocument document = null;
        try {
            document = PDDocument.load(inputFile);
            int size = document.getNumberOfPages();
            List<BufferedImage> picList = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                BufferedImage image = new PDFRenderer(document).renderImageWithDPI(i, 130, ImageType.RGB);
                picList.add(image);
            }
            document.close();
            List<String> imgNames = new ArrayList<>();
            for (int j = 0; j < picList.size(); j++) {
                BufferedImage image = picList.get(j);
                String uuid = UUID.randomUUID().toString();
                String imgName = uuid + "__pdf__pic_" + (j + 1) + ".png";
                imgNames.add(imgName);
                ImageIO.write(image, "png", new File(imgName));
            }
            return imgNames;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

}
