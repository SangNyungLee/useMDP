package com.example.demo.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="planner")
public class PlannerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long plannerId;

    @Column(nullable = false)
    private String creator;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private int likePlanner;


    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String thumbnail;

    @CreationTimestamp
    @Column(nullable = false)
    private Timestamp createAt;

    //외래키 -> 한명의 유저는 여러개의 플래너를 가질 수 있음
    @ManyToOne
    @JoinColumn(name="memberId")
    private MemberEntity memberEntity;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "plannerEntity")
    private List<CardEntity> cardEntityList;


}
