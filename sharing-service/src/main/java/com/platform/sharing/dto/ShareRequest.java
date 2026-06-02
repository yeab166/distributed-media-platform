package com.platform.sharing.dto;

public class ShareRequest {
    private Long mediaId;
    private Long targetUserId;
    private String accessType; // READ, EDIT
    private Integer expiryHours;

    public ShareRequest() {}

    public ShareRequest(Long mediaId, Long targetUserId, String accessType, Integer expiryHours) {
        this.mediaId = mediaId;
        this.targetUserId = targetUserId;
        this.accessType = accessType;
        this.expiryHours = expiryHours;
    }

    public Long getMediaId() { return mediaId; }
    public void setMediaId(Long mediaId) { this.mediaId = mediaId; }
    public Long getTargetUserId() { return targetUserId; }
    public void setTargetUserId(Long targetUserId) { this.targetUserId = targetUserId; }
    public String getAccessType() { return accessType; }
    public void setAccessType(String accessType) { this.accessType = accessType; }
    public Integer getExpiryHours() { return expiryHours; }
    public void setExpiryHours(Integer expiryHours) { this.expiryHours = expiryHours; }
}
