package com.example.demo.dto;

import com.example.demo.entity.PlannerEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlannerDTO {
    private long plannerId;
    private String creator;
    private String title;
    private int likePlanner;
    private String thumbnail;
    private Date createdAt;
    private Date updatedAt;
    private PlannerEntity.PlannerAccess plannerAccess;
}
