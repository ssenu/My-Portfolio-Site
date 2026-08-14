---
title: { ko: "token-per-prompt", en: "token-per-prompt" }
summary: { ko: "질문 하나가 토큰을 얼마나 썼는지 보여주는 Claude Code 플러그인", en: "A Claude Code plugin that shows how many tokens each prompt cost" }
thumbnail: /images/projects/token-per-prompt/thumb.svg
images: []
github: https://github.com/ssenu/token-per-prompt
tech: [Python, Claude Code Plugin]
period: "2026.07"
featured: true
order: 5
---

<!-- ko -->
## 개요

세션 총량 대시보드는 많지만 "이 질문 하나"의 비용을 보여주는 도구는 없어서 직접 만든 Claude Code 플러그인입니다. 답변 아래·상태줄·리포트 표, 세 가지 방식으로 질문별 토큰 사용량을 보여줍니다.

## 특징

- 100% 로컬 동작 — 대화 기록 파일만 읽고, 토큰을 전혀 소모하지 않음
- 외부 라이브러리 없이 파이썬 표준 라이브러리만 사용, macOS·Windows 지원
- Stop 훅으로 답변 직후 표시 + 상태줄 실시간 표시 + 세션 전체 리포트 표
- 측정치 자동보정 로직 내장

## 배운 점

Claude Code의 훅·플러그인 시스템을 파고들며, "개발 도구를 위한 도구"는 설치 마찰과 신뢰(로컬 처리·제로 코스트)가 핵심이라는 것을 배웠습니다.

<!-- en -->
## Overview

Plenty of dashboards show session totals, but nothing showed the cost of a single prompt — so I built this Claude Code plugin. It reports per-prompt token usage in three ways: under each answer, in the status line, and as a session report table.

## Highlights

- Runs 100% locally — reads only the transcript file and consumes zero tokens
- Python standard library only, no dependencies; works on macOS and Windows
- Stop-hook display after each answer, live status line, full session report
- Built-in auto-calibration of measurements

## What I Learned

Digging into Claude Code's hook/plugin system taught me that tools-for-tools live or die on install friction and trust — local processing and zero cost.
