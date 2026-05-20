import { config } from 'dotenv';
import { db } from './index';
import { posts } from './schema';

config(); // Load environment variables from .env

const studyPosts = [
  {
    title: '마크다운(Markdown) 문법 완벽 가이드',
    category: 'DevKit',
    content: `
# 마크다운(Markdown)이란?

마크다운은 텍스트 기반의 가벼운 마크업 언어로, 문법이 쉽고 직관적이어서 개발자들의 문서 작성, 리드미(README) 파일, 블로그 포스팅 등 다양한 곳에서 널리 사용됩니다.

## 1. 제목 (Header)

\`#\`을 사용하여 H1부터 H6까지의 제목을 표현합니다.

\`\`\`markdown
# H1 (가장 큰 제목)
## H2
### H3
#### H4
##### H5
###### H6 (가장 작은 제목)
\`\`\`

## 2. 강조 (Emphasis)

글자의 스타일을 지정할 때 사용합니다.

- **굵게(Bold)**: \`**굵게**\` 또는 \`__굵게__\`
- *기울임(Italic)*: \`*기울임*\` 또는 \`_기울임_\`
- ~~취소선(Strikethrough)~~: \`~~취소선~~\`

## 3. 리스트 (List)

### 순서가 있는 리스트 (Ordered List)
숫자와 마침표를 사용합니다.
\`\`\`markdown
1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목
\`\`\`

### 순서가 없는 리스트 (Unordered List)
\`-\`, \`*\`, \`+\`를 사용할 수 있습니다.
\`\`\`markdown
- 사과
  - 빨간 사과
  - 초록 사과
- 바나나
\`\`\`

## 4. 인용구 (Blockquotes)

\`>\` 문자를 사용하여 인용구를 작성합니다. 중첩도 가능합니다.

> 훌륭한 개발자는 문제를 코드로 해결하는 사람이 아니라, 문제를 없애는 사람이다.
>> 명언 중의 명언!

## 5. 링크와 이미지

### 링크 (Link)
\`[보여줄 텍스트](URL 주소)\` 형태로 작성합니다.
[Google 홈페이지](https://google.com)

### 이미지 (Image)
링크 앞에 \`!\`를 붙입니다.
\`![대체 텍스트](이미지 URL)\`

## 6. 코드 블록 (Code Block)

인라인 코드는 백틱(\`) 하나로 감싸고, 여러 줄의 코드는 백틱 세 개(\`\`\`)로 감쌉니다. 시작 백틱 뒤에 언어 이름을 적으면 문법 강조(Syntax Highlighting)가 적용됩니다.

\`\`\`javascript
function helloWorld() {
  console.log("Hello, Markdown!");
}
\`\`\`

## 7. 표 (Table)

파이프(\`|\`)와 하이픈(\`-\`)을 사용하여 표를 생성합니다. 콜론(\`:\`)으로 정렬을 설정할 수 있습니다.

| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |
| :-------- | :---------: | --------: |
| Apple     | Red         | $1.00     |
| Banana    | Yellow      | $0.50     |

---

마크다운은 배우기 쉬우면서도 강력한 문서 작성 도구입니다. 자주 사용하여 손에 익히는 것이 중요합니다!
`,
  },
  {
    title: 'Sass (SCSS) 핵심 문법 및 활용법',
    category: 'Programming',
    content: `
# Sass (Syntactically Awesome Style Sheets)

Sass는 CSS의 확장 언어로, 변수, 중첩(Nesting), 믹스인(Mixin), 상속 등의 강력한 기능을 제공하여 CSS 코드를 훨씬 간결하고 유지보수하기 쉽게 만들어주는 전처리기(Preprocessor)입니다. SCSS는 Sass의 3버전에서 등장한 문법으로, 기존 CSS와 완벽하게 호환되어 가장 널리 사용됩니다.

## 1. 변수 (Variables)

자주 사용하는 색상이나 폰트 크기 등을 변수로 선언하여 재사용할 수 있습니다. \`$\` 기호를 사용합니다.

\`\`\`scss
$primary-color: #3498db;
$font-stack: Helvetica, sans-serif;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
\`\`\`

## 2. 중첩 (Nesting)

HTML의 구조와 동일하게 CSS 선택자를 중첩하여 작성할 수 있어 코드의 가독성이 크게 향상됩니다.

\`\`\`scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
    
    // &는 부모 선택자(a)를 참조합니다.
    &:hover {
      color: red;
    }
  }
}
\`\`\`

## 3. 믹스인 (Mixins)

반복되는 CSS 패턴을 함수처럼 정의해두고 필요할 때 불러와서 사용할 수 있습니다. 인자를 전달받을 수도 있어 매우 유용합니다.

\`\`\`scss
@mixin transform($property) {
  -webkit-transform: $property;
  -ms-transform: $property;
  transform: $property;
}

.box {
  @include transform(rotate(30deg));
}
\`\`\`

## 4. 확장/상속 (Extend/Inheritance)

특정 선택자의 모든 스타일 속성을 다른 선택자가 상속받도록 할 수 있습니다.

\`\`\`scss
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  @extend .message;
  border-color: green;
}

.error {
  @extend .message;
  border-color: red;
}
\`\`\`

## 5. 연산자 (Operators)

CSS 내에서 기본 수학 연산(+, -, *, /, %)을 수행할 수 있습니다.

\`\`\`scss
.container {
  width: 100%;
}

article[role="main"] {
  float: left;
  width: 600px / 960px * 100%; // 너비 비율 계산
}
\`\`\`

Sass를 도입하면 방대한 양의 CSS 코드도 모듈화하고 체계적으로 관리할 수 있어 프론트엔드 개발의 생산성이 비약적으로 상승합니다.
`,
  },
  {
    title: 'TypeScript 기초부터 실전까지',
    category: 'Programming',
    content: `
# TypeScript의 세계로

TypeScript는 JavaScript의 슈퍼셋(Superset)으로, 동적 타입 언어인 JavaScript에 **정적 타입 검사(Static Type Checking)** 기능을 추가한 언어입니다. 마이크로소프트에서 개발 및 유지보수하고 있으며, 현재 대부분의 모던 웹 개발 생태계의 표준으로 자리 잡고 있습니다.

## 왜 TypeScript를 써야 할까?

1. **컴파일 단계의 오류 발견**: 코드를 실행하기 전 에디터에서 오류를 잡아줍니다.
2. **강력한 자동 완성**: 객체의 프로퍼티나 함수 인자에 대한 추론을 통해 생산성을 극대화합니다.
3. **안전한 리팩토링**: 코드를 수정할 때 발생하는 사이드 이펙트를 타입을 통해 사전에 차단합니다.

## 핵심 개념 요약

### 1. 기본 타입 지정
변수 이름 뒤에 \`:\`를 붙여 타입을 선언합니다.

\`\`\`typescript
let isDone: boolean = false;
let age: number = 25;
let userName: string = "Bong";
let numbers: number[] = [1, 2, 3];
\`\`\`

### 2. 인터페이스 (Interface)
객체의 구조를 정의하는 역할을 합니다. 가장 많이 사용되는 기능 중 하나입니다.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  age?: number; // 선택적 프로퍼티 (?)
  readonly createdAt: Date; // 읽기 전용 프로퍼티
}

const user: User = {
  id: 1,
  name: "Bong Dev",
  createdAt: new Date()
};
\`\`\`

### 3. 타입 별칭 (Type Alias)
특정 타입에 이름을 붙이는 용도 부릅니다. Union, Intersection 타입 등에 유용합니다.

\`\`\`typescript
type ID = string | number;
type Status = "Pending" | "Success" | "Failed";

let currentStatus: Status = "Success";
\`\`\`

### 4. 제네릭 (Generics)
타입을 마치 함수의 인자처럼 받아서, 재사용성 높은 컴포넌트나 함수를 만들 수 있습니다.

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);
\`\`\`

### 5. 유틸리티 타입
이미 정의된 타입을 변환할 때 사용하는 내장 타입들입니다.
- \`Partial<T>\`: 모든 프로퍼티를 선택적으로 만듭니다.
- \`Pick<T, K>\`: 특정 프로퍼티만 선택합니다.
- \`Omit<T, K>\`: 특정 프로퍼티를 제외합니다.

\`\`\`typescript
interface Post {
  title: string;
  description: string;
  views: number;
}

type PostPreview = Pick<Post, "title" | "description">;
\`\`\`

TypeScript는 초기 학습 곡선이 있지만, 도입하고 나면 JavaScript로 돌아가기 힘들 정도로 개발 경험(DX)을 크게 향상시킵니다.
`,
  },
  {
    title: 'Docker 컨테이너와 Docker Compose',
    category: 'DevOps',
    content: `
# Docker: 내 컴퓨터에서 되는데 왜 서버에선 안 될까?

개발 환경과 운영 환경의 불일치 문제는 개발자들을 오랫동안 괴롭혀왔습니다. Docker는 애플리케이션을 실행하는 데 필요한 모든 것을 **컨테이너(Container)** 라는 표준화된 단위로 패키징하여, 어디서든 동일하게 실행될 수 있도록 보장합니다.

## 핵심 개념

- **이미지(Image)**: 컨테이너를 실행하기 위해 필요한 프로그램, 라이브러리, 소스 코드 등을 묶어놓은 읽기 전용 템플릿입니다. (예: 붕어빵 틀)
- **컨테이너(Container)**: 이미지를 실행한 상태로, 격리된 환경에서 돌아가는 프로세스입니다. (예: 구워진 붕어빵)

## 1. Dockerfile 작성하기

나만의 이미지를 만들기 위한 설정 파일입니다.

\`\`\`dockerfile
# 1. Base 이미지 설정
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. 실행 포트 설정
EXPOSE 3000

# 6. 실행 명령어
CMD ["npm", "start"]
\`\`\`

## 2. 기본 명령어 모음

- \`docker build -t my-app .\` : Dockerfile을 기반으로 이미지 빌드
- \`docker run -p 3000:3000 my-app\` : 이미지로 컨테이너 실행
- \`docker ps\` : 실행 중인 컨테이너 목록 확인
- \`docker stop <container_id>\` : 컨테이너 중지
- \`docker rm <container_id>\` : 컨테이너 삭제
- \`docker rmi <image_id>\` : 이미지 삭제

## 3. Docker Compose 

여러 개의 컨테이너(웹 서버, 데이터베이스, 캐시 서버 등)를 한 번에 띄우고 관리할 수 있게 해주는 도구입니다. \`docker-compose.yml\` 파일에 설정합니다.

\`\`\`yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
\`\`\`

터미널에서 \`docker-compose up -d\` 명령어 한 번이면 웹 서버와 데이터베이스가 서로 연결된 상태로 백그라운드에서 동시에 실행됩니다! 도커는 현대 백엔드 개발과 DevOps의 알파이자 오메가입니다.
`,
  },
  {
    title: 'Node.js 이벤트 루프와 비동기 처리',
    category: 'Programming',
    content: `
# Node.js의 심장: 이벤트 루프(Event Loop)

Node.js는 **싱글 스레드(Single-Thread) 논블로킹 I/O (Non-blocking I/O)** 모델을 기반으로 합니다. 스레드가 하나뿐인데 어떻게 수천 개의 요청을 동시에 처리할 수 있을까요? 그 비밀이 바로 '이벤트 루프'에 있습니다.

## 비동기 처리의 원리

Node.js 환경에서 자바스크립트 코드는 메인 스레드인 V8 엔진(Call Stack)에서 순차적으로 실행됩니다. 하지만 파일 읽기, 네트워크 요청, DB 쿼리처럼 오래 걸리는 작업(I/O 작업)을 만나면, 메인 스레드는 기다리지 않고 백그라운드(libuv)로 작업을 넘깁니다. 

작업이 완료되면 콜백 함수가 Task Queue로 이동하고, Event Loop는 Call Stack이 비어있을 때 Queue에 있는 콜백을 Stack으로 끌어올려 실행합니다.

## 이벤트 루프의 6단계 (Phases)

Node.js의 이벤트 루프는 내부적으로 여러 개의 큐를 관리하며 틱(Tick)마다 다음 단계를 순환합니다.

1. **Timers**: \`setTimeout()\`, \`setInterval()\` 등의 콜백 실행
2. **Pending Callbacks**: 지연된 I/O 콜백 실행
3. **Idle, Prepare**: 내부용 로직 처리
4. **Poll**: 새로운 I/O 이벤트를 대기하고 관련된 콜백 실행 (대부분의 시간 소요)
5. **Check**: \`setImmediate()\` 콜백 실행
6. **Close Callbacks**: \`socket.on('close', ...)\` 등 닫기 콜백 실행

> **Microtask Queue** (\`Promise\`, \`process.nextTick\`)는 각 Phase 사이마다 우선적으로 실행되어 Call Stack을 점유합니다.

## Promise와 Async/Await

현대 Node.js에서는 콜백 지옥(Callback Hell)을 피하기 위해 Promise 객체와 이를 감싼 \`async/await\` 구문을 사용합니다.

\`\`\`javascript
const fs = require('fs/promises');

async function readFileContent() {
  try {
    // 파일을 읽을 때까지 기다리지 않고 제어권을 넘김(Non-blocking)
    const data = await fs.readFile('./data.txt', 'utf8');
    console.log(data);
  } catch (error) {
    console.error("파일 읽기 에러:", error);
  }
}

console.log("시작");
readFileContent();
console.log("종료");

// 출력 순서: "시작" -> "종료" -> "(파일 내용)"
\`\`\`

Node.js의 동작 원리를 이해하면 병목 현상이 발생하는 코드를 피하고 성능이 뛰어난 백엔드 서버를 구축할 수 있습니다.
`,
  },
  {
    title: 'React 훅(Hooks)과 최적화 기법',
    category: 'Programming',
    content: `
# React Hooks 완벽 마스터

React 16.8에 도입된 훅(Hooks)은 함수형 컴포넌트에서 상태(State)와 생명주기(Lifecycle) 기능을 사용할 수 있게 해주는 혁신적인 기능입니다.

## 핵심 Hooks 3대장

### 1. useState
가장 기본적인 훅으로, 상태 변수와 이를 업데이트하는 함수를 반환합니다.

\`\`\`jsx
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}>
    클릭 횟수: {count}
  </button>
);
\`\`\`

### 2. useEffect
컴포넌트가 렌더링될 때(Mount), 업데이트될 때(Update), 사라질 때(Unmount) 특정 부수 효과(Side Effect)를 처리합니다. 데이터 패칭에 주로 사용됩니다.

\`\`\`jsx
useEffect(() => {
  // Mount 및 업데이트 시 실행
  fetchData();
  
  return () => {
    // Unmount 시 실행 (Cleanup 함수)
    cleanup();
  };
}, [dependency]); // 의존성 배열 값이 바뀔 때만 재실행
\`\`\`

### 3. useRef
렌더링에 영향을 주지 않는 변수를 저장하거나, DOM 요소에 직접 접근할 때 사용합니다.

\`\`\`jsx
const inputRef = useRef(null);

const focusInput = () => {
  inputRef.current.focus();
};

return <input ref={inputRef} />;
\`\`\`

---

## 렌더링 최적화 기법 (Memoization)

리액트는 부모 컴포넌트가 리렌더링되면 자식 컴포넌트도 모두 리렌더링됩니다. 불필요한 렌더링을 막기 위한 3가지 도구가 있습니다.

### 1. React.memo
컴포넌트 자체를 메모이제이션합니다. 전달받는 Props가 변하지 않으면 리렌더링을 건너뜁니다.
\`\`\`jsx
const ChildComponent = React.memo(({ name }) => {
  return <div>{name}</div>;
});
\`\`\`

### 2. useMemo
비용이 큰 **연산의 결과값**을 기억합니다.
\`\`\`jsx
// items가 변경되지 않으면 정렬 연산을 다시 하지 않음
const sortedItems = useMemo(() => expensiveSort(items), [items]);
\`\`\`

### 3. useCallback
생성된 **함수 자체**를 기억합니다. 자식 컴포넌트에 콜백 함수를 Props로 넘길 때 유용합니다.
\`\`\`jsx
const handleClick = useCallback(() => {
  console.log(userId);
}, [userId]);
\`\`\`

올바른 훅의 사용과 렌더링 최적화는 쾌적한 UX를 제공하는 리액트 앱의 핵심입니다!
`,
  },
  {
    title: 'Nest.js 아키텍처와 의존성 주입(DI)',
    category: 'Programming',
    content: `
# Node.js 진영의 Spring, Nest.js

Nest.js는 효율적이고 확장 가능한 Node.js 서버 측 애플리케이션을 구축하기 위한 프레임워크입니다. Express나 Fastify 위에서 동작하지만, TypeScript를 완벽하게 지원하며 객체 지향 프로그래밍(OOP)과 의존성 주입(DI) 등 체계적인 아키텍처를 제공합니다.

## Nest.js의 핵심 구성 요소

Nest 애플리케이션은 크게 세 가지 주요 요소로 구성됩니다.

### 1. Controller (컨트롤러)
클라이언트로부터 들어오는 HTTP 요청(Request)을 처리하고 응답(Response)을 반환하는 라우팅 역할을 합니다.

\`\`\`typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
\`\`\`

### 2. Provider / Service (서비스)
비즈니스 로직을 담당합니다. 데이터베이스와 상호작용하거나 외부 API를 호출하는 등의 실제 작업을 수행합니다. \`@Injectable()\` 데코레이터가 붙습니다.

\`\`\`typescript
@Injectable()
export class UsersService {
  private users = [];

  findOne(id: string) {
    return this.users.find(user => user.id === id);
  }
}
\`\`\`

### 3. Module (모듈)
관련된 컨트롤러와 프로바이더를 하나의 단위로 묶어주는 캡슐화 역할을 합니다.
\`\`\`typescript
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
\`\`\`

---

## 의존성 주입 (Dependency Injection, DI)

의존성 주입은 Nest.js의 가장 강력한 특징입니다. 클래스 내부에서 직접 사용할 객체(의존성)를 생성(new)하는 것이 아니라, 외부(IoC 컨테이너)에서 생성하여 주입해 주는 방식입니다.

**DI의 장점:**
1. **결합도 감소**: 클래스 간의 의존성이 느슨해져 코드 변경이 쉽습니다.
2. **테스트 용이성**: Service를 Mocking하여 단위 테스트(Unit Test)를 작성하기 매우 쉽습니다.

Nest.js는 Java의 Spring 프레임워크와 유사한 구조를 가지고 있어, 엔터프라이즈급 백엔드 개발에서 폭발적인 인기를 끌고 있습니다.
`,
  },
  {
    title: 'Next.js App Router 아키텍처 핵심',
    category: 'Programming',
    content: `
# Next.js App Router의 패러다임 전환

Next.js 13부터 도입된 **App Router (\`app\` 디렉토리)** 는 기존 Pages Router의 아키텍처를 완전히 뒤엎는 혁신적인 변화를 가져왔습니다. 핵심은 바로 React Server Components(RSC)의 도입입니다.

## 1. Server Components vs Client Components

App Router에서는 기본적으로 모든 컴포넌트가 **서버 컴포넌트(Server Component)** 로 동작합니다. 

### Server Components (기본값)
- 서버에서 렌더링되며 자바스크립트 번들이 클라이언트로 전송되지 않아 로딩이 매우 빠릅니다.
- 직접 데이터베이스(DB)에 접근하거나 민감한 환경 변수(API 키 등)를 안전하게 사용할 수 있습니다.
- \`useState\`, \`useEffect\`, \`onClick\` 등 클라이언트 상호작용은 불가능합니다.

\`\`\`tsx
// 기본적으로 Server Component 입니다. async/await를 직접 쓸 수 있습니다.
export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(res => res.json());
  return <main>{data.title}</main>;
}
\`\`\`

### Client Components
- 상단에 \`"use client"\` 지시어를 선언하여 사용합니다.
- 브라우저 환경에서 동작하며, 상태 관리 및 이벤트 핸들러 사용이 필요할 때만 제한적으로 사용합니다.

\`\`\`tsx
"use client";

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## 2. 파일 기반 라우팅

\`app\` 폴더 내의 디렉토리 이름이 라우트 경로가 되며, 특별한 파일 이름들이 각자의 고유한 역할을 가집니다.

- \`page.tsx\`: 해당 경로의 실제 UI를 렌더링합니다. (예: \`app/about/page.tsx\` -> \`/about\`)
- \`layout.tsx\`: 여러 페이지 간에 공유되는 레이아웃(헤더, 사이드바 등)입니다. 리렌더링되지 않고 상태를 유지합니다.
- \`loading.tsx\`: 데이터 패칭 중에 표시될 Suspense fallback UI입니다.
- \`error.tsx\`: 런타임 에러를 잡아내고 복구 UI를 렌더링하는 Error Boundary 역할을 합니다.
- \`not-found.tsx\`: 404 에러 페이지를 커스텀합니다.

Next.js의 App Router는 성능, SEO, 개발자 경험(DX)을 모두 잡은 모던 웹 풀스택 프레임워크의 완성형입니다.
`,
  },
  {
    title: '협업을 위한 Git 브랜치 전략',
    category: 'DevKit',
    content: `
# Git Flow와 협업의 정석

개발자 혼자서 코딩할 때는 \`main\` 브랜치 하나만 써도 상관없지만, 팀 단위로 협업을 시작하면 체계적인 브랜치 관리 전략이 필수적입니다. 가장 대표적인 전략이 바로 **Git Flow**입니다.

## Git Flow의 5가지 브랜치

1. **\`main\` (또는 \`master\`)**: 
   - 언제든 배포 가능한 상태를 유지하는 메인 브랜치입니다.
   - 직접 커밋하지 않습니다.

2. **\`develop\`**: 
   - 다음 버전을 개발하는 중심 브랜치입니다. 기능 개발이 완료되면 여기로 병합(Merge)됩니다.

3. **\`feature/...\`**: 
   - 새로운 기능을 개발할 때 \`develop\` 브랜치에서 분기하여 생성합니다.
   - 예: \`feature/login-ui\`
   - 개발이 완료되면 \`develop\`으로 병합 후 삭제합니다.

4. **\`release/...\`**: 
   - 배포를 준비하는 브랜치입니다. \`develop\`에서 분기하며, 버그 수정 및 문서 업데이트만 수행합니다.
   - 준비가 완료되면 \`main\`과 \`develop\`에 병합하고 버전을 태깅(Tag)합니다.

5. **\`hotfix/...\`**: 
   - \`main\` 브랜치(운영 환경)에서 발생한 치명적인 버그를 긴급 수정할 때 사용합니다.
   - 수정 완료 후 \`main\`과 \`develop\`에 모두 병합합니다.

## 실무 협업 흐름 (GitHub Flow)

최근에는 무중단 배포(CI/CD)가 보편화되면서, Git Flow보다 단순한 **GitHub Flow**가 많이 쓰입니다.

1. \`main\`에서 기능 개발을 위한 브랜치를 생성합니다. (예: \`feature/add-button\`)
2. 변경 사항을 커밋하고 푸시합니다.
3. **Pull Request (PR)** 를 열고 팀원들에게 코드 리뷰를 요청합니다.
4. 리뷰와 피드백이 완료되면 PR을 Merge하여 \`main\` 브랜치에 합칩니다.
5. 병합된 즉시 자동화된 파이프라인(GitHub Actions)을 통해 서비스에 자동 배포됩니다.

## 자주 쓰는 고급 명령어

- \`git stash\`: 작업 중이던 코드를 커밋하지 않고 임시로 보관할 때 사용합니다.
- \`git rebase -i HEAD~3\`: 최근 3개의 커밋을 합치거나 수정하여 커밋 히스토리를 깔끔하게 정리할 때 사용합니다.
- \`git cherry-pick <commit_id>\`: 다른 브랜치의 특정 커밋만 내 브랜치로 가져오고 싶을 때 사용합니다.

코드를 잘 짜는 것만큼이나, Git을 통해 협업 이력을 잘 관리하는 것도 훌륭한 개발자의 덕목입니다!
`,
  },
  {
    title: 'Redis: 인메모리 캐시 시스템 완벽 이해',
    category: 'DevOps',
    content: `
# 속도의 한계를 넘다: Redis

Redis(Remote Dictionary Server)는 메모리 기반(In-Memory)의 초고속 Key-Value 데이터 스토어입니다. 데이터베이스, 캐시, 메시지 브로커 등으로 널리 사용되며, 디스크가 아닌 램(RAM)에 데이터를 저장하기 때문에 RDBMS(MySQL, Oracle)와는 비교할 수 없을 정도로 읽기/쓰기 속도가 빠릅니다.

## Redis의 핵심 특징

1. **In-Memory 아키텍처**: RAM에 데이터를 저장하여 밀리초(ms) 단위 이하의 응답 속도를 자랑합니다.
2. **다양한 자료구조 지원**: 단순한 String뿐만 아니라 List, Set, Hash, Sorted Set(ZSet), Bitmap 등 복잡한 데이터 구조를 제공합니다.
3. **싱글 스레드 (Single Thread)**: 한 번에 하나의 명령만 처리하므로 Race Condition(동시성 문제)을 피할 수 있고 Atomic한 연산을 보장합니다.

## 주로 어디에 쓸까? 활용 패턴

### 1. Caching (캐싱)
DB 쿼리가 무겁거나 자주 변경되지 않는 데이터를 Redis에 미리 저장해 두고 빠르게 응답합니다. (Look-aside 캐시 패턴)
- 세션(Session) 저장소: 사용자의 로그인 세션을 중앙 집중식으로 관리
- API 응답 데이터 캐싱: 실시간 랭킹 시스템, 메인 페이지 데이터 등

### 2. Rate Limiter (API 호출 횟수 제한)
특정 사용자가 짧은 시간 내에 API를 무한정 호출하는 것을 방지하기 위해 Redis의  만료 시간(TTL)과 증감 명령어(INCR)를 사용하여 트래픽을 제어합니다.

### 3. Message Queue (메시지 큐)
Redis의 Pub/Sub 기능을 활용하여 채팅 시스템이나 알림 서버에서 실시간 메시지 브로커 역할을 수행합니다. 실시간 통신 및 웹소켓 연결 관리에 탁월합니다.

### 4. Leaderboard (실시간 랭킹 시스템)
\`Sorted Set\` 자료구조를 사용하면 데이터와 점수(Score)를 함께 저장하여 자동으로 점수순 정렬을 해주므로, 게임 순위나 실시간 인기 검색어 구현이 매우 쉽습니다.

## 주의할 점
메모리는 디스크보다 용량이 작고 비쌉니다. 서버가 다운되면 데이터가 날아갈 수 있으므로(RDB, AOF 백업 방식이 있긴 하지만), **사라져도 치명적이지 않거나 언제든 DB에서 다시 복구할 수 있는 데이터**를 위주로 Redis에 보관하는 것이 핵심 설계 원칙입니다.
`,
  },
  {
    title: 'CI/CD 기초와 GitHub Actions 파이프라인',
    category: 'DevOps',
    content: `
# 개발자의 삶의 질을 높이는 마법: CI/CD

개발자가 코드를 작성하고 서버에 접속해 \`git pull\`, \`npm install\`, \`npm build\`, \`pm2 restart\`를 수동으로 매번 치고 있다면, 심각한 리소스 낭비입니다. 이를 자동화하는 것이 바로 CI/CD입니다.

## CI/CD란?

- **CI (Continuous Integration, 지속적 통합)**: 여러 개발자가 작성한 코드를 중앙 저장소에 주기적으로 합치고, 이 코드가 멀쩡한지 자동으로 빌드하고 테스트하는 과정입니다.
- **CD (Continuous Deployment, 지속적 배포)**: CI를 통과한 정상적인 코드를 프로덕션(실제 서비스) 서버에 자동으로 배포하는 과정입니다.

## GitHub Actions로 배포 파이프라인 만들기

GitHub이 자체적으로 제공하는 자동화 도구입니다. \`.github/workflows/deploy.yml\` 파일을 만들어 설정합니다.

\`\`\`yaml
name: CI/CD Pipeline

# main 브랜치에 push가 발생할 때 트리거됨
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest # 실행될 가상 환경 OS

    steps:
    - name: 소스 코드 체크아웃
      uses: actions/checkout@v3

    - name: Node.js 세팅
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: 패키지 설치
      run: npm ci

    - name: 프로젝트 빌드
      run: npm run build

    - name: 서버로 파일 전송 및 배포 실행 (SSH)
      uses: appleboy/ssh-action@master
      with:
        host: \${{ secrets.SERVER_HOST }}
        username: \${{ secrets.SERVER_USER }}
        key: \${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/my-app
          git pull origin main
          npm install
          npm run build
          pm2 reload app
\`\`\`

## 주요 개념
- **Workflow**: 자동화 프로세스의 최상위 단위 (yml 파일 하나)
- **Event**: 워크플로우를 실행시키는 트리거 (Push, Pull Request, Cron 등)
- **Job**: 하나의 러너(가상머신)에서 실행되는 단계의 집합
- **Step**: 스크립트 실행(\`run\`) 또는 미리 만들어진 액션(\`uses\`)을 호출하는 최소 단위
- **Secrets**: 비밀번호, 서버 IP, SSH 키 등 코드에 노출되면 안 되는 보안 정보를 저장하는 GitHub의 설정 기능

CI/CD를 구축해두면 개발자는 오직 **"코드 작성"** 에만 집중할 수 있게 됩니다!
`,
  },
  {
    title: 'VSCode 200% 활용법 (플러그인 & 단축키)',
    category: 'DevKit',
    content: `
# Visual Studio Code: 개발 생산성의 무기

전 세계에서 가장 많이 쓰이는 코드 에디터인 VSCode는 어떻게 세팅하고 활용하느냐에 따라 코딩 속도가 천차만별로 달라집니다. 필수 플러그인과 꿀 단축키를 소개합니다.

## 🔌 필수 확장 플러그인 (Extensions)

1. **Prettier - Code formatter**
   코드를 저장할 때마다 지정된 규칙에 맞게 띄어쓰기, 줄바꿈 등을 자동으로 예쁘게 정렬해줍니다.
2. **ESLint**
   자바스크립트/타입스크립트 문법적 오류나 안티 패턴을 실시간으로 빨간 줄로 경고해주는 정적 분석 도구입니다.
3. **GitLens**
   해당 코드 라인을 누가, 언제, 어떤 커밋 메시지로 수정했는지 흐릿한 글씨(Blame)로 즉시 보여줍니다. 협업 시 범인 찾기에 필수적입니다.
4. **Auto Rename Tag**
   HTML/JSX에서 여는 태그를 수정하면 닫는 태그도 자동으로 똑같이 변경해줍니다.
5. **Material Icon Theme**
   탐색기 창의 파일 확장자 아이콘들을 직관적이고 예쁘게 바꿔주어 가독성을 높입니다.

## ⌨️ 생산성을 미치게 올리는 단축키 (Windows/Mac)

- **명령 팔레트 열기**: \`Ctrl + Shift + P\` / \`Cmd + Shift + P\` (VSCode의 모든 기능을 검색해서 실행할 수 있습니다)
- **파일 빠른 검색**: \`Ctrl + P\` / \`Cmd + P\`
- **다중 커서 (Multi-cursor)**: \`Alt + Click\` / \`Option + Click\` (여러 곳을 동시에 수정할 때 최고입니다)
- **단어 단위 다중 선택**: \`Ctrl + D\` / \`Cmd + D\` (선택한 단어와 똑같은 다음 단어들을 순차적으로 다중 선택합니다)
- **코드 위아래로 이동**: \`Alt + ↑ / ↓\` / \`Option + ↑ / ↓\`
- **현재 줄 복사해서 아래에 붙여넣기**: \`Shift + Alt + ↓\` / \`Shift + Option + ↓\`
- **변수 일괄 변경 (Rename Symbol)**: \`F2\` (해당 변수명을 일괄 안전하게 변경합니다)
- **사이드바 숨기기/열기**: \`Ctrl + B\` / \`Cmd + B\`

장인은 도구를 탓하지 않는다지만, 개발자는 좋은 도구를 100% 활용할 줄 알아야 진짜 장인입니다. VSCode 단축키를 손에 익혀 마우스 사용을 최소화해 보세요!
`,
  }
];

async function seed() {
  console.log('Seeding study materials...');
  try {
    for (const post of studyPosts) {
      await db.insert(posts).values({
        title: post.title,
        category: post.category,
        content: post.content,
        author: 'Inpa',
      });
      console.log("Inserted: " + post.title);
    }
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

seed();
