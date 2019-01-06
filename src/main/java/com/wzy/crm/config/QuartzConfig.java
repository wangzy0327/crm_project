package com.wzy.crm.config;

import com.wzy.crm.task.BooleanPref;
import com.wzy.crm.task.KeywordPref;
import com.wzy.crm.task.ScorePref;
import com.wzy.crm.task.Task3;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail testQuartz1() {
        return JobBuilder.newJob(BooleanPref.class).withIdentity("booleanPref").storeDurably().build();
    }

    @Bean
    public Trigger testQuartzTrigger1() {
        //5秒执行一次
//        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
//                .withIntervalInSeconds(2)
//                .repeatForever();
//        return TriggerBuilder.newTrigger().forJob(testQuartz1())
//                .withIdentity("testTask1")
//                .withSchedule(scheduleBuilder)
//                .build();
        return TriggerBuilder.newTrigger().forJob(testQuartz1())
                .withIdentity("testTask1")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 52 14 * * ? "))
                .build();
    }

    @Bean
    public JobDetail testQuartz2() {
        return JobBuilder.newJob(ScorePref.class).withIdentity("scorePref").storeDurably().build();
    }

    @Bean
    public Trigger testQuartzTrigger2() {
        //cron方式，每隔5秒执行一次
        return TriggerBuilder.newTrigger().forJob(testQuartz2())
                .withIdentity("testTask2")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 15 * * ? "))
                .build();
    }


    @Bean
    public JobDetail testQuartz3() {
        return JobBuilder.newJob(Task3.class).withIdentity("task3").storeDurably().build();
    }

    @Bean
    public Trigger testQuartzTrigger3() {
        //cron方式，每隔5秒执行一次
        return TriggerBuilder.newTrigger().forJob(testQuartz3())
                .withIdentity("testTask3")
                .withSchedule(CronScheduleBuilder.cronSchedule("* 0/30 * * * ? "))
                .build();
    }


    @Bean
    public JobDetail testQuartz4() {
        return JobBuilder.newJob(KeywordPref.class).withIdentity("keywordPref").storeDurably().build();
    }

    @Bean
    public Trigger testQuartzTrigger4() {
        //5秒执行一次
        return TriggerBuilder.newTrigger().forJob(testQuartz4())
                .withIdentity("testTask4")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 17 22 * * ? "))
                .build();
    }


}