---
title: { ko: "동아리 주간 시간표", en: "Club Weekly Schedule Table" }
summary: { ko: "동아리원들의 고정 일정을 격자에 나란히 놓고 비교하는 웹 앱", en: "A web app that lays club members' weekly schedules side by side on one grid" }
thumbnail: /images/projects/4this-schedule-table/thumb.svg
images: []
github: https://github.com/ssenu/4thIS-schedule-table
tech: [Vue, TypeScript, Python, Docker]
period: "2026.08"
featured: true
order: 3
---

<!-- ko -->
## 개요

동아리원이 각자 접속해 매주 반복되는 고정 일정(수업·알바·강의)을 등록하고, 여러 명의 시간표를 엑셀형 격자에 나란히 놓고 비교하는 웹 앱입니다. 날짜 개념 없이 "어느 요일 몇 시부터 몇 시까지 무슨 일정"만 다뤄서, 모임 시간을 잡을 때 모두가 비는 슬롯이 한눈에 보입니다.

## 주요 기능

- 요일 × 30분 단위(06:00~24:00) 격자에 멤버별 열을 나란히 표시
- 가로 스크롤로 인원이 많아도 비교 가능
- Docker로 동아리 서버에 배포

## 배운 점

"달력"이 아니라 "반복 주간표"라는 도메인에 맞는 데이터 모델을 설계하며, 요구사항을 단순화하는 것이 UI와 코드 모두를 단순하게 만든다는 걸 배웠습니다.

<!-- en -->
## Overview

A web app where club members register their fixed weekly schedules (classes, part-time work, lectures) and compare everyone's timetable side by side on a spreadsheet-like grid. There is no notion of dates — only "which weekday, from when to when, doing what" — so free slots for meetings stand out at a glance.

## Features

- Weekday × 30-minute grid (06:00–24:00) with one column per member
- Horizontal scrolling scales to many members
- Deployed to the club server with Docker

## What I Learned

Modeling the domain as a "recurring weekly table" rather than a calendar showed me how simplifying requirements simplifies both the UI and the code.
