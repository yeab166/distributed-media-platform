package com.platform.sharing.service;

import com.platform.common.exception.ResourceNotFoundException;
import com.platform.sharing.dto.ShareRequest;
import com.platform.sharing.model.Share;
import com.platform.sharing.repository.ShareRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SharingService {

    private final ShareRepository shareRepository;

    public SharingService(ShareRepository shareRepository) {
        this.shareRepository = shareRepository;
    }

    public Share createShare(ShareRequest request, Long ownerId) {
        String token = (request.getTargetUserId() == null) ? UUID.randomUUID().toString() : null;
        
        Share share = Share.builder()
                .mediaId(request.getMediaId())
                .ownerId(ownerId)
                .targetUserId(request.getTargetUserId())
                .shareToken(token)
                .accessType(request.getAccessType() != null ? request.getAccessType() : "READ")
                .createdAt(LocalDateTime.now())
                .expiryDate(request.getExpiryHours() != null ? 
                        LocalDateTime.now().plusHours(request.getExpiryHours()) : null)
                .build();

        return shareRepository.save(share);
    }

    public Share getShareByToken(String token) {
        Share share = shareRepository.findByShareToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Share link not found or invalid"));
        
        if (share.getExpiryDate() != null && share.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Share link has expired");
        }
        
        return share;
    }

    public List<Share> getMyShares(Long ownerId) {
        return shareRepository.findByOwnerId(ownerId);
    }

    public List<Share> getSharedWithMe(Long userId) {
        return shareRepository.findByTargetUserId(userId);
    }
}
