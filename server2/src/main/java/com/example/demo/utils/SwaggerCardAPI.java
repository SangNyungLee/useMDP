package com.example.demo.utils;

import com.example.demo.dto.RequestDTO.RequestChangeCardOrderDTO;
import com.example.demo.dto.RequestDTO.RequestPatchCardDTO;
import com.example.demo.dto.RequestDTO.RequestPostCardDTO;
import com.example.demo.dto.ResponseDTO.APIResponseDTO;
import com.example.demo.dto.ResponseDTO.ResponseCardDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "Card Controller", description = "Card CRUD API")
public interface SwaggerCardAPI {

    @Operation(summary = "카드 조회", description = "카드 아이디로 해당 카드 조회 (checklist 포함)")
    ResponseEntity<APIResponseDTO<ResponseCardDTO>> getCard(@PathVariable String cardId, @CookieValue(name = "auth", required = false) String token);

    @Operation(summary = "카드 생성", description = "플래너 아이디로 새로운 카드 생성")
    ResponseEntity<APIResponseDTO<String>> postCard(@RequestBody RequestPostCardDTO requestPostCardDTO, @CookieValue(name = "auth", required = false) String token);

    @Operation(summary = "카드 수정", description = "플래너 아이디로 기존 카드 수정")
    ResponseEntity<APIResponseDTO<Integer>> patchCard(@RequestBody RequestPatchCardDTO requestPatchCardDTO, @CookieValue(name = "auth", required = false) String token);

    @Operation(
            summary = "카드 순서 intOrder 및 cardStatus 수정",
            description = "플래너 아이디로 기존 카드의 순서와 상태 수정")
    ResponseEntity<APIResponseDTO<Integer>> changeCardOrder(@RequestBody RequestChangeCardOrderDTO requestChangeCardOrderDTO,  @CookieValue(name = "auth", required = false) String token);

    @Operation(
            summary = "특정 카드 삭제",
            description = "카드 아이디로 해당 카드 삭제")
    ResponseEntity<APIResponseDTO<Integer>> deleteCard(@PathVariable String cardId,  @CookieValue(name = "auth", required = false) String token);
}
