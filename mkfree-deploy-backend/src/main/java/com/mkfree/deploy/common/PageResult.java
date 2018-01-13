package com.mkfree.deploy.common;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by oyhk on 16/5/12.
 * 分页类
 */
@JsonIgnoreProperties(value = {"offset"})
public class PageResult<T> {
    public List<T> list = new ArrayList<>();
    public Integer totalCount = 0;
    public Integer totalPage = 0;
    public Integer pageNo = 0;
    public Integer pageSize = 10;
    public Integer offset = 0;
    public String url;
    public String prevUrl;
    public String nextUrl;

    public PageResult() {
    }

    public PageResult(Page page, String pageUrl) {
        this.init(page.getNumber(), page.getSize(), page.getTotalElements(), page.getContent());
        this.setUrl(pageUrl);
    }

    public PageResult(Integer pageNo, Integer pageSize, Long totalCount, List<T> list, String pageUrl) {
        this.init(pageNo, pageSize, totalCount, list);
        this.setUrl(pageUrl);
    }

    public PageResult(Integer pageNo, Integer pageSize, Long totalCount, List<T> list) {
        this.init(pageNo, pageSize, totalCount, list);
    }

    public PageResult(Integer pageNo, Integer pageSize, Long totalCount) {
        this(pageNo, pageSize, totalCount, null);
    }

    public PageResult(Integer pageNo, Integer pageSize) {
        this(pageNo, pageSize, null);
    }

    public void init(Integer pageNo, Integer pageSize, Long totalCount, List<T> data) {
        if (pageNo != null) {
            this.pageNo = pageNo;
        }
        if (pageSize != null) {
            this.pageSize = pageSize;
        }
        if (this.pageNo > 0) {
            this.offset = this.pageSize * this.pageNo;
        }
        if (totalCount != null) {
            this.totalCount = totalCount.intValue();
            totalPage = this.totalCount % pageSize > 0 ? this.totalCount / pageSize + 1 : this.totalCount / pageSize;
        }
        if (data != null) {
            this.list = data;
        }
    }


    public void setUrl(String url) {
        this.url = url;
        this.setPrevUrl(url + "?pageNo=" + (this.pageNo > 0 ? this.pageNo - 1 : 0) + "&pageSize=" + this.pageSize);
        this.setNextUrl(url + "?pageNo=" + (this.pageNo >= this.totalPage - 1 ? this.totalPage - 1 : this.pageNo + 1) + "&pageSize=" + this.pageSize);
    }

    public String getPrevUrl() {
        return prevUrl;
    }

    private void setPrevUrl(String prevUrl) {
        this.prevUrl = prevUrl;
    }

    public String getNextUrl() {
        return nextUrl;
    }

    private void setNextUrl(String nextUrl) {
        this.nextUrl = nextUrl;
    }
}
