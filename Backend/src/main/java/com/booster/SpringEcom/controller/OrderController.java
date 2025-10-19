package com.booster.SpringEcom.controller;

import com.booster.SpringEcom.model.dto.OrderRequest;
import com.booster.SpringEcom.model.dto.OrderResponse;
import com.booster.SpringEcom.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class OrderController {

    @Autowired
    public OrderService orderService;

    @PostMapping("/orders/place")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest orderRequest){

        OrderResponse orderResponse=orderService.placeOrder(orderRequest);

        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>>  getAllOrders(){

          List<OrderResponse> responses=orderService.getAllOrderResponses();

          return new ResponseEntity<>(responses,HttpStatus.OK);
    }
}
