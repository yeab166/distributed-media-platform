package com.platform.sharing.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.common.dto.ApiResponse;
import com.platform.common.util.Constants;
import com.platform.sharing.dto.ShareRequest;
import com.platform.sharing.model.Share;
import com.platform.sharing.service.SharingService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/sharing")
public class SharingController {

    private final SharingService sharingService;

    public SharingController(SharingService sharingService) {
        this.sharingService = sharingService;
    }

    @PostMapping("/share")
    public ResponseEntity<ApiResponse<Share>> createShare(
            @RequestBody ShareRequest request,
            HttpServletRequest httpServletRequest) {
        
        String userIdHeader = httpServletRequest.getHeader(Constants.USER_ID_HEADER);
        Long userId = (userIdHeader != null) ? Long.parseLong(userIdHeader) : 1L;

        Share share = sharingService.createShare(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Media shared successfully", share));
    }

    @GetMapping("/access/{token}")
    public ResponseEntity<ApiResponse<Share>> getShareByToken(@PathVariable("token") String token) {
        return ResponseEntity.ok(ApiResponse.success("Share details found", sharingService.getShareByToken(token)));
    }

    @GetMapping("/my-shares")
    public ResponseEntity<ApiResponse<List<Share>>> getMyShares(HttpServletRequest httpServletRequest) {
        String userIdHeader = httpServletRequest.getHeader(Constants.USER_ID_HEADER);
        Long userId = (userIdHeader != null) ? Long.parseLong(userIdHeader) : 1L;

        return ResponseEntity.ok(ApiResponse.success("Your shared items retrieved", sharingService.getMyShares(userId)));
    }

    @GetMapping("/shared-with-me")
    public ResponseEntity<ApiResponse<List<Share>>> getSharedWithMe(HttpServletRequest httpServletRequest) {
        String userIdHeader = httpServletRequest.getHeader(Constants.USER_ID_HEADER);
        Long userId = (userIdHeader != null) ? Long.parseLong(userIdHeader) : 1L;

        return ResponseEntity.ok(ApiResponse.success("Items shared with you retrieved", sharingService.getSharedWithMe(userId)));
    }
}
