package com.platform.media.controller;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.platform.common.dto.ApiResponse;
import com.platform.common.util.Constants;
import com.platform.media.model.MediaAsset;
import com.platform.media.service.MediaService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

     @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MediaAsset>> upload(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        
        // In a real gateway setup, this ID comes from the X-Auth-User-Id header
        String userIdHeader = request.getHeader(Constants.USER_ID_HEADER);
        Long userId = (userIdHeader != null) ? Long.parseLong(userIdHeader) : 1L; // Fallback for dev

        MediaAsset asset = mediaService.uploadMedia(file, userId);
        return ResponseEntity.ok(ApiResponse.success("Media uploaded and processing started", asset));
    }
}