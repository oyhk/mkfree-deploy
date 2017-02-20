package com.mkfree.deploy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledUpdatesOnTopic {

    @Autowired
    private SimpMessagingTemplate template;

    @Scheduled(cron = "0/1 * * * * *")
    public void publishUpdates() throws InterruptedException {
            template.convertAndSend("/log/log1", new Greeting("123123"));
    }

}
