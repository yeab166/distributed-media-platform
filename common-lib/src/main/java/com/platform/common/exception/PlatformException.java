package com.platform.common.exception;

public class PlatformException extends RuntimeException {
    private final String message;

    public PlatformException(String message) {
        super(message);
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
