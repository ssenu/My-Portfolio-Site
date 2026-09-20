---
title: { ko: "MJC 동아리 아카이브", en: "MJC Club Archive" }
summary: { ko: "사진과 메모만 올리면 AI가 활동 글 초안을 써주는 동아리 아카이브 — 교내 AI 해커톤 대상", en: "A club archive where AI drafts activity posts from photos and a memo — campus AI hackathon grand prize" }
thumbnail: /images/projects/mjc-club-archive/logo.png
images:
  - /images/projects/mjc-club-archive/logo.png
  - /images/projects/mjc-club-archive/screenshot-feed.png
github: https://github.com/4thIS/Hackathon-Woo-mjc-club
tech: [Python, Vue, Docker, AI, GitHub API]
period: "2026.08 (해커톤)"
featured: true
order: 4
---

<!-- ko -->
## 개요

2026년 8월 6~7일에 진행된 명지전문대학 AI 해커톤 경진대회 출품작입니다. 우진·태희·찬우 3인이 팀으로 참가해 **대상**을 수상했습니다.

동아리 홍보·모집 글은 대부분 에브리타임이라는 외부 서비스를 통해 이루어지는데, 무분별한 모집 공고와 낮은 접근성 때문에 많은 학생들이 불편을 겪고 있습니다. 동아리 활동 내역도 각 동아리가 따로 기록·관리하기 때문에 동아리원이 아니면 볼 방법이 없고, 이는 가입을 고민하는 학생에게도 큰 단점입니다.

동아리 홈페이지 서비스는 많지만, 짧게는 몇 달, 길게는 한두 학기면 관리가 힘들어집니다. 이유는 글쓰기가 귀찮아서입니다. 그래서 **기록의 진입 장벽을 없앴습니다.** 사진 몇 장과 보고서(혹은 메모)를 입력하면 AI가 초안을 채우고, 이를 아카이브화해 누구나 볼 수 있게 게시하는 — MJC만을 위한 **MJC 동아리 아카이브**를 만들었습니다.

## 주요 기능

| 기능 | 내용 |
| --- | --- |
| AI 활동 글 초안 | 사진+메모+PDF → 제목·본문·태그 초안. 메모/PDF 없으면 생성 거부, 자동 게시 없음 |
| AI Pick 추천 | 6문항 설문 → 어울리는 동아리 TOP 3. 서버가 club_id 재검증, 설문·결과 미저장 |
| AI 키 관리 | 사용자 개인 키를 Fernet 암호화 보관. 조회 불가(삭제 후 재등록만) |
| 탐색 3화면 | 메인(곡선 캐러셀) · 아카이브(분야별 동아리) · 피드(전체 활동 최신순). 비로그인도 열람 |
| 동아리 상세 | 소개가 아닌 활동 타임라인이 중심 |
| 가입 | 동아리장이 가입폼 작성 → 신청 → 승인 시 기수 자동 부여 |
| 탈퇴 | 요청 후 7일 경과 시 자동 승인 |
| 부원 관리 | 직책·멤버십(활동중/OB)·기수 변경, 강퇴, 동아리장 위임 |
| 개설 신청 | 신규 창설 + 기존 동아리 등록을 한 흐름으로 → 관리자 승인 |
| 관리자 | 동아리·유저 목록/수정/삭제, 개설 신청 심사 |
| 계정 | 학번(10자리) PK, httpOnly 세션 쿠키 + bcrypt, 이메일 인증 |

## 느낀점

하루라는 단기간 안에 결과물을 만들어야 하니, 첫 뼈대를 튼튼하게 잡는 것이 매우 중요하다고 생각했습니다. 기획·설계·역할 분담을 세세하게 정하고 이를 바탕으로 진행하니 큰 문제 없이 완성할 수 있었습니다. 시간 분배에 실패하면 정해진 시간까지 완성할 수 없고, 그 안에서 완성도까지 높여야 한다는 점에서, 처음 참가한 해커톤이 상당히 큰 경험으로 자리 잡았습니다.

<!-- en -->
## Overview

Built at the Myongji College AI Hackathon (Aug 6–7, 2026) by a team of three (Woojin, Taehee, Chanwoo) — awarded the **Grand Prize**.

Club promotion and recruiting mostly happen on external services like Everytime, where scattershot postings and poor accessibility frustrate students. Activity records live inside each club, invisible to anyone who is not yet a member — a real problem for students deciding whether to join.

Club homepage services exist, but within months they go stale, because writing posts is a chore. So we **removed the friction of recording**: drop in a few photos and a report (or a memo), AI fills in a draft, and the result is archived and published for everyone — the **MJC Club Archive**, built just for MJC.

## Features

| Feature | Description |
| --- | --- |
| AI post drafts | Photos + memo + PDF → title/body/tag draft. Refuses to generate without a memo/PDF; never auto-publishes |
| AI Pick | 6-question survey → top 3 matching clubs. Server re-validates club_id; survey and results are not stored |
| AI key management | Personal API keys stored Fernet-encrypted; unreadable once saved (delete & re-register only) |
| Three explore views | Main (curved carousel) · Archive (clubs by field) · Feed (all activity, newest first). Open to visitors |
| Club detail | Centered on the activity timeline, not a static intro |
| Joining | Leader-defined application form → apply → cohort auto-assigned on approval |
| Leaving | Auto-approved 7 days after request |
| Member management | Roles, membership (active/OB), cohort edits, removal, leadership transfer |
| Club registration | New founding + existing club onboarding in one flow → admin approval |
| Admin | Club/user listing, editing, deletion; registration review |
| Accounts | 10-digit student ID as PK, httpOnly session cookies + bcrypt, email verification |

## Takeaways

With only a day to deliver, getting the skeleton right mattered most. We nailed down planning, design, and role splits in detail, and the build went through without major trouble. My first hackathon taught me what it means to finish on time *and* polish within that time.
