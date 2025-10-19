package com.booster.SpringEcom.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {
}
