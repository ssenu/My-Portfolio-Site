---
title: { ko: "Cloudflare Tunnel GUI", en: "Cloudflare Tunnel GUI" }
summary: { ko: "포트 포워딩 없이 집 서버를 내 도메인으로 여는 윈도우 GUI 앱", en: "A Windows GUI that exposes home servers on your own domain without port forwarding" }
thumbnail: /images/projects/cloudflare-gui-tool/thumb.svg
images: []
github: https://github.com/ssenu/cloudflare-gui-tool
tech: [Python, Cloudflare Tunnel, SSH]
period: "2026.08 ~ 진행 중"
featured: true
order: 1
---

<!-- ko -->
## 개요

집에 있는 컴퓨터나 라즈베리파이를 내 도메인으로 서비스되는 서버로 만들어 주는 윈도우 앱입니다. 공유기 포트 포워딩, 공인 IP, DDNS 없이 — 터널 생성, 도메인 연결, 서버 실행을 전부 창 하나에서 처리합니다.

## 주요 기능

- `cloudflared` CLI로 여러 단계를 거쳐야 하는 터널 생성·DNS 라우팅을 버튼 몇 번으로 자동화
- 여러 개의 터널을 동시에 관리하는 대시보드
- SSH를 통한 라즈베리파이 원격 관리 (배포·재시작을 앱에서 바로)
- 라이트/다크 모드 지원

## 배운 점

외부 CLI 도구를 감싸는 GUI를 만들며 서브프로세스 관리와 상태 동기화, 그리고 "설치형 도구의 사용자 경험"을 고민했습니다.

<!-- en -->
## Overview

A Windows app that turns a home PC or Raspberry Pi into a server available on your own domain. No router port forwarding, no public IP, no DDNS — creating tunnels, attaching domains, and running servers all happen in a single window.

## Features

- Automates the multi-step `cloudflared` tunnel creation and DNS routing into a few clicks
- Dashboard managing multiple tunnels at once
- Remote Raspberry Pi management over SSH (deploy and restart from the app)
- Light/dark mode

## What I Learned

Wrapping an external CLI in a GUI taught me subprocess management, state synchronization, and the UX of installable desktop tools.
