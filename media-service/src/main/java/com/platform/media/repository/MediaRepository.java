package com.platform.media.repository;

import com.platform.media.model.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MediaRepository extends JpaRepository<MediaAsset, Long> {
    List<MediaAsset> findByOwnerId(Long ownerId);
}