package com.wzy.crm.task;

import com.wzy.crm.config.DomainConfig;
import com.wzy.crm.dao.CustomerMapper;
import com.wzy.crm.dao.KeywordsArticleMapper;
import com.wzy.crm.pojo.KeywordsArticle;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class KeywordPref extends QuartzJobBean {

    private static String URL = "http://news.baidu.com/ns?word=%s&pn=0&cl=2&ct=1&tn=news&rn=20&ie=utf-8&bt=0&et=0";

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private KeywordsArticleMapper keywordsArticleMapper;

    @Autowired
    private DomainConfig domainConfig;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        List<String> keywords = customerMapper.selectAllKeywords();
        SimpleDateFormat formatter = new SimpleDateFormat( "yyyy年MM月dd日 HH:mm");
        for(int i = 0;i<keywords.size();i++){
            String url = String.format(URL,keywords.get(i));
            System.out.println("url: "+url);
            try {
                //获取请求连接
                Connection con = Jsoup.connect(url);
                //请求头设置，特别是cookie设置
                con.header("Accept", "text/html, application/xhtml+xml, */*");
                con.header("Content-Type", "application/x-www-form-urlencoded");
                con.header("User-Agent", "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0))");
//            con.header("Cookie", cookie);
                Document doc = con.get();
                Elements divs = doc.select("div.result");
                for (Element element : divs) {
                    String title = element.select(".c-title a").first().text();
                    if(StringUtils.isBlank(title))
                        continue;
                    String link = element.select(".c-title a").first().attr("href");
                    String author = element.select("p.c-author").first().text().split("\\s+")[0];
                    String pubTime = element.select("p.c-author").first().text().substring(author.length()).trim();
                    if(pubTime.indexOf("小时前")>0){
                        Integer hour = Integer.valueOf(pubTime.substring(0,pubTime.indexOf("小时前")));
                        pubTime = getTimeByHour(hour);
                    }else if(pubTime.indexOf("分钟前")>0){
                        Integer minute = Integer.valueOf(pubTime.substring(0,pubTime.indexOf("小时前")));
                        pubTime = getTimeByMinute(minute);
                    }
                    Date pubDate = formatter.parse(pubTime);
                    String description = element.select("div.c-summary.c-row").first().ownText();
                    if(StringUtils.isBlank(description)){
                        description = element.select("div.c-span18.c-span-last").first().ownText();
                    }
                    System.out.println("title: "+title);
                    System.out.println("link: "+link);
                    System.out.println("author: "+author);
                    System.out.println("pubTime: "+pubTime);
                    System.out.println("description: "+description);
                    KeywordsArticle keywordsArticle = new KeywordsArticle();
                    if(title.length()>=50){
                        keywordsArticle.setTitle(title.substring(0,47)+"...");
                    }
                    else{
                        keywordsArticle.setTitle(title);
                    }
                    keywordsArticle.setDescription(description);
                    String articleUrl = domainConfig.getUrl()+"/module/web/message/news/news-share.html";
                    keywordsArticle.setUrl(articleUrl);
                    keywordsArticle.setLink(link);
                    keywordsArticle.setAuthor(author);
                    keywordsArticle.setKeyword(keywords.get(i));
                    keywordsArticle.setPubTime(pubDate);
                    int num = keywordsArticleMapper.selectByTitle(title);
                    if(num == 0){
                        keywordsArticleMapper.insert(keywordsArticle);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

    }

    public static String getTimeByHour(int hour) {

        Calendar calendar = Calendar.getInstance();

        calendar.set(Calendar.HOUR_OF_DAY, calendar.get(Calendar.HOUR_OF_DAY) - hour);

        Date date = calendar.getTime();

        return new SimpleDateFormat("yyyy年MM月dd日 HH:mm").format(calendar.getTime());

    }

    public static String getTimeByMinute(int minute) {

        Calendar calendar = Calendar.getInstance();

        calendar.set(Calendar.MINUTE, calendar.get(Calendar.MINUTE) - minute);

        Date date = calendar.getTime();

        return new SimpleDateFormat("yyyy年MM月dd日 HH:mm").format(calendar.getTime());

    }

    public static void main(String[] args) {
        SimpleDateFormat formatter = new SimpleDateFormat( "yyyy年MM月dd日 HH:mm");
        SimpleDateFormat sdf = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
             date = formatter.parse("2019年01月05日 12:02:00");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        System.out.println(sdf.format(date));
        System.out.println(getTimeByHour(18));
    }

}
