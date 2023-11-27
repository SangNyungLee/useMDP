package com.example.demo.service;

import com.example.demo.dto.CardDTO;
import com.example.demo.dto.ChecklistDTO;
import com.example.demo.dto.RequestDTO.RequestChangeCardOrderDTO;
import com.example.demo.dto.RequestDTO.RequestChecklistDTO;
import com.example.demo.dto.RequestDTO.RequestPatchCardDTO;
import com.example.demo.dto.RequestDTO.RequestPostCardDTO;
import com.example.demo.dto.ResponseDTO.APIResponseDTO;
import com.example.demo.dto.ResponseDTO.ResponseChecklistDTO;
import com.example.demo.entity.CardEntity;
import com.example.demo.entity.ChecklistEntity;
import com.example.demo.entity.MemberEntity;
import com.example.demo.entity.PlannerEntity;
import com.example.demo.repository.CardRepository;
import com.example.demo.repository.ChecklistRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.PlannerRepository;
import com.example.demo.utils.DTOConversionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CardService {

    @Autowired
    private PlannerRepository plannerRepository;
    @Autowired
    private CardRepository cardRepository;
    @Autowired
    private ChecklistRepository checklistRepository;
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private DTOConversionUtil dtoConversionUtil;


    public int postCard(RequestPostCardDTO requestPostCardDTO, String memberId) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(memberId);
        if(optionalMemberEntity.isEmpty()) {
            return 0;
        }

        MemberEntity memberEntity = optionalMemberEntity.get();
        Optional<PlannerEntity> optionalPlannerEntity = plannerRepository.findById(requestPostCardDTO.getPlannerId());
        if(optionalPlannerEntity.isEmpty()) {
            return 0;
        }

        PlannerEntity plannerEntity = optionalPlannerEntity.get();
        CardEntity cardEntity = dtoConversionUtil.toCardEntity(requestPostCardDTO, plannerEntity);

        CardEntity savedCardEntity = cardRepository.save(cardEntity);
        List<RequestChecklistDTO> checklistDTOS = requestPostCardDTO.getChecklists();

        List<ChecklistEntity> checklistEntities = checklistDTOS.stream().map(checklistDTO -> dtoConversionUtil.toChecklistEntity(checklistDTO, savedCardEntity)).toList();
        checklistRepository.saveAll(checklistEntities);
        return 1;
    }

    public int patchCard(RequestPatchCardDTO requestPatchCardDTO, String memberId) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(memberId);
        if(optionalMemberEntity.isEmpty()) {
            return 0;
        }
        Optional<PlannerEntity> optionalPlannerEntity = plannerRepository.findById(requestPatchCardDTO.getPlannerId());
        if(optionalPlannerEntity.isEmpty()) {
            return 0;
        }
        Optional<CardEntity> optionalCardEntity = cardRepository.findById(requestPatchCardDTO.getCardId());
        if(optionalCardEntity.isEmpty()) {
            return 0;
        }

        MemberEntity memberEntity = optionalMemberEntity.get();
        PlannerEntity plannerEntity = optionalPlannerEntity.get();
        CardEntity cardEntity = optionalCardEntity.get();
        List<ChecklistEntity> checklistEntities  = requestPatchCardDTO.getChecklists().stream().map(requestChecklistDTO -> dtoConversionUtil.toChecklistEntity(requestChecklistDTO, cardEntity)).toList();
        CardEntity newCardEntity = CardEntity.builder()
                .cardId(cardEntity.getCardId())
                .title(requestPatchCardDTO.getTitle())
                .coverColor(requestPatchCardDTO.getCoverColor())
                .post(requestPatchCardDTO.getPost())
                .intOrder(requestPatchCardDTO.getIntOrder())
                .startDate(requestPatchCardDTO.getStartDate())
                .endDate(requestPatchCardDTO.getEndDate())
                .cardStatus(requestPatchCardDTO.getCardStatus())
                .createdAt(cardEntity.getCreatedAt())
                .plannerEntity(plannerEntity)
                .checklists(checklistEntities)
                .build();
        CardEntity updatedCardEntity = cardRepository.save(newCardEntity);
        return 1;
    }

    public int changeCardOrder(RequestChangeCardOrderDTO requestChangeCardOrderDTO) {
        Optional<PlannerEntity> optionalPlannerEntity = plannerRepository.findById(requestChangeCardOrderDTO.getPlannerId());
        if(optionalPlannerEntity.isPresent()) {
            PlannerEntity originalPlannerEntity = optionalPlannerEntity.get();

            Optional<CardEntity> optionalCardEntity = cardRepository.findById(requestChangeCardOrderDTO.getSourceCardId());
            if(optionalCardEntity.isPresent()) {
                CardEntity originalCardEntity = optionalCardEntity.get();

                cardRepository.handleOriginalPosition(requestChangeCardOrderDTO);
                cardRepository.handleNewPosition(requestChangeCardOrderDTO);

                CardEntity updatedCardEntity = CardEntity.builder()
                        .cardId(originalCardEntity.getCardId())
                        .title(originalCardEntity.getTitle())
                        .coverColor(originalCardEntity.getCoverColor())
                        .post(originalCardEntity.getPost())
                        .intOrder(requestChangeCardOrderDTO.getDestinationCardOrder())
                        .startDate(originalCardEntity.getStartDate())
                        .endDate(originalCardEntity.getEndDate())
                        .cardStatus(requestChangeCardOrderDTO.getDestinationCardStatus())
                        .createdAt(originalCardEntity.getCreatedAt())
                        .plannerEntity(originalPlannerEntity)
                        .build();

                cardRepository.save(updatedCardEntity);
                return 1;
            } else {
                return 0;
            }

        } else {
            return 0;
        }


    }

    public int deleteCard(String cardId) {
        Optional<CardEntity> card = cardRepository.findById(cardId);
        if(card.isEmpty()) {
            return 0;
        }
        cardRepository.deleteById(cardId);
        Optional<CardEntity> deletedCard = cardRepository.findById(cardId);
        if(deletedCard.isEmpty()) {
            return 1;
        } else {
            return 0;
        }
    }
}
