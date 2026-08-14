---
title: { ko: "Pidio", en: "Pidio" }
summary: { ko: "라즈베리파이5 기반 학교 미디어 플레이어 — 교내 웹으로 원격 관리", en: "A Raspberry Pi 5 school media player managed remotely from a campus web app" }
thumbnail: /images/projects/pidio/thumb.svg
images: []
github: https://github.com/4thIS/Pidio
tech: [Python, FastAPI, Vue, mpv, SQLite, Raspberry Pi]
period: "2026.07"
featured: true
order: 7
---

<!-- ko -->
## 개요

학교 TV에 연결된 Raspberry Pi 5에서 동영상·사진·음악을 재생하고, 교직원이 교내 웹으로 원격 관리하는 시스템입니다 (2인 팀). TV는 순수 재생 전용, 웹이 리모컨 역할을 하며, 교내 LAN에서만 동작합니다.

## 주요 기능

- 선택 재생, 반복/셔플, 동영상·사진·음악 혼합 플레이리스트
- 예약 재생과 웹을 통한 원격 업로드
- mpv 2인스턴스(화면·음악)를 JSON IPC 소켓으로 제어, ffmpeg로 썸네일·길이 추출
- FastAPI + SQLite 백엔드, Vue 3 프런트, RPi5에서 systemd로 상시 구동

## 배운 점

mpv/USB 없이도 테스트 가능하도록 도메인 로직을 분리한 아키텍처(contracts 기반)를 설계하며, 하드웨어에 붙은 서비스를 테스트 가능하게 만드는 법을 배웠습니다.

<!-- en -->
## Overview

A media system where a Raspberry Pi 5 attached to a school TV plays video, photos, and music, managed remotely by staff through a campus-only web app (team of two). The TV is playback-only; the web app acts as the remote control on the campus LAN.

## Features

- Selective playback, repeat/shuffle, mixed playlists of video, photos, and music
- Scheduled playback and remote upload from the web
- Two mpv instances (screen and music) driven over JSON IPC; ffmpeg for thumbnails and durations
- FastAPI + SQLite backend, Vue 3 frontend, running under systemd on the Pi

## What I Learned

Designing a contracts-based architecture whose domain logic tests without mpv or USB hardware taught me how to make hardware-bound services testable.
