---
title: { ko: "모두의 모의면접", en: "MoMo — Mock Interview for Everyone" }
summary: { ko: "이력서가 내 컴퓨터를 떠나지 않는, 브라우저 속 AI 면접관", en: "An AI interviewer that runs entirely in your browser — your résumé never leaves your device" }
thumbnail: /images/projects/momo-mock-interview/main.png
images:
  - /images/projects/momo-mock-interview/main.png
  - /images/projects/momo-mock-interview/interview.png
  - /images/projects/momo-mock-interview/report.png
github: https://github.com/4thIS/Woo-MoMo-Project
demo: https://momo.ssenu.cloud/
tech: [WebGPU, Gemma 4, Supertonic TTS, Claude Code, TDD]
period: "2026.09"
featured: true
order: 1
---

<!-- ko -->
## 개요

**모두의 모의면접** — 이력서가 내 컴퓨터를 떠나지 않는, 브라우저 속 AI 면접관.

AI 모의면접을 하려면 이력서와 답변 같은 민감한 개인정보를 외부 서버에 넘겨야 합니다. 이 문제를 **모든 AI 추론을 사용자 브라우저 안에서 실행**하는 방식으로 해결하고자 했습니다.

Gemma 4와 Supertonic 3 TTS를 WebGPU로 브라우저 안에서 실행해, 이력서를 읽고 질문·꼬리질문을 하는 AI 면접관을 만들었습니다. 개발은 2인이 Claude Code로 협업했습니다. 직접 만든 project-init 스킬로 공통 규칙(CLAUDE.md)·영역 분리·CI·PR 템플릿을 세우고, brainstorming으로 설계서를, writing-plans로 작업 계획서를 확정한 뒤, subagent-driven-development로 에이전트가 테스트 우선(TDD)으로 작성하고 다른 에이전트가 리뷰했습니다. PixelLab MCP로 2D 픽셀 그래픽을 구현했고, 최종적으로 이슈·PR 약 40건, 테스트 약 410개를 거쳤습니다.

## 주요 기능

| 기능 | 내용 |
| --- | --- |
| 모델 준비 | 면접관 모델(Gemma 4, 약 2.8GB)과 목소리 모델(Supertonic 3, 약 380MB)을 동의 후 한 번만 내려받아 브라우저에 저장. 목소리는 빼고 텍스트로만 진행 가능 |
| 이력서 입력 | PDF를 올리면 브라우저 안에서 글자 추출. PDF가 없으면 항목별 간단 이력서 양식으로 작성 |
| AI 면접 진행 | 이력서·지원 분야·직무를 반영해 질문 5개 진행. 답변이 흥미로우면 꼬리질문 |
| 면접관 음성 | 질문을 한국어 음성으로 합성해 들려주고, 말풍선 글자가 음성 속도에 맞춰 나타남 |
| 답변 방식 | 텍스트 입력 또는 말하기. 말을 멈추면 3초 뒤 자동 전송. 답변 60초 타이머 |
| 피드백 리포트 | 점수 대신 문항별 내 답변 원문 + 피드백. 답변 소요 시간 표, 텍스트 복사, PDF 저장 |
| 개인정보 보호 | 서버에는 이력서·대화를 받는 API 자체가 없음. 리포트는 새로고침하면 사라짐 |

## 느낀점

2인 개발로 비교적 짧은 기간 내에 서비스를 완성했습니다. 크롬 브라우저에서 로컬 LLM을 돌리는 기능을 활용해 보고 싶어서 주제를 선택했고, 모두의 모의면접은 정말 재미있게 작업해서 짧은 기간에도 완성도 있는 웹 서비스가 나온 것 같습니다.

웹의 기능은 대개 서버에서 동작한다고 생각했었는데, LLM을 브라우저 캐시에 저장하고, 브라우저 자체에서 LLM 추론·음성 인식·TTS 출력까지 동작하게 하면서, 웹 생태계에서 브라우저가 맡을 수 있는 역할을 다시 한번 배울 수 있었습니다.

<!-- en -->
## Overview

**MoMo (Mock Interview for Everyone)** — an AI interviewer inside the browser, where your résumé never leaves your machine.

AI mock interviews normally require handing sensitive data — your résumé and answers — to an external server. We solved this by running **all AI inference inside the user's browser**.

Gemma 4 and Supertonic 3 TTS run in-browser via WebGPU, powering an interviewer that reads your résumé and asks questions with follow-ups. A team of two built it collaborating through Claude Code: a custom project-init skill set up shared rules (CLAUDE.md), area separation, CI, and PR templates; brainstorming produced the spec and writing-plans the work plan; then subagent-driven development had agents implement test-first (TDD) with other agents reviewing. Pixel art was made with the PixelLab MCP. The project closed with ~40 issues/PRs and ~410 tests.

## Features

| Feature | Description |
| --- | --- |
| Model setup | Interviewer model (Gemma 4, ~2.8GB) and voice model (Supertonic 3, ~380MB) downloaded once after consent and cached in the browser; text-only mode available |
| Résumé input | PDFs parsed entirely in-browser; a simple form is available without a PDF |
| Interview flow | Five questions tailored to your résumé, field, and role — with follow-ups when an answer is interesting |
| Interviewer voice | Questions synthesized as Korean speech, speech-synced captions, mutable |
| Answering | Type or speak; auto-submit 3 seconds after you stop talking; 60-second timer |
| Feedback report | Per-question feedback with your original answers instead of scores; timing table, copy, PDF export |
| Privacy | The server has no API that accepts résumés or conversations; reports vanish on refresh |

## Takeaways

Two of us finished the service in a fairly short time. I picked the topic to try running a local LLM in Chrome, and it turned out to be the most enjoyable project I've built — which shows in the finish.

I used to think the web's real work happens on servers. Caching an LLM in the browser and running inference, speech recognition, and TTS entirely client-side taught me anew what the browser can carry in the web ecosystem.
