package com.mkfree.deploy.repository;

import com.mkfree.deploy.domain.IDEntity;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by oyhk on 2017/4/13.
 */
public class BaseRepositoryImpl<T, ID extends Serializable> extends SimpleJpaRepository<T, ID> implements BaseRepository<T, ID> {

    private static final String ID_MUST_NOT_BE_NULL = "The given id must not be null!";
    private final EntityManager em;
    private final JpaEntityInformation<T, ID> entityInformation;

    public BaseRepositoryImpl(JpaEntityInformation<T, ID> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.em = entityManager;
        this.entityInformation = entityInformation;
    }

    @Override
    public <S extends T> S save(S entity) {
        try {
            Date now = new Date();
            if (entityInformation.isNew(entity)) {
                ((IDEntity) entity).setCreatedAt(now);
                ((IDEntity) entity).setUpdatedAt(now);
                em.persist(entity);
                return entity;
            } else {
                ((IDEntity) entity).setUpdatedAt(now);
                return em.merge(entity);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
