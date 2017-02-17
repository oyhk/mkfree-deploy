package com.mkfree.deploy.helper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

/**
 * Created by oyhk on 2017/2/9.
 */
public enum ObjectMapperHelper {

    SINGLEONE;

    public List<String> jsonToListString(ObjectMapper objectMapper, String value) throws IOException {
        return objectMapper.readValue(value, new TypeReference<List<String>>() {
        });
    }

    public List<Long> jsonToListLong(ObjectMapper objectMapper, String value)  {
        try {
            return objectMapper.readValue(value, new TypeReference<List<Long>>() {
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
