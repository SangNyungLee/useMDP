package com.example.demo.controller;

import com.example.demo.dto.LikeDTO;
import com.example.demo.dto.ResponseDTO.APIResponseDTO;
import com.example.demo.dto.ResponseDTO.ResponseLikeDTO;
import com.example.demo.dto.ResponseDTO.ResponsePlannerDTO;
import com.example.demo.repository.LikeRepository;
import com.example.demo.service.LikeService;
import com.example.demo.utils.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @GetMapping("/api/getLikes")
    public ResponseEntity<APIResponseDTO<List<Long>>> getLikes(@CookieValue(name = "auth", required = false) String token) {
        if(token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(APIResponseDTO.<List<Long>>builder()
                    .resultCode("401")
                    .message("로그인 되지 않은 사용자입니다")
                    .data(null)
                    .build());
        }

        boolean tokenExpired = JwtTokenUtil.isExpired(token, jwtTokenUtil.getSecretKey());
        if(tokenExpired) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(APIResponseDTO.<List<Long>>builder()
                    .resultCode("401")
                    .message("만료된 토큰입니다. 다시 로그인하세요")
                    .data(null)
                    .build());
        }

        String memberId = JwtTokenUtil.getMemberId(token, jwtTokenUtil.getSecretKey());
        try {
            List<Long> result = likeService.getPlanner(memberId);
            return ResponseEntity.status(HttpStatus.OK).body(APIResponseDTO.<List<Long>>builder()
                    .resultCode("200")
                    .message("memberId가 좋아요한 plannerId 리스트 반환 성공")
                    .data(result)
                    .build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponseDTO.<List<Long>>builder()
                    .resultCode("200")
                    .message("memberId가 존재하지 않음")
                    .data(null)
                    .build());
        }
    }

}