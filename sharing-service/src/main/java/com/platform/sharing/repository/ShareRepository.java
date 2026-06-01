package com.platform.sharing.repository;

import com.platform.sharing.model.Share;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ShareRepository extends JpaRepository<Share, Long> {
    List<Share> findByOwnerId(Long ownerId);
    List<Share> findByTargetUserId(Long targetUserId);
    Optional<Share> findByShareToken(String shareToken);
    List<Share> findByMediaId(Long mediaId);
}
