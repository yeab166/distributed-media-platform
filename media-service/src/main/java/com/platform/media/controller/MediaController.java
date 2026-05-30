package com.platform.media.controller;

import com.platform.common.dto.ApiResponse;
import com.platform.common.util.Constants;
import com.platform.media.model.MediaAsset;
import com.platform.media.service.MediaService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }
}