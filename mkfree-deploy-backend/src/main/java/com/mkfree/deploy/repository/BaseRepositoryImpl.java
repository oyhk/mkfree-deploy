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

    @Transactional
    @Override
    public <S extends T> S save(S entity) {
        try {
            Date now = new Date();
            if (entityInformation.isNew(entity)) {
                ((IDEntity) entity).setDelete(false);
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

    @Transactional
    public void softDelete(T entity) {
        Assert.notNull(entity, "The entity must not be null!");
        ((IDEntity) entity).setDelete(true);
        em.merge(entity);
    }

    @Transactional
    public void softDelete(ID id) {

        Assert.notNull(id, ID_MUST_NOT_BE_NULL);

        T entity = findOne(id);

        if (entity == null) {
            throw new EmptyResultDataAccessException(String.format("No %s entity with id %s exists!", entityInformation.getJavaType(), id), 1);
        }

        softDelete(entity);
    }

    @Transactional
    public void softDelete(Iterable<? extends T> entities) {

        Assert.notNull(entities, "The given Iterable of entities not be null!");

        for (T entity : entities) {
            softDelete(entity);
        }
    }

    @Transactional
    public void softDeleteInBatch(Iterable<T> entities) {

        Assert.notNull(entities, "The given Iterable of entities not be null!");

        if (!entities.iterator().hasNext()) {
            return;
        }

        for (T entity : entities) {
            softDelete(entity);
        }
    }

}
