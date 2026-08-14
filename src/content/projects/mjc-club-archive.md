---
title: { ko: "MJC 동아리 아카이브", en: "MJC Club Archive" }
summary: { ko: "사진과 메모만 올리면 AI가 활동 글 초안을 써주는 동아리 아카이브 — 교내 AI 해커톤 출품작", en: "A club archive where AI drafts activity posts from photos and a memo — campus AI hackathon entry" }
thumbnail: /images/projects/mjc-club-archive/thumb.svg
images: []
github: https://github.com/4thIS/Hackathon-Woo-mjc-club
tech: [Python, Vue, Docker, AI, GitHub API]
period: "2026.08 (해커톤)"
featured: true
order: 4
---

<!-- ko -->
## 개요

명지전문대학 동아리 아카이브 — 동아리를 찾고 가입할 수 있고, 동아리장은 사진과 메모만 올리면 AI가 활동 글 초안을 써주는 기록·홍보 웹사이트입니다. 2026학년도 RISE사업단 AI 해커톤 경진대회 출품작 (3인 팀: 우진·태희·찬우).

## 왜 만들었나

동아리 홈페이지는 만들 때는 열심히 만들지만 두 달이면 죽습니다 — 글 쓰기가 귀찮아서요. 사진은 단톡방에 100장 쌓여 있는데 홈페이지 마지막 글은 3월인 상황. 그래서 게시판이 아니라 **기록의 진입 장벽을 없애는 것**을 서비스의 중심에 뒀습니다. 행사 후 사진 몇 장과 한 줄 메모를 올리면 AI가 초안을 채워 넣고, 동아리장은 고쳐서 게시만 하면 됩니다.

## 핵심 기능

- AI 활동 글 초안: 메모·사진·활동 보고를 재료로 초안 자동 생성
- 동아리 탐색·가입: 소개글 대신 "지난주에 실제로 뭘 했는지"를 보고 선택
- Vue 프런트 + Python 백엔드, Docker 배포

## 배운 점

짧은 해커톤 일정에서 "AI가 글을 대신 써준다"는 핵심 가치 하나에 기능을 수렴시키는 제품 사고를 연습했습니다.

<!-- en -->
## Overview

A club archive for Myongji College — students discover and join clubs, and club leaders get AI-drafted activity posts from just photos and a short memo. Built by a team of three for the 2026 RISE AI hackathon.

## Why

Club homepages die within two months — not from lack of interest, but because writing posts is a chore. A hundred photos pile up in the group chat while the homepage's last post is from March. So the product centers on **removing the friction of recording**: upload a few photos and one line after an event, and AI fills the editor with a draft to tweak and publish.

## Core Features

- AI post drafts generated from memos, photos, and activity reports
- Club discovery based on what clubs actually did last week, not taglines
- Vue frontend + Python backend, deployed with Docker

## What I Learned

The hackathon was practice in converging every feature onto a single core value: AI writes the post for you.
