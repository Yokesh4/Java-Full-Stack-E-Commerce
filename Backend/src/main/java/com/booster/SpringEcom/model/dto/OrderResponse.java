package com.booster.SpringEcom.model.dto;

import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        String orderId,
        String customerName,
        String name,
        String status,
        LocalDate orderDate,
        List<OrderItemResponse> items
) {
}
