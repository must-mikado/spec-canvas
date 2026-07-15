# spec-canvas

An open-source template for drawing UI screen specs in **real HTML** instead of Figma or PPT.

**🔗 Demo: https://must-mikado.github.io/spec-canvas/**

## Background (Why)

UI specs are usually drawn in Figma or PPT. But from way back, I had used CodePen or actual HTML to communicate mockups/designs with clients, and when a lead saw this approach, they suggested "let's just draw screen specs in HTML instead of Figma/PPT," which turned into an internal project.

The result was a 3-pane viewer made of a left index (screen list) / center live UI (the actually rendered screen) / right description (a bilingual KO/EN screen spec), following a React atomic design pattern to compose pages out of components like buttons, typography, input boxes, and search bars.

`spec-canvas` fully generalizes that viewer/component engine with no project-specific domain knowledge, so that anyone (even people the creator doesn't know) can drop in their own planning/policy docs and draw screen specs the same way. It's an open-source template.

## Usage

No install or build step. Clone it and use it right away.

```bash
git clone https://github.com/must-mikado/spec-canvas.git
cd spec-canvas
open index.html   # or open it directly in a browser
```

1. Drop your own planning/policy documents (markdown, PDF, etc.) into the `docs/` folder.
2. Ask Claude Code (or another AI coding tool): "look at the docs folder and draw the screens."
3. The AI reads only the documents in `docs/`, composes the existing atomic components in `components/`, and writes the routes (left index) and bilingual specs (right description) in `index.html`. If you have specific direction for how screens should be generated, that instruction always takes priority.

## Structure

```
spec-canvas/
  index.html              # 3-pane viewer engine (left index / center live UI / right KO-EN spec, KO/EN toggle)
  components/             # Atomic design components + a composed example page (x-example-page.html)
  components/en/          # English versions of the files above (the top 🌐 toggle auto-loads these if present)
  assets/css/              # tokens / admin-real / admin-components / harness-chrome CSS
  assets/js/               # specs.js / specs-en.js (screen spec data) + admin-shell.js (sidebar engine)
  docs/                    # Drop your own planning/policy documents here
  CLAUDE.md               # Screen-generation rules
```

## Why it only reads documents in docs/

This project is an open-source template meant to be freely used by other people the creator doesn't know. So when drawing screens, domain knowledge from a specific company or past project must never leak in — the rule is to use only what's placed in `docs/` as the source of truth. The full rules are in [`CLAUDE.md`](./CLAUDE.md).

## License

MIT License

---

# spec-canvas (한국어)

화면기획(UI Spec)을 Figma나 PPT가 아니라 **진짜 HTML**로 그리는 오픈소스 템플릿.

**🔗 데모: https://must-mikado.github.io/spec-canvas/**

## 배경 (Why)

기존에는 화면기획(UI spec)을 Figma나 PPT로 그려왔다. 하지만 과거 시절부터 CodePen이나 실제 HTML로 고객사와 목업/디자인을 소통해온 경험이 있었고, 이 경험을 리더가 보고 "Figma/PPT로 하던 화면기획을 그냥 HTML로 그려보자"고 제안 주셔서 사내 프로젝트를 진행하게 됐다.

그 결과물은 좌측 인덱스(화면 목록) / 중앙 라이브 UI(실제 렌더링되는 화면) / 우측 description(한/영 화면기획 spec)으로 구성된 3분할 뷰어였고, 리액트 아토믹 디자인 패턴을 따라 버튼·폰트·인풋박스·검색창 등의 컴포넌트를 조합해 페이지를 그려내는 방식이었다.

`spec-canvas`는 이 뷰어/컴포넌트 엔진을 특정 프로젝트 도메인 지식 없이 완전히 일반화해서, 누구나(만든 사람이 모르는 사람도) 자신의 기획·정책 문서만 넣으면 같은 방식으로 화면기획을 그릴 수 있도록 만든 오픈소스 템플릿이다.

## 사용법

설치나 빌드 과정이 없다. 클론해서 바로 쓴다.

```bash
git clone https://github.com/must-mikado/spec-canvas.git
cd spec-canvas
open index.html   # 또는 브라우저로 직접 열기
```

1. `docs/` 폴더에 본인의 기획서·정책 문서(마크다운, PDF 등)를 넣는다.
2. Claude Code(또는 다른 AI 코딩 도구)에게 "docs 폴더의 문서 보고 화면 그려줘"라고 요청한다.
3. AI는 `docs/` 문서만 읽고 `components/`의 기존 아토믹 컴포넌트를 조합해 `index.html`의 라우트(좌측 인덱스)와 한/영 spec(우측 description)을 작성한다. 화면 생성 방향에 대해 원하는 지시가 있으면 언제든 우선 반영된다.

## 구조

```
spec-canvas/
  index.html              # 3분할 뷰어 엔진 (좌측 인덱스 / 중앙 라이브 UI / 우측 한·영 spec, KO/EN 토글)
  components/             # 아토믹 디자인 컴포넌트 + 조합 예시 페이지(x-example-page.html)
  components/en/          # 위 파일들의 영문 버전 (있으면 상단 🌐 토글이 자동으로 로드)
  assets/css/              # tokens / admin-real / admin-components / harness-chrome CSS
  assets/js/               # specs.js·specs-en.js(화면기획서 데이터) + admin-shell.js(사이드바 엔진)
  docs/                    # 여기에 본인의 기획서·정책 문서를 넣는다
  CLAUDE.md               # 화면 생성 규칙
```

## 왜 docs/ 폴더 문서만 읽게 했나

이 프로젝트는 만든 사람이 모르는 다른 사용자들도 자유롭게 쓰는 오픈소스 템플릿이다. 그래서 화면을 그릴 때 특정 회사나 프로젝트의 과거 도메인 지식이 섞여 들어가면 안 되고, 오직 `docs/`에 넣은 문서만 근거로 삼도록 규칙을 만들었다. 전체 규칙은 [`CLAUDE.md`](./CLAUDE.md)에 있다.

## 라이선스

MIT License
