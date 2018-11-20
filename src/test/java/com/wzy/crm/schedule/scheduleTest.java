package com.wzy.crm.schedule;

import com.wzy.crm.Application;
import com.wzy.crm.timer.RemindTimerTask;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Timer;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
public class scheduleTest {

    @Test
    public void testSchedule(){
        Timer timer = new Timer();
        //创建一个MyTimerTask实例
        RemindTimerTask remindTimerTask = new RemindTimerTask("NO.1");

        /**
         * 获取当前时间，并设置成距离当前时间三秒之后的时间
         * 如当前是2016-11-10 23:59:57
         * 则设置后的时间则为2016-11-11 00:00:00
         */

        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(sdf.format(calendar.getTime()));
        calendar.add(Calendar.SECOND,3);

        //schedule用法

//        1.在时间等于或超过time的时候执行且仅执行一次task
//                如在2016-11-11 00:00:00执行一次task：打印任务的名字

//        2.时间等于或超过time时首次执行task
//                之后每隔period毫秒重复执行一次task
//        如在2016-11-11 00:00:00 第一次task：打印任务的名字
        remindTimerTask.setName("schedule1");
        timer.schedule(remindTimerTask,calendar.getTime(),3000);
    }

}
