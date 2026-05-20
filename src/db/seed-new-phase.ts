import { config } from 'dotenv';
import { db } from './index';
import { posts } from './schema';

config();

const newPosts = [
  {
    title: 'React 19 Server Actions & Form Status 완벽 활용법',
    category: 'React',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 4,
    content: `
# React 19 Server Actions: 클라이언트와 서버의 완벽한 융합

React 19에서는 서버 컴포넌트(RSC) 아키텍처의 강점을 극대화하기 위해 **Server Actions**가 공식 스펙으로 완벽히 통합되었습니다. 기존의 복잡한 API 엔드포인트 수동 설계와 fetch 기반 상태 관리 대신, 간단한 함수 정의만으로 완벽한 데이터 변형(Mutation)이 가능해졌습니다.

## 1. Server Actions 기본 개념

Server Actions는 비동기 함수 형태로 정의되며, 클라이언트 컴포넌트나 폼 엘리먼트에서 직접 호출할 수 있는 서버 측 로직입니다.

\`\`\`tsx
// actions.ts (서버 사이드 로직)
'use server';

export async function submitFeedback(formData: FormData) {
  const message = formData.get('message');
  
  // 데이터베이스 저장 로직 수행
  console.log('Server saving message:', message);
  
  return { success: true };
}
\`\`\`

## 2. useFormStatus와 useActionState 훅

React 19에서는 폼의 로딩 상태나 처리 상태를 관리하기 위해 전용 훅들을 제공합니다.

- **useActionState**: 액션 실행 후의 결과 상태와 펜딩 상태를 한 번에 관리하는 리액트 훅입니다.
- **useFormStatus**: 폼의 부모/자식 관계 하에서 폼 제출 진행 상태를 읽을 수 있게 해줍니다.

\`\`\`tsx
// FeedbackForm.tsx (클라이언트 사이드 로직)
'use client';

import { useActionState } from 'react';
import { submitFeedback } from './actions';

export default function FeedbackForm() {
  const [state, formAction, isPending] = useActionState(submitFeedback, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <textarea name="message" placeholder="피드백을 작성해 주세요" required className="border p-2 rounded" />
      <button type="submit" disabled={isPending} className="bg-blue-600 text-white p-2 rounded">
        {isPending ? '보내는 중...' : '피드백 제출하기'}
      </button>
      {state?.success && <p className="text-green-600">피드백이 성공적으로 제출되었습니다!</p>}
    </form>
  );
}
\`\`\`

React 19 Server Actions는 상태 관리 보일러플레이트를 혁신적으로 줄여주며, 코드 안정성과 가독성을 획기적으로 개선합니다.
`
  },
  {
    title: 'Kubeflow와 MLflow를 활용한 MLOps 파이프라인 자동화 실무',
    category: 'MLOps',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 6,
    content: `
# MLOps 실무: Kubeflow와 MLflow 파이프라인 설계 및 통합

단순한 머신러닝 모델의 개발을 넘어 지속적인 학습(CT)과 자동 배포(CD)를 가능케 하는 **MLOps(Machine Learning Operations)** 아키텍처의 중요성이 갈수록 커지고 있습니다. 본 포스트에서는 대표적인 두 오픈소스 툴인 **Kubeflow**와 **MLflow**를 통합하는 실무 아키텍처에 대해 소개합니다.

## 1. Kubeflow vs MLflow 역할 정리

- **Kubeflow**: 쿠버네티스(Kubernetes) 환경에서 ML 파이프라인의 오케스트레이션, 컨테이너화된 워크로드의 스케줄링 및 리소스 할당을 담당합니다.
- **MLflow**: 학습 모델의 파라미터 튜닝 정보, 모델 메트릭스(loss, accuracy)의 로깅 및 훈련된 아티팩트의 저장과 버전 관리를 담당합니다.

## 2. Kubeflow Pipeline 단계별 아키텍처

Kubeflow 파이프라인은 데이터 로드, 전처리, 훈련, 검증, 그리고 최종 서빙의 단계로 이루어집니다.

\`\`\`python
from kfp import dsl

@dsl.component
def preprocess_data():
    # 데이터셋 정제 및 피처 엔지니어링 수행
    print("Preprocessing completed.")

@dsl.component
def train_model():
    import mlflow
    mlflow.set_tracking_uri("http://mlflow-service.mlflow.svc.cluster.local:5000")
    
    with mlflow.start_run():
        mlflow.log_param("epochs", 50)
        mlflow.log_metric("accuracy", 0.96)
        # 모델 훈련 로직 수행...
        
@dsl.pipeline(name="MLOps Pipeline")
def my_ml_pipeline():
    prep_task = preprocess_data()
    train_task = train_model().after(prep_task)
\`\`\`

## 3. Kubeflow와 MLflow 연동의 강점
- **추적 가능성(Reproducibility)**: 오케스트레이션된 Kubeflow 작업 내부의 모든 모델 하이퍼파라미터와 훈련 지표가 MLflow 서버에 상세히 기록되어 재현성을 100% 보장합니다.
- **버전 일관성**: MLflow Model Registry를 통해 승인된 프로덕션 등급 모델이 Kubeflow Serving 컴포넌트를 통해 자동으로 롤링 배포됩니다.
`
  },
  {
    title: 'Python Metaclasses와 데코레이터를 활용한 고급 프레임워크 설계',
    category: 'Python',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 8,
    content: `
# Python Advanced: Metaclass와 Decorator 완벽 마스터

파이썬의 가장 강력하고도 깊이 있는 기능 중 하나는 클래스의 생성 자체를 커스텀하고 제어할 수 있는 **메타클래스(Metaclass)**와 런타임에 객체의 행위를 확장하는 **데코레이터(Decorator)**입니다. Django, FastAPI 등 유명 웹 프레임워크들은 이 두 기법을 극한으로 활용하여 유연한 인터페이스를 제공합니다.

## 1. 파이썬 메타클래스(Metaclass)란 무엇인가?

파이썬에서 클래스는 그 자체로 객체이며, 이 객체를 만드는 '클래스의 클래스'가 바로 메타클래스입니다. 기본적으로 파이썬의 모든 클래스는 \`type\` 메타클래스에 의해 생성됩니다.

\`\`\`python
# 메타클래스 선언
class APIValidationMeta(type):
    def __new__(cls, name, bases, dct):
        # 생성 대상 클래스의 모든 속성을 감시 및 검증
        if 'endpoint' not in dct:
            raise TypeError(f"API 클래스 '{name}'는 반드시 'endpoint' 속성을 정의해야 합니다!")
        return super().__new__(cls, name, bases, dct)

# 메타클래스를 활용한 클래스 강제 정의
class UserAPI(metaclass=APIValidationMeta):
    endpoint = "/users"  # 정상 컴파일
\`\`\`

## 2. 런타임 행위를 확장하는 고급 데코레이터 패턴

데코레이터는 기존 함수나 클래스의 구조를 수정하지 않고 추가적인 부가적 관심사(로그, 권한 체크, 캐싱 등)를 관통하여 동적으로 주입할 수 있는 기법입니다.

\`\`\`python
import functools
import time

def timer_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"[{func.__name__}] 실행 완료 시간: {end_time - start_time:.4f}초")
        return result
    return wrapper

@timer_decorator
def fetch_large_dataset():
    # 시뮬레이션
    time.sleep(1.2)
    return "Data Loaded"
\`\`\`

## 3. 메타클래스와 데코레이터 통합 시너지
메타클래스를 사용하여 클래스가 등록될 때 클래스 내부의 특정 메서드들에 자동으로 성능 감시 데코레이터를 적용시킴으로써 프레임워크를 개발할 때 개발자의 수동 태깅 실수를 100% 원천 차단하는 고급 설계를 구현할 수 있습니다.
`
  },
  {
    title: 'GitHub Enterprise & Actions를 이용한 대규모 빌드 격리 및 시크릿 관리',
    category: 'Github',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 5,
    content: `
# GitHub CI/CD 보안 및 엔터프라이즈 레벨 러너 인프라 구축

글로벌 엔터프라이즈 환경에서 보안은 CI/CD 자동화 파이프라인의 핵심 설계 요건입니다. 본 가이드에서는 **GitHub Enterprise Server(GHES)** 환경에서 **GitHub Actions**의 셀프 호스팅 러너(Self-hosted Runner)들을 완전히 격리하고, 민감 정보인 시크릿(Secrets)을 강력하게 관리하는 방법을 다룹니다.

## 1. 셀프 호스팅 러너 격리 기법 (Ephemerality)

보안 위협 중 가장 큰 요소는 이전 빌드에 남아 있는 리액션 파일이나 해킹용 코드가 다음 빌드 환경에 유출(Cross-contamination)되는 것입니다.

이를 차단하기 위해 **Ephemeral Runner** 모드를 도입합니다. 빌드가 끝나는 즉시 해당 러너 컨테이너를 영구 삭제하고 새로 복제하는 기법입니다.

\`\`\`bash
# 셀프 호스팅 러너 설정 시 --ephemeral 플래그 사용
./config.sh --url https://github.com/my-org --token <RUNNER_TOKEN> --ephemeral
\`\`\`

## 2. HashiCorp Vault와 OpenID Connect(OIDC) 통합

GitHub Actions에 클라우드 제공자의 자격 증명 키(AWS Access Key 등)를 하드코딩하는 방식은 매우 위험합니다. 대신 GitHub와 외부 키 관리 인프라 간 **OIDC 신뢰 연동**을 구현합니다.

\`\`\`yaml
name: AWS Deploy
on: [push]

permissions:
  id-token: write # OIDC ID 토큰 발급에 권장
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-deploy-role
          aws-region: us-east-1
          audience: sts.amazonaws.com
      - name: Deploy to S3
        run: aws s3 sync ./dist s3://my-prod-bucket
\`\`\`

위 설정을 도입하면 영구적인 비밀 키가 필요 없으며, 빌드 시점에 발급되는 단기 토큰(JWT)으로 모든 인증 과정이 끝나 보안 위협을 100% 제거할 수 있습니다.
`
  },
  {
    title: '현대 개발자가 알아야 할 아키텍처 용어: Event-Driven, Microservices, Serverless',
    category: 'IT 용어 지식',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 9,
    content: `
# 소프트웨어 아키텍처 핵심 키워드 3대 용어 완벽 분석

IT 생태계에서 "안정성", "유연성", "확장성"을 충족시키기 위해 논의되는 현대 아키텍처 패턴의 대표적인 세 가지 핵심 용어를 명확하게 설명해 드립니다.

## 1. 마이크로서비스 아키텍처 (MSA, Microservices Architecture)

기존의 거대한 하나의 통짜 애플리케이션(Monolith)을 **독립적으로 배포 가능하고 기능별로 쪼개진 작은 서비스들의 집합**으로 설계하는 패턴입니다.

- **장점**: 특정 서비스의 서버 장애가 전체 장애로 번지지 않고, 도메인별 최적의 기술 스택을 별도로 가져갈 수 있습니다.
- **단점**: 서비스 간 통신 비용 증가 및 분산 트랜잭션 관리(Saga Pattern 등)의 구현이 매우 까다롭습니다.

## 2. 이벤트 기반 아키텍처 (EDA, Event-Driven Architecture)

시스템의 각 모듈들이 서로를 직접 호출하지 않고, 중간의 메시지 브로커(Apache Kafka, RabbitMQ 등)를 통해 **이벤트(Event)를 발행(Publish)하고 구독(Subscribe)하며 통신하는 비동기식 패턴**입니다.

- **장점**: 발행자와 구독자 간 결합도(Coupling)를 완벽히 차단하여 독립적 확장이 가능합니다.
- **동작 예시**: 사용자가 결제 버튼을 누르면 "결제 성공" 이벤트를 브로커에 쏘고, 주문 처리 모듈과 알림 모듈이 비동기적으로 이를 주워 처리합니다.

## 3. 서버리스 아키텍처 (Serverless Architecture)

개발자가 실제 물리 서버 인스턴스를 관리하거나 사전에 미리 프로비저닝하지 않고, 클라우드가 코드를 실행할 컴퓨팅 리소스를 자동으로 필요한 만큼 실시간 할당하는 기법(AWS Lambda, GCP Cloud Functions 등)입니다.

- **특징**: 무부하(0-post) 대기 상황 시 리소스 사용 요금이 0원이며, 트래픽 유입에 따라 100% 자동 스케일아웃됩니다.
- **구조**: 코드는 단발성 기능 형태인 FaaS(Function as a Service) 단위로 업로드되어 단기간 실행 후 소멸합니다.

각 아키텍처 기법은 고유의 트레이드오프가 있으므로, 비즈니스 상황에 맞춰 신중히 혼용하여 사용하는 것이 최선입니다.
`
  }
];

async function seedNewPosts() {
  console.log('Inserting 5 new premium technical posts...');
  try {
    for (const post of newPosts) {
      await db.insert(posts).values({
        title: post.title,
        category: post.category,
        thumbnailUrl: post.thumbnailUrl,
        author: post.author,
        commentCount: post.commentCount,
        content: post.content.trim()
      });
      console.log(`  ✅ Successfully inserted: "${post.title}" -> Category: "${post.category}"`);
    }
    console.log('🎉 Seeding successfully completed!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

seedNewPosts().catch(console.error);
