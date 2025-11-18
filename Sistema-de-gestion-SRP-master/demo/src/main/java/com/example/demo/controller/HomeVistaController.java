package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeVistaController {

    @GetMapping("/")
    public String landing() {
        return "landing";
    }

    @GetMapping({"/dashboard", "/home" })
    public String index() {
        return "home/home";
    }

    @GetMapping("/home_u")
    public String userHome() {
        return "home/home_u";
    }

}
