package com.mkfree.deploy.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by oyhk on 14-6-21.
 *
 * 自动递增的工具
 *
 */
@MappedSuperclass
@JsonInclude(JsonInclude.Include.NON_NULL)//如果为空的属性，去除
@JsonIgnoreProperties(value = {"delete"})
public class IDEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;
    @Column(columnDefinition = " timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP", nullable = false)
    protected Date createdAt;
    @Column(columnDefinition = " timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP", nullable = false)
    protected Date updatedAt;
    @Column(columnDefinition = "bit default 0 comment '是否逻辑删除 1 是 , 0 否'", nullable = false, name = "is_delete")
    protected Boolean delete;

    public static final String CHECK_ID_IS_NOT_NULL = "id is not null";
    public static final String CHECK_FIELD_IS_NOT_NULL = "%s is not null";
    public static final String CHECK_BODY_IS_NOT_NULL = "body is not null";
    public static final String REMIND_RECORD_IS_NOT_EXIST = "record is not exist";
    public static final String ATTR_PAGE = "page";

    public IDEntity() {
    }

    public IDEntity(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getDelete() {
        return delete;
    }

    public void setDelete(Boolean delete) {
        this.delete = delete;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        IDEntity idEntity = (IDEntity) o;

        return id.equals(idEntity.id);

    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
