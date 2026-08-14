---
title: { ko: "깃허브 연동 동아리 활동 피드", en: "GitHub-Linked Club Activity Feed" }
summary: { ko: "교내 해커톤 대상작 — 커밋·README를 읽어 동아리 프로젝트 피드를 자동 구성하는 웹앱", en: "Campus hackathon grand-prize entry — a feed that builds club project posts from commits and READMEs" }
thumbnail: /images/projects/hackathon-0-woo/thumb.svg
images: []
github: https://github.com/ssenu/hackathon-0-Woo
tech: [Python, JavaScript, GitHub API, Claude API]
period: "2026.08.05 (해커톤)"
featured: true
order: 4
---

<!-- ko -->
## 개요

2026년 8월 교내 해커톤(팀 0팀/Woo, 팀장)에서 만든 동아리 활동 기록 관리 웹앱입니다. 동아리원이 프로젝트를 등록하면 서버가 GitHub에서 커밋·머지 이력과 README를 읽어 프로젝트 소개와 협업 흐름을 자동으로 채워 피드로 보여줍니다.

## 주요 기능

- 프로젝트 등록 시 GitHub API로 커밋/머지 이력·README 자동 수집
- 커밋 그래프 SVG, 곡선 캐러셀 등 활동을 시각화하는 피드 UI (담당 파트)
- 승인된 동아리원만 글 작성, 외부인은 읽기 전용

## 역할과 배운 점

팀장으로서 `client/` 전체(화면·모달·캐러셀·커밋 그래프 SVG)를 맡았습니다. 짧은 해커톤 일정에서 기능 우선순위를 정하고 백엔드 담당과 API 계약을 먼저 못 박는 협업 방식을 배웠습니다.

<!-- en -->
## Overview

A club activity feed built at the August 2026 campus hackathon (team 0/Woo, team lead). When a member registers a project, the server reads its commit/merge history and README from GitHub and automatically composes a feed post showing the project and its collaboration flow.

## Features

- Auto-collects commits, merges, and READMEs via the GitHub API on registration
- Feed UI visualizing activity — commit-graph SVGs and a curved carousel (my part)
- Approved members write; visitors read only

## Role & Takeaways

As team lead I owned the entire `client/` side (views, modals, carousel, commit-graph SVG). The hackathon taught me to prioritize ruthlessly and to pin down the API contract with the backend first.
