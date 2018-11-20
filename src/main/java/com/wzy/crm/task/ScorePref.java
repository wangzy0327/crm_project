package com.wzy.crm.task;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import com.wzy.crm.config.DataSourceConfig;
import com.wzy.crm.dao.ReadTimesRecommendMapper;
import com.wzy.crm.pojo.ReadTimesRecommend;
import com.wzy.crm.pojo.ReadTransmitRecommend;
import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.eval.IRStatistics;
import org.apache.mahout.cf.taste.eval.RecommenderBuilder;
import org.apache.mahout.cf.taste.eval.RecommenderEvaluator;
import org.apache.mahout.cf.taste.eval.RecommenderIRStatsEvaluator;
import org.apache.mahout.cf.taste.impl.common.LongPrimitiveIterator;
import org.apache.mahout.cf.taste.impl.eval.AverageAbsoluteDifferenceRecommenderEvaluator;
import org.apache.mahout.cf.taste.impl.eval.GenericRecommenderIRStatsEvaluator;
import org.apache.mahout.cf.taste.impl.model.jdbc.MySQLBooleanPrefJDBCDataModel;
import org.apache.mahout.cf.taste.impl.model.jdbc.MySQLJDBCDataModel;
import org.apache.mahout.cf.taste.impl.neighborhood.NearestNUserNeighborhood;
import org.apache.mahout.cf.taste.impl.recommender.GenericBooleanPrefUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.LogLikelihoodSimilarity;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.model.JDBCDataModel;
import org.apache.mahout.cf.taste.neighborhood.UserNeighborhood;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.recommender.Recommender;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class ScorePref extends QuartzJobBean {

    @Autowired
    private ReadTimesRecommendMapper readTimesRecommendMapper;

    @Autowired
    private DataSourceConfig dataSourceConfig;

    private static final Integer N = 5;

    private static final Integer RECOMMENDNUM = 3;

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        MysqlDataSource dataSource = new MysqlDataSource();
        dataSource.setURL(dataSourceConfig.getUrl());
        dataSource.setUser(dataSourceConfig.getUsername());
        dataSource.setPassword(dataSourceConfig.getPassword());
        JDBCDataModel dataModel = new MySQLJDBCDataModel(dataSource,"v_customer_read_times", "customer_id", "message_id", "times","update_time");
// JDBCDataModel dataModel = new MySQLJDBCDataModel(dataSource, "v_customer_transmit", "customer_id", "message_id", "transmit_times","update_time");
//        JDBCDataModel dataModel = new MySQLJDBCDataModel(dataSource, "v_customer_tag", "customer_id", "tag_id", "num","update_time");
//        JDBCDataModel dataModel = new MySQLBooleanPrefJDBCDataModel(dataSource, "v_customer_tag", "customer_id", "tag_id","update_time");

        DataModel model = dataModel;

        //计算相似度

        //带偏好值计算相似度
        UserSimilarity similarity = null;
        try {
            similarity = new PearsonCorrelationSimilarity(model);

        //无偏好值计算相似度
//        UserSimilarity similarity = new LogLikelihoodSimilarity(model);
        //计算阈值
        UserNeighborhood neighborhood = null;
        neighborhood = new NearestNUserNeighborhood(N, similarity, model);


            //带偏好值的推荐
        Recommender recommender = new GenericUserBasedRecommender(model,neighborhood,similarity);

            //无偏好值的推荐引擎
//            Recommender recommender = new GenericBooleanPrefUserBasedRecommender(model, neighborhood, similarity);
//            Connection con = DBUtil.getConnection();
//            Statement stmt = con.createStatement();

            //获取每个用户的推荐数据并存入数据库
            LongPrimitiveIterator iter = null;
            iter = model.getUserIDs();
            while (iter.hasNext()) {
                long uid = iter.nextLong();
                List<RecommendedItem> recommendations =
                        null;
                recommendations = recommender.recommend(uid, RECOMMENDNUM);
                System.out.println("uid: " + uid);
                for (RecommendedItem recommendedation : recommendations) {
                    System.out.println(recommendedation);
                    ReadTimesRecommend readTimesRecommend = new ReadTimesRecommend();
                    readTimesRecommend.setCustomerId(Long.valueOf(uid).intValue());
                    readTimesRecommend.setMessageId(Long.valueOf(recommendedation.getItemID()).intValue());
                    readTimesRecommend.setValue(Float.valueOf(recommendedation.getValue()).doubleValue());
                    readTimesRecommendMapper.insert(readTimesRecommend);
                }
            }


            RecommenderEvaluator evaluator = new AverageAbsoluteDifferenceRecommenderEvaluator();
            RecommenderBuilder recommenderBuilder = new RecommenderBuilder() {
                public Recommender buildRecommender(DataModel dataModel) throws TasteException {
                    UserSimilarity similarity = new PearsonCorrelationSimilarity(dataModel);
                    UserNeighborhood neighborhood = new NearestNUserNeighborhood(3, similarity, dataModel);
                    return new GenericUserBasedRecommender(dataModel, neighborhood, similarity);
                }
            };
            //evaluate()的最后一个参数是0.05.这意味着仅有5%的数据用于评估。这纯粹是为了方便；评估是一个耗时的过程，使用全部数据绘花上几个小时
            double score = evaluator.evaluate(recommenderBuilder, null, model, 0.8, 1);
            System.out.println("平均误差:" + score);

            RecommenderIRStatsEvaluator evaluator1 = new GenericRecommenderIRStatsEvaluator();

            IRStatistics stats = evaluator1.evaluate(
                    recommenderBuilder, null, model, null, 3,
                    GenericRecommenderIRStatsEvaluator.CHOOSE_THRESHOLD, 1.0);

            System.out.println("精准率:" + stats.getPrecision());
            System.out.println("召回率:" + stats.getRecall());
        } catch (TasteException e) {
            e.printStackTrace();
        }


        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("ScorePref----" + sdf.format(new Date()));
    }
}
