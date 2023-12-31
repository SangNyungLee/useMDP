package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String memberId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private socialCategory socialCategory;

    @Column(nullable = false)
    private String socialId;

    @Column(nullable = false)
    private String socialNickname;

    @Column
    private String socialProfilePicture;

    @Column
    @CreationTimestamp
    private Timestamp createdAt;

    @Column
    @UpdateTimestamp
    private Timestamp updatedAt;

    @OneToMany(mappedBy = "memberEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Builder.Default
    private List<PlannerEntity> planners = new ArrayList<>();

    @OneToMany(mappedBy = "memberEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Builder.Default
    private List<LikeEntity> likes = new ArrayList<>();

    @Getter
    public enum socialCategory {
        GITHUB,
        GOOGLE
    }
}
