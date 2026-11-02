---
title: "설치"
description: "Vue나 Nuxt 프로젝트에 코어 패키지를 추가하고, 필요하면 프로그래밍 방식 드래그와 DevTools용 패키지도 추가합니다."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ko/docs/getting-started/installation"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## 코어

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core
```

```bash [yarn]
yarn add @vue-dnd-kit/core
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core
```

```bash [bun]
bun add @vue-dnd-kit/core
```

</code-group>

Vue `^3.5`는 peer dependency입니다. 패키지 자체의 의존성은 `@vueuse/core` 하나뿐입니다.

## Nuxt

Nuxt 모듈은 `DnDProvider`와 `DragPreview`를 전역 컴포넌트로 등록하고, 컴포저블과 주요 타입을
자동으로 임포트합니다.

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

<note>

모디파이어, 충돌 감지 헬퍼, 센서는 이름이 일반적이어서(`snapToGrid`, `closestCenter`) 요청하지
않으면 자동 임포트되지 않습니다:
`vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }`.

</note>

## 선택 패키지

<table>
<thead>
  <tr>
    <th>
      패키지
    </th>
    
    <th>
      추가되는 기능
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      프로그래밍 방식 드래그: "위로 이동" 버튼, 메뉴, 투어, 테스트.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      Vue DevTools와 Nuxt DevTools의 Vue DnD Kit 탭.
    </td>
  </tr>
</tbody>
</table>

```bash
npm i @vue-dnd-kit/actions
npm i -D @vue-dnd-kit/devtools
```

## AI 어시스턴트용

문서에는 에이전트 스킬이 포함되어 있습니다. Claude Code 같은 어시스턴트가 라이브러리의 모델과
규칙, 주의할 점을 익힙니다.

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
