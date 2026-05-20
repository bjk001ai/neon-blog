import { config } from 'dotenv';
import { db } from './index';
import { posts } from './schema';
import { eq } from 'drizzle-orm';

config();

const extraPosts = [
  // --- REACT (5) ---
  {
    title: 'React 19에서 변경된 새로운 기능과 리액트의 미래',
    category: 'React',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# React 19 신기능 및 리액트 생태계의 대전환

React 19 버전이 드디어 릴리즈 단계에 이르며, 리액트 아키텍처에 근본적인 대변화가 일어나고 있습니다. 이번 포스트에서는 리액트 컴파일러(React Compiler)부터 액션(Actions), 서버 컴포넌트까지 핵심 변경점들을 자세히 알아봅니다.

## 1. React Compiler (리액트 컴파일러) 도입

이전까지 리액트 개발자들은 불필요한 리렌더링을 방지하기 위해 \`useMemo\`, \`useCallback\`, \`React.memo\` 등을 명시적으로 사용해야 했습니다. 이는 가독성을 떨어뜨리고 휴먼 에러를 유발하는 주원인이었습니다.

- **자동 메모이제이션**: React Compiler는 빌드 단계에서 자동으로 코드를 분석하여 상태가 변경되지 않은 컴포넌트와 객체를 메모이제이션합니다.
- **개발 생산성 극대화**: 더 이상 불필요하게 \`useMemo\`를 덕지덕지 붙일 필요가 없습니다!

---

## 2. Server Actions (서버 액션)의 공식화

클라이언트 컴포넌트 내부에서 비동기 서버 함수를 직접 호출하는 **Server Actions**가 내장 기능으로 탑재되었습니다.

\`\`\`tsx
// 예시: 간단한 폼 전송 액션
async function updateProfile(formData: FormData) {
  'use server';
  const name = formData.get('name');
  await db.updateUser({ name });
}

export default function ProfileForm() {
  return (
    <form action={updateProfile}>
      <input type="text" name="name" />
      <button type="submit">이름 업데이트</button>
    </form>
  );
}
\`\`\`

---

## 3. 새로운 훅(Hooks)

- **\`use\`**: 비동기 데이터(Promise)나 Context를 렌더링 도중 직접 resolve할 수 있는 다목적 훅입니다. 이제 조건문이나 반복문 안에서도 Context를 읽어올 수 있습니다.
- **\`useActionState\`**: 폼 제출 시 비동기 액션의 상태(loading, data, error)를 한눈에 관리할 수 있게 도와줍니다.
- **\`useFormStatus\`**: 하위 컴포넌트에서 상위 폼의 전송 상태(pending 여부)를 손쉽게 확인할 수 있습니다.

리액트 19는 컴파일러 단계의 고도화와 풀스택 웹 솔루션으로의 지향점을 보여주는 훌륭한 이정표입니다.
`
  },
  {
    title: 'React Server Components(RSC)의 동작 원리 완벽 가이드',
    category: 'React',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# React Server Components (RSC)의 개념과 동작 메커니즘

전통적인 클라이언트 사이드 렌더링(CSR)과 서버 사이드 렌더링(SSR)의 단점들을 보완하기 위해 리액트는 **서버 컴포넌트(Server Components)**라는 새로운 렌더링 모델을 창안했습니다.

## 1. SSR과 RSC의 결정적 차이점

- **SSR (Server Side Rendering)**: 서버에서 전체 React 트리를 HTML 문자열로 변환하여 브라우저에 내려보내고, 브라우저에서 JavaScript 코드가 다운로드되면 **Hydration**을 진행합니다.
- **RSC (React Server Components)**: 서버에서만 실행되며 브라우저용 JavaScript 번들 크기를 전혀 증가시키지 않는 컴포넌트입니다. 빌드되거나 서버에서 실행된 컴포넌트는 특수 직렬화 형식(JSON과 유사한 데이터)으로 변환되어 브라우저로 점진적 전송(Streaming)됩니다.

---

## 2. RSC의 핵심 장점

1. **제로 번들 사이즈**: 서버 컴포넌트에 쓰인 라이브러리(e.g., \`marked\`, \`date-fns\`)는 브라우저 번들에 절대 포함되지 않아 페이지 로딩이 엄청나게 빨라집니다.
2. **다이렉트 백엔드 액세스**: 데이터베이스, 파일 시스템, 서버 자원에 API 엔드포인트 없이 직접 연결하여 쿼리를 수행할 수 있습니다.
3. **클라이언트 상태 유지**: 페이지 일부를 서버에서 다시 렌더링해 가져오더라도 브라우저의 입력 폼 내용이나 포커스, CSS 애니메이션 상태가 완벽하게 유지됩니다!
`
  },
  {
    title: 'Zustand를 이용한 가볍고 강력한 React 상태 관리 기법',
    category: 'React',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# Zustand: Redux와 Context API를 대체하는 최신 상태 관리 라이브러리

리액트 어플리케이션이 커질수록 글로벌 상태 관리는 필수적입니다. Redux의 과도한 보일러플레이트 코드에 지쳤거나 Context API의 리렌더링 비효율성에 직면했다면, **Zustand**가 최고의 정답입니다.

## 1. Zustand를 쓰는 이유

- **보일러플레이트 제로**: 간단한 함수 하나로 스토어를 즉시 선언할 수 있습니다.
- **뛰어난 성능**: 상태의 특정 부분만 구독(selector)하여 불필요한 리렌더링을 차단합니다.
- **번들 크기 최소화**: 단 수 킬로바이트(KB) 수준의 초경량 라이브러리입니다.

---

## 2. Zustand 기본 실습 코드

\`\`\`ts
import { create } from 'zustand';

// 1. 상태 및 액션 타입을 갖는 스토어 생성
interface CounterState {
  count: number;
  increase: () => void;
  decrease: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));

// 2. 컴포넌트에서 손쉽게 사용
export default function CounterComponent() {
  const { count, increase, decrease } = useCounterStore();
  return (
    <div>
      <h1>개수: {count}</h1>
      <button onClick={increase}>증가</button>
      <button onClick={decrease}>감소</button>
    </div>
  );
}
\`\`\`

단순하면서도 확장성이 높아 현대 React 프로젝트에서 가장 선호되는 상태 관리 라이브러리 중 하나입니다.
`
  },
  {
    title: 'React Native로 크로스 플랫폼 앱 개발 시작하기',
    category: 'React',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# React Native를 통한 iOS & Android 앱 동시 개발

모바일 어플리케이션을 제작할 때 iOS(Swift)와 Android(Kotlin)를 별도로 코딩하는 것은 비효율적입니다. **React Native (RN)**는 React와 JavaScript 기술만으로 실제 네이티브 앱 코드를 생성해내는 가장 인기 있는 크로스 플랫폼 프레임워크입니다.

## 1. React Native의 작동 구조

React Native는 JavaScript 쓰레드와 네이티브 쓰레드 간의 **Bridge** 기술(또는 신규 아키텍처인 JSI)을 사용하여 통신합니다. 웹 뷰를 띄우는 하이브리드 앱과 달리, React Native 코드는 실제 iOS/Android UI 컴포넌트로 매핑되므로 모션이 매우 부드럽습니다.

---

## 2. 초기 개발 설정 팁

- **Expo**: 복잡한 Xcode나 Android Studio 설정 없이 모바일 폰에 전용 앱을 깔아 바로 개발하고 배포할 수 있는 초보자 필수 개발 플랫폼입니다.
- **React Native CLI**: 네이티브 모듈이나 C++ 라이브러리를 직접 커스터마이징해야 하는 대형 엔터프라이즈 프로젝트에 적합합니다.

React 기술을 그대로 모바일까지 확장하여 엄청난 비즈니스 속도와 효율성을 이끌어낼 수 있습니다.
`
  },
  {
    title: 'React 어플리케이션 성능 최적화: Virtual DOM과 렌더링 최적화',
    category: 'React',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# React 렌더링 성능 정복: 60fps 부드러운 화면 만들기

리액트 앱이 복잡해질수록 미세한 렉(Lag)이나 버벅임이 발생할 수 있습니다. 리액트의 가상 돔(Virtual DOM) 알고리즘을 깊이 이해하고, 불필요한 연산을 막아 60프레임의 쾌적한 UX를 확보하는 꿀팁을 전수합니다.

## 1. 렌더링 성능 진단도구 활용

- **React Developer Tools**: 프로파일러(Profiler) 탭을 켜서 어떤 컴포넌트가 언제, 왜 리렌더링되었는지 색상 그래프로 한눈에 확인할 수 있습니다.

---

## 2. 대표적인 최적화 기법

1. **상태 분리 및 하향(State Colocation)**: 특정 컴포넌트만 쓰는 상태를 불필요하게 최상위 Root 컴포넌트에 올리지 마세요. 해당 상태를 사용하는 말단 컴포넌트로 위치를 내리면 광범위한 리렌더링을 완전히 방지할 수 있습니다.
2. **\`React.memo\`를 통한 컴포넌트 불변화**: Props 변화가 없는 순수 컴포넌트의 경우 리렌더링을 생략하도록 캐싱 처리합니다.
3. **무거운 연산 제거**: 배열 정렬, 복잡한 파싱 작업 등은 \`useMemo\`를 이용하여 의존성 배열이 바뀔 때만 연산되도록 가둡니다.
`
  },

  // --- MLOps (4) ---
  {
    title: 'MLOps의 기초: 머신러닝 생명주기 관리란 무엇인가?',
    category: 'MLOps',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# MLOps (Machine Learning Operations) 핵심 이론 총정리

일반 소프트웨어 배포(DevOps)와 머신러닝 모델 배포(MLOps)의 차이는 무엇일까요? 머신러닝은 한 번 빌드해서 배포하고 끝나는 것이 아니라, 끊임없이 새로 들어오는 **데이터의 변화**에 대응해야 하기 때문에 훨씬 까다로운 수명 관리가 요구됩니다.

## 1. MLOps가 해결하려는 문제

- **Data Drift**: 시간의 흐름에 따라 실제 예측 환경의 데이터 특징이 학습 데이터와 완전히 달라지는 현상입니다.
- **Model Training Automation**: 데이터가 업데이트될 때마다 자동으로 재학습하고 검증하여 롤아웃하는 CD 파이프라인의 핵심입니다.

---

## 2. MLOps 생명주기 5단계

1. **데이터 수집 및 정제**: 데이터 정합성과 버전 관리(DVC 등) 적용
2. **모델 개발 및 실험**: 하이퍼파라미터 튜닝 및 모델 추적 관리
3. **CI/CD 파이프라인**: 자동으로 모델 성능을 테스트하고 이미징
4. **모델 배포**: REST API(FastAPI)나 gRPC 형식의 마이크로서비스 서빙
5. **모니터링**: 서빙 품질, 추론 속도(Latency), 성능 저하 감시
`
  },
  {
    title: 'Docker와 Kubernetes를 활용한 ML 모델 서빙 인프라 구축',
    category: 'MLOps',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# 쿠버네티스(K8s) 상에서 대규모 AI 모델 안정적으로 운영하기

사용자의 예측 요청이 갑자기 폭증할 때, 하나의 가상 서버에 올라간 딥러닝 모델은 과부하로 죽고 맙니다. MLOps 아키텍트가 선택하는 표준 아키텍처는 **Docker**로 모델을 패키징하고 **Kubernetes**로 자동 확장(Auto-scaling)을 제어하는 구조입니다.

## 1. 모델 서빙의 컨테이너화

모델 학습을 마치면 학습된 가중치 파일(e.g., \`.onnx\`, \`.pt\`, \`.bin\`)과 예측 웹 프레임워크(Triton Server, FastAPI)를 Dockerfile 하나로 통합하여 불변의 컨테이너 이미지로 빌드합니다.

---

## 2. Kubernetes 기반 오케스트레이션 설계

- **HPA (Horizontal Pod Autoscaler)**: CPU/GPU 사용량이나 동시 요청 수에 따라 Pod(컨테이너 실행 단위) 개수를 탄력적으로 늘려 트래픽 폭증을 완화합니다.
- **Kubernetes 스케줄러**: GPU 리소스를 효율적으로 분배하고 멀티 노드 클러스터 전역에 모델을 적절하게 분산 배치합니다.
`
  },
  {
    title: 'Kubeflow를 활용한 머신러닝 파이프라인 자동화 설계',
    category: 'MLOps',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# Kubeflow Pipelines를 통한 엔드투엔드 워크플로우 엔지니어링

**Kubeflow**는 Kubernetes 환경에서 머신러닝 개발, 학습, 배포 워크플로우를 가장 효율적으로 배포하고 관리해주는 오픈소스 MLOps 툴킷입니다.

## 1. 왜 Kubeflow Pipelines(KFP)인가?

수작업으로 하던 데이터 추출 -> 특징 전처리 -> 모델 트레이닝 -> 모델 평가 단계를 재사용 가능한 컴포넌트 기반 파이프라인으로 정의하고 시각화 대시보드에서 예약 및 관리할 수 있습니다.

- **컴포넌트 독립성**: 각 파이프라인 노드는 개별 Docker 컨테이너에서 동작하여 라이브러리 충돌이 완전히 차단됩니다.
- **재사용성**: 한 번 검증된 데이터 전처리 코드는 다른 프로젝트의 파이프라인에서도 조립하여 바로 쓸 수 있습니다.
`
  },
  {
    title: 'MLflow로 실험 추적 및 모델 레지스트리 구축하기',
    category: 'MLOps',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# MLflow: 머신러닝 실험 로깅과 모델 버전 제어 플랫폼

머신러닝 엔지니어들은 수백 번의 실험을 반복하면서 수많은 하이퍼파라미터와 평가 지표(Accuracy, Loss, F1)를 비교합니다. 이를 엑셀이나 수기로 기록하는 대신 **MLflow**를 사용하면 클릭 한 번으로 모든 기록을 저장하고 시각화할 수 있습니다.

## 1. MLflow 핵심 구성 요소

1. **MLflow Tracking**: 모델 학습 중 파라미터, 성능 지표, 아티팩트(모델 파일, 가중치 그래프)를 자동으로 서버에 기록합니다.
2. **MLflow Models**: 다양한 프레임워크(Scikit-Learn, PyTorch, TensorFlow)로 제작된 모델을 표준 규격 포맷으로 저장하여 서빙 호환성을 높입니다.
3. **MLflow Model Registry**: 팀 단위 협업 시 어떤 모델이 현재 배포 대기(Staging) 상태이고 프로덕션(Production) 상태인지 라이프사이클 버전을 안전하게 기록/승인 관리합니다.
`
  },

  // --- GITHUB (4) ---
  {
    title: 'GitHub Pages와 Actions로 포트폴리오 무료 호스팅하기',
    category: 'Github',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# 개발자의 필수 포트폴리오를 무료로 호스팅하는 완벽한 DevOps 가이드

아키텍처 설계와 훌륭한 백엔드 코드를 작성했더라도, 이를 세상에 보여줄 멋진 정적 웹사이트(포트폴리오)가 없다면 무용지물입니다. **GitHub Pages**와 자동 배포 빌더인 **GitHub Actions**를 사용하여 단 10분 만에 웹 호스팅을 완성하는 비법입니다.

## 1. GitHub Actions 워크플로우 설정

프로젝트 루트 경로에 \`.github/workflows/deploy.yml\`을 작성합니다:

\`\`\`yaml
name: Deploy Portfolio
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: 20
    - name: Install and Build
      run: |
        npm install
        npm run build
    - name: Deploy static assets to Pages
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        folder: build
        branch: gh-pages
\`\`\`

코드만 \`push\`하면 자동으로 빌드 검증을 거친 후 무료 호스팅 주소로 배포가 이루어져 지속적 배포(CD)를 완전 무료로 즐길 수 있습니다!
`
  },
  {
    title: 'Git Rebase vs Git Merge: 브랜치 히스토리 깔끔하게 관리하기',
    category: 'Github',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# Git 브랜치 전략의 양대 산맥: Merge와 Rebase 비교 및 활용법

협업 프로젝트를 진행할 때 수많은 개발자의 커밋 이력이 뒤엉켜 깃 그래프가 복잡한 그물망처럼 변하는 현상을 많이 겪어보셨을 것입니다. 히스토리를 정돈하는 두 방법의 원리와 차이점을 깊이 살펴봅시다.

## 1. Git Merge (병합)

- **동작**: 두 브랜치의 변경 이력을 하나로 합치는 새로운 **Merge Commit**을 생성합니다.
- **장점**: 개발을 진행했던 브랜치 분기점과 병합 시점을 있는 그대로 보존하여 히스토리 역추적이 쉽습니다.
- **단점**: 그래프가 지나치게 지저분해져 커밋 히스토리를 읽기 어려워질 수 있습니다.

---

## 2. Git Rebase (재배치)

- **동작**: 현재 브랜치의 시작 위치(Base)를 대상 브랜치의 최신 커밋 위치로 통째로 옮겨 커밋 이력을 **일렬(Linear History)**로 다시 작성합니다.
- **장점**: 히스토리가 군더더기 없이 일직선으로 그려져 가독성이 예술입니다!
- **단점**: 이미 원격 리포지토리에 푸시된 커밋에 대해 Rebase를 실행하면 충돌 대란이 일어나고 기존 커밋 해시가 깨지므로 절대적으로 로컬 환경에서만 신중하게 사용해야 합니다.
`
  },
  {
    title: 'GitHub CLI(gh) 설치 및 터미널에서 깃허브 정복하기',
    category: 'Github',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# GitHub CLI를 통한 개발 생산성 극한 극대화 기법

브라우저 마우스 클릭 없이 오직 키보드와 터미널 창 안에서 GitHub Issue를 확인하고, Pull Request(PR)를 날리며, 레포지토리를 생성하는 방법을 소개합니다. 바로 **GitHub CLI (\`gh\`)**입니다.

## 1. 깃허브 CLI 핵심 명령어

- **레포지토리 즉시 생성**:
  \`\`\`bash
  gh repo create my-awesome-project --public
  \`\`\`
- **PR 목록 조회 및 검토**:
  \`\`\`bash
  gh pr list
  gh pr checkout 42 # 42번 PR 코드로 로컬 브랜치 자동 스위칭!
  \`\`\`
- **PR 생성하기**:
  \`\`\`bash
  gh pr create --title "feat: 멋진 결제 로직 구현" --body "상세 내역 기재..."
  \`\`\`

터미널 작업 속도가 3배 이상 빨라지는 혁신적인 툴셋으로 마우스를 전혀 만질 필요가 없게 됩니다.
`
  },
  {
    title: 'GitHub Co-pilot을 200% 활용하는 개발자의 프롬프트 작성법',
    category: 'Github',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# AI 페어 프로그래밍 시대: 깃허브 코파일럿 최적 조종법

GitHub Co-pilot은 코딩 속도를 놀랍도록 높여주는 강력한 동반자입니다. 하지만 AI가 부정확한 코드를 내뱉거나 엉뚱한 로직을 생성하는 경우를 겪으셨을 텐데, 이는 코파일럿에 전달하는 **프롬프트(주석 및 주변 컨텍스트)**를 다루는 스킬이 부족하기 때문입니다.

## 1. 명확한 가이드라인 제공하기

- **역할 및 범위 기재**: 코딩을 시작하기 전 파일 최상단에 마크다운이나 주석으로 어플리케이션의 목표, 입출력 구조, 엣지 케이스 처리 방침을 꼼꼼히 한글이나 영어로 적어줍니다.
- **예시 제공 (Few-shot)**: 내가 원하는 디자인 패턴이나 특정한 형태의 유틸리티 함수의 예제를 한 개 이상 제공하면 코파일럿이 이를 정확하게 캐치하여 유사한 코드를 완벽하게 찍어냅니다.
`
  },

  // --- PYTHON (4) ---
  {
    title: 'Python 비동기 프로그래밍 (asyncio와 코루틴 완벽 실습)',
    category: 'Python',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# Python의 느린 성능을 보완하는 비동기 프로그래밍 완벽 이해

파이썬은 단일 쓰레드로 동작하여 I/O 바운드 작업(웹 스크래핑, 대량 데이터 API 요청) 시 막대한 병목 현상이 발생합니다. 이를 극적으로 타개하기 위한 파이썬의 비동기 프레임워크인 **\`asyncio\`**의 핵심 개념인 코루틴(Coroutine), \`async/await\`을 이해해 봅시다.

## 1. 동기 방식과 비동기 방식의 비교 실습

\`\`\`python
import asyncio
import time

async def fetch_data(id, delay):
    print(f"Task {id} 시작")
    await asyncio.sleep(delay)  # 비동기 대기
    print(f"Task {id} 완료")
    return f"Data {id}"

async def main():
    start = time.time()
    # 3개의 비동기 작업을 동시에 처리
    results = await asyncio.gather(
        fetch_data(1, 2),
        fetch_data(2, 3),
        fetch_data(3, 1)
    )
    print(f"총 소요시간: {time.time() - start:.2f}초")

asyncio.run(main())
\`\`\`

3개의 작업을 동기로 실행했다면 6초(2+3+1)가 걸렸겠지만, 비동기 처리를 통하여 **가장 긴 대기 시간인 단 3초 만에** 모든 연산이 깔끔하게 끝납니다!
`
  },
  {
    title: 'FastAPI로 10분 만에 고성능 비동기 웹 API 서버 구축하기',
    category: 'Python',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# FastAPI: Django/Flask보다 빠른 차세대 파이썬 백엔드

파이썬 웹 진영의 판도를 바꾸고 있는 초고속 웹 프레임워크 **FastAPI**는 놀라운 속도와 직관적인 타이핑 시스템으로 많은 개발자들의 찬사를 받고 있습니다.

## 1. FastAPI의 결정적 차별성

1. **초고속 성능**: Starlette과 Uvicorn 기반으로 개발되어 Go, Node.js와 어깨를 나란히 하는 최고 수준의 퍼포먼스를 보장합니다.
2. **자동 Swagger 문서화**: 코드를 작성하고 \`/docs\`로 이동하는 순간, 즉석에서 수려한 Swagger UI 인터랙티브 문서가 자동으로 만들어져 프론트엔드 협업이 매우 수월해집니다.
3. **Pydantic 타입 밸리데이션**: 파이썬 타입 힌트를 이용하여 요청 바디의 유효성을 완벽하게 사전 필터링합니다.
`
  },
  {
    title: 'Python 가상 환경 관리: venv, Poetry, Pipenv 장단점 비교',
    category: 'Python',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# 파이썬 의존성 지옥 탈출기: 가장 최적의 패키지 관리 도구 선택하기

새 프로젝트를 만들 때마다 패키지 버전들이 충돌하여 개발 환경이 망가졌던 경험이 다들 있으실 겁니다. 파이썬 가상 환경 도구들의 차이와 추천 가이드를 정리해 드립니다.

## 1. 도구별 특징 요약

- **venv**: 파이썬에 기본 내장된 가장 가볍고 표준적인 가상 환경 라이브러리입니다. 단순한 토이 프로젝트에 아주 유용합니다.
- **Pipenv**: Node.js의 \`npm\`처럼 \`Pipfile\`과 \`Pipfile.lock\`을 사용하여 의존성 패키지 관계를 엄격히 잠금 관리합니다.
- **Poetry (적극 권장)**: 패키지 빌드, 가상 환경 관리, PyPI 배포까지 올인원으로 지원하며, 정교한 의존성 해결(Dependency Resolution) 알고리즘으로 최신 대형 프로젝트에서 가장 애용되고 있습니다.
`
  },
  {
    title: 'Python Decorator(@) 이해와 효율적인 코드 재사용 기법',
    category: 'Python',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# 파이썬 데코레이터(@) 핵심 개념 마스터하기

파이썬 코드를 읽다 보면 함수 위에 얹어진 \`@my_decorator\` 형태의 구조를 자주 접합니다. 이는 기존 코드의 변경 없이 함수의 행동 양식을 꾸며주고(decorate) 확장할 수 있게 만들어주는 고급 설계 기법입니다.

## 1. 데코레이터의 기본 원리

파이썬에서 함수는 **일급 객체(First-Class Object)**이므로 함수를 다른 함수의 인자로 전달하고 반환할 수 있는 성질을 이용합니다.

\`\`\`python
def log_execution_time(func):
    def wrapper(*args, **kwargs):
        print(f"[LOG] {func.__name__} 함수가 호출되었습니다.")
        result = func(*args, **kwargs)
        print(f"[LOG] {func.__name__} 실행이 완료되었습니다.")
        return result
    return wrapper

@log_execution_time
def process_data(data):
    print(f"데이터 처리 중: {data}")

process_data("Bong Tech Blog")
\`\`\`

코드 중복을 획기적으로 줄이고 공통 기능(인증 체크, 성능 측정, 에러 처리)을 깔끔하게 유지할 수 있습니다.
`
  },

  // --- IT 용어 지식 (4) ---
  {
    title: 'RESTful API vs GraphQL: 백엔드 API 설계 트렌드 총정리',
    category: 'CS 지식',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# 현대 백엔드 API 설계의 양대 패러다임 비교 분석

모바일이나 프론트엔드 어플리케이션과 데이터를 주고받기 위한 백엔드 인터페이스 표준 설계 방식인 **REST API**와 페이스북이 주도하는 **GraphQL**의 차이점과 프로젝트 성격에 맞춰 선택하는 기준을 수립해 봅니다.

## 1. RESTful API의 전통적 단점

- **Over-fetching**: 내가 필요한 데이터는 단 한 줄인데, API 응답에 50줄의 불필요한 전체 필드가 모두 담겨와 데이터 전송량이 낭비됩니다.
- **Under-fetching**: 한 화면을 렌더링하기 위해 유저 정보 API, 게시글 정보 API, 댓글 정보 API를 각각 개별 호출(N+1 네트워크 레이턴시)해야 하는 비효율성이 따릅니다.

---

## 2. GraphQL의 혁신적인 해결책

- **단일 엔드포인트 (\`/graphql\` )**: 클라이언트가 쿼리 문서를 작성해 "나에게 유저 이름과 최근 작성한 게시글 제목 3개만 줘"라고 명확히 선언하면, 백엔드는 단 한 번의 요청으로 요청한 데이터만 딱 알맞게 묶어서 전달합니다!
`
  },
  {
    title: 'JWT(JSON Web Token) 로그인 토큰 인증 완벽 이해하기',
    category: 'CS 지식',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# 서버리스 및 분산 시스템을 위한 JWT 기반 사용자 인증 아키텍처

기존 세션 기반 인증의 서버 메모리 팽창 문제를 완벽하게 해결해 주는 **JWT (JSON Web Token)**의 구조와 보안 강화 전략(AccessToken/RefreshToken)을 알기 쉽게 풀어 설명합니다.

## 1. JWT의 핵심 구성 세 가지

- **Header**: 토큰의 타입과 사용할 암호화 알고리즘 규격 기재 (e.g. HS256)
- **Payload**: 사용자 식별 ID나 만료 시간(exp) 등 클레임 정보 저장 (디코딩하면 누구나 볼 수 있으므로 비밀번호 등의 민감한 정보는 절대 포함해서는 안 됩니다!)
- **Signature**: 서버만 아는 비밀키로 생성한 암호 서명입니다. 이 서명이 일치해야 토큰의 위변조가 없었음을 보증받을 수 있습니다.

데이터를 토큰 자체에 내장하고 있어 서버 측 세션 저장소가 불필요한 Stateless한 구조를 실현할 수 있습니다.
`
  },
  {
    title: 'OAuth 2.0 카카오/구글 소셜 로그인 동작 프로세스 이해',
    category: 'CS 지식',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# 소셜 로그인의 뼈대: OAuth 2.0 4단계 인증 시나리오 마스터

웹사이트 회원가입이 귀찮을 때 "카카오로 로그인"을 클릭하는 즉시 이루어지는 백엔드 및 인증 서비스간의 복잡한 인증 흐름을 완전히 도식화하여 완벽하게 머릿속에 이식해 드립니다.

## 1. OAuth 2.0 핵심 참여자

- **Resource Owner**: 일반 사용자
- **Client**: 소셜 로그인을 제공하려는 우리 서비스
- **Authorization Server**: 카카오/구글 로그인 서버
- **Resource Server**: 사용자 프로필 정보를 가진 카카오/구글의 리소스 API 서버

---

## 2. 인증 토큰 발급 프로세스 흐름

1. 사용자가 소셜 로그인 버튼 클릭 -> 카카오 로그인 화면 노출 및 동의
2. 인증 성공 시 카카오는 우리 백엔드의 리다이렉트 URL로 일회용 **Authorization Code(인가 코드)** 전달
3. 우리 백엔드는 전달받은 인가 코드를 카카오 인증 서버에 재전송하여 신뢰할 수 있는 **Access Token(액세스 토큰)**과 교환
4. 액세스 토큰으로 카카오 리소스 서버에 유저의 닉네임, 이메일, 아바타 이미지를 요청해와 로그인 처리를 완료합니다.
`
  },
  {
    title: 'CORS(Cross-Origin Resource Sharing) 에러 원인과 완벽 해결법',
    category: 'CS 지식',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# 프론트엔드 개발자들을 떨게 만드는 빨간색 CORS 에러 격파하기

로컬 환경에서 프론트엔드(\`localhost:3000\`)를 개발하며 백엔드 API 서버(\`localhost:8080\`)에 데이터를 요청하면 십중팔구 브라우저 콘솔창에 빨간색 CORS 차단 에러를 맞닥뜨리게 됩니다. 이 현상이 왜 일어나고, 어떻게 해결하는지 알아봅니다.

## 1. CORS는 에러가 아닌 보안막이다

브라우저의 핵심 정책인 **SOP (Same-Origin Policy)**에 따라, 출처(프로토콜 + 도메인 + 포트)가 다른 리소스 자원 간의 안전하지 않은 접근을 원천 차단합니다. 이는 해킹 사이트에서 내 원래 은행 사이트로 나 몰래 불법 API를 쏘는 크로스 사이트 스크립팅 공격을 방지하기 위함입니다.

---

## 2. 해결 방안 2가지

1. **백엔드 CORS 허용 헤더 설정 (가장 추천)**: 백엔드 서버 응답 헤더에 프론트엔드의 오리진 주소를 명확하게 추가해 줍니다.
   - \`Access-Control-Allow-Origin: http://localhost:3000\`
2. **리버스 프록시(Reverse Proxy) 설정**: Next.js나 Vite 개발 서버의 \`proxy\` 설정을 켜서 브라우저에는 같은 도메인으로 들어오는 것처럼 눈속임 처리를 해줍니다.
`
  }
];

const leafCategoryMap: Record<string, string> = {
  // 기존 포스트들 카테고리 매핑도 확실히 유지/보수
  '마크다운(Markdown) 문법 완벽 가이드': 'Markdown',
  'Sass (SCSS) 핵심 문법 및 활용법': 'Sass',
  'TypeScript 기초부터 실전까지': 'TypeScript',
  'Docker 컨테이너와 Docker Compose': 'Docker',
  'Node.js 이벤트 루프와 비동기 처리': 'Node.js',
  'React 훅(Hooks)과 최적화 기법': 'React',
  'Nest.js 아키텍처와 의존성 주입(DI)': 'Nest.js',
  'Next.js App Router 아키텍처 핵심': 'Next.js',
  '협업을 위한 Git 브랜치 전략': 'GIT',
  'Redis: 인메모리 캐시 시스템 완벽 이해': 'Redis',
  'CI/CD 기초와 GitHub Actions 파이프라인': 'CI/CD',
  'VSCode 200% 활용법 (플러그인 & 단축키)': 'VSCode',
  '[Cypress Studio] 📝 더욱 간편해진 웹 테스트 자동화 툴': 'Cypress',
  '[Cypress] 📝 웹 테스트 자동화 사용법 👀 한눈에 정리': 'Cypress',
  '💻 Window 10 컴퓨터 부팅 / 절전 시간 확인하기': 'Window',
  '🤔 스레드를 많이 쓸수록 항상 성능이 좋아질까?': 'CS 지식',
  '🔄 자바스크립트 이벤트 루프 동작 구조 & 원리 끝판왕': 'JavaScript',
  '👩‍💻 완벽히 이해하는 동기/비동기 & 블로킹/논블로킹': 'CS 지식',
  '🌐 자바스크립트의 핵심 \'비동기\' 완벽 이해 ❗': 'JavaScript',
  '🔮 PurgeCSS 사용법 - CSS 프레임워크 코드 최적화': 'CSS',
  '📋 관계 대수 & 관계 해석 표현법 💯 총정리': '데이터베이스 이론',
  '🌟 first-child / first-of-type 속성 차이점': 'CSS'
};

const workingThumbnailMap: Record<string, string> = {
  '마크다운(Markdown) 문법 완벽 가이드': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
  'Sass (SCSS) 핵심 문법 및 활용법': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop',
  'TypeScript 기초부터 실전까지': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  'Docker 컨테이너와 Docker Compose': 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=800&auto=format&fit=crop',
  'Node.js 이벤트 루프와 비동기 처리': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
  'React 훅(Hooks)과 최적화 기법': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
  'Nest.js 아키텍처와 의존성 주입(DI)': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  'Next.js App Router 아키텍처 핵심': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
  '협업을 위한 Git 브랜치 전략': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=800&auto=format&fit=crop',
  'Redis: 인메모리 캐시 시스템 완벽 이해': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'CI/CD 기초와 GitHub Actions 파이프라인': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'VSCode 200% 활용법 (플러그인 & 단축키)': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  '[Cypress Studio] 📝 더욱 간편해진 웹 테스트 자동화 툴': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  '[Cypress] 📝 웹 테스트 자동화 사용법 👀 한눈에 정리': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop',
  '💻 Window 10 컴퓨터 부팅 / 절전 시간 확인하기': 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=800&auto=format&fit=crop',
  '🤔 스레드를 많이 쓸수록 항상 성능이 좋아질까?': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
  '🔄 자바스크립트 이벤트 루프 동작 구조 & 원리 끝판왕': 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=800&auto=format&fit=crop',
  '👩‍💻 완벽히 이해하는 동기/비동기 & 블로킹/논블로킹': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  '🌐 자바스크립트의 핵심 \'비동기\' 완벽 이해 ❗': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop',
  '🔮 PurgeCSS 사용법 - CSS 프레임워크 코드 최적화': 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=800&auto=format&fit=crop',
  '📋 관계 대수 & 관계 해석 표현법 💯 총정리': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
  '🌟 first-child / first-of-type 속성 차이점': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop'
};

async function runSeedExtra() {
  console.log('Starting extra posts seed and sync script...');
  try {
    // 1. Delete old duplicate extra posts if exists
    const extraTitles = extraPosts.map(p => p.title);
    for (const title of extraTitles) {
      await db.delete(posts).where(eq(posts.title, title));
    }
    console.log('Cleaned up existing identical extra posts (prevent duplicate).');

    // 2. Insert new extra posts
    for (const post of extraPosts) {
      await db.insert(posts).values(post);
      console.log(`Inserted extra post: "${post.title}" (Category: ${post.category})`);
    }

    // 3. Update existing posts with correct categories & working thumbnails
    const allPosts = await db.select().from(posts);
    for (const post of allPosts) {
      const mappedCategory = leafCategoryMap[post.title] || post.category;
      const mappedThumbnail = workingThumbnailMap[post.title] || post.thumbnailUrl;
      
      await db.update(posts)
        .set({
          category: mappedCategory,
          thumbnailUrl: mappedThumbnail
        })
        .where(eq(posts.id, post.id));
      
      console.log(`Synced post ID ${post.id}: "${post.title}" -> Thumbnail/Category sync done.`);
    }

    console.log('✅ 21 Extra Posts Seeding & Database Sync Completed Successfully!');
  } catch (error) {
    console.error('❌ Error during extra seeding:', error);
  } finally {
    process.exit(0);
  }
}

runSeedExtra();
