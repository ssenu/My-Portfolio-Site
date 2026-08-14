---
title: { ko: "포트폴리오 사이트", en: "Portfolio Site" }
summary: { ko: "지금 보고 있는 이 사이트 — Astro 5 이중 언어 정적 포트폴리오", en: "The site you are looking at — a bilingual static portfolio built with Astro 5" }
thumbnail: /images/projects/my-portfolio-site/thumb.svg
images: []
github: https://github.com/ssenu/My-Portfolio-Site
tech: [Astro, TypeScript, Zod, Vitest, Docker, Nginx]
period: "2026.08 ~ 진행 중"
featured: true
order: 6
---

<!-- ko -->
## 개요

지금 보고 계신 이 사이트입니다. Astro 5 기반 정적 사이트로, 프로젝트·자격증·수상/교육 이력을 한국어/영어로 제공합니다. 라즈베리파이 홈서버에서 Docker + Nginx로 직접 서빙합니다.

## 특징

- 콘텐츠 = 파일: 프로젝트 1개가 md 파일 1개, Zod 스키마가 빌드 시 검증
- 3D 회전 갤러리(자동 회전 + 드래그/휠 가속), 커서를 피하는 타이포그래피, 팔레트 7종 테마
- AI 에이전트(Claude Code)가 가이드 문서(CLAUDE.md)를 읽고 콘텐츠를 추가하는 운영 워크플로
- 정적 빌드 → nginx:alpine 컨테이너, RPi(ARM64)에서 구동

## 배운 점

설계서 → 구현 계획 → 에이전트 실행·리뷰로 이어지는 개발 파이프라인을 직접 운영하며, "사람이 검토하고 에이전트가 만드는" 협업 방식을 실험했습니다.

<!-- en -->
## Overview

The very site you are browsing. A static Astro 5 site serving projects, certifications, and awards/programs in Korean and English, self-hosted on a Raspberry Pi with Docker + Nginx.

## Highlights

- Content as files: one markdown file per project, validated by Zod schemas at build time
- 3D rotating gallery (auto-spin + drag/wheel), cursor-dodging typography, 7 color palettes
- Operated by an AI agent workflow — Claude Code reads CLAUDE.md and adds content
- Static build → nginx:alpine container on ARM64

## What I Learned

Running a spec → plan → agent-implement-and-review pipeline end to end, I experimented with a workflow where humans review and agents build.
