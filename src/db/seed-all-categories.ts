import { config } from 'dotenv';
import { db } from './index';
import { posts } from './schema';
import { eq, sql } from 'drizzle-orm';
import { CATEGORIES, CategoryNode } from '../lib/categories';

config();

// Detailed, high-quality technical post templates for every leaf category
const postTemplates: Record<string, { title: string; content: string; thumbnailUrl: string }> = {
  '자료구조': {
    title: '자료구조의 기초: Array, LinkedList, Stack, Queue 완벽 정리',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop',
    content: `
# 자료구조의 기초: 메모리와 데이터의 효율적인 배치

프로그래밍에서 자료구조(Data Structure)는 데이터를 효율적으로 관리하고 조직하는 방법을 말합니다. 적절한 자료구조 선택은 프로그램의 메모리 사용량과 연산 속도(시간 복잡도)를 결정짓는 핵심 요소입니다.

## 1. Array (배열)
- **특징**: 메모리의 연속된 공간에 데이터를 순차적으로 저장하는 선형 구조입니다.
- **장점**: 인덱스를 통한 직접 접근이 가능해 조회 속도가 매우 빠릅니다 ($O(1)$).
- **단점**: 크기가 고정되어 있어 데이터 삽입/삭제 시 데이터를 한 칸씩 이동해야 하므로 비효율적입니다 ($O(N)$).

## 2. LinkedList (연결 리스트)
- **특징**: 각 데이터(노드)가 다음 노드의 메모리 주소를 가리키는 포인터로 연결된 구조입니다.
- **장점**: 동적으로 크기를 조절할 수 있으며, 중간에 데이터를 삽입하거나 삭제하는 연산이 유연합니다.
- **단점**: 순차 접근만 가능하므로 임의 조회 속도가 느립니다 ($O(N)$).

## 3. Stack (스택)
- **특징**: LIFO (Last In First Out, 후입선출) 구조로, 한쪽 끝에서만 데이터를 넣고 뺄 수 있습니다.
- **주요 활용**: 함수 호출 스택, 브라우저 뒤로가기 버튼, 실행 취소(Undo).

## 4. Queue (큐)
- **특징**: FIFO (First In First Out, 선입선출) 구조로, 한쪽(Rear)에서는 데이터를 넣고 다른 한쪽(Front)에서는 데이터를 뺍니다.
- **주요 활용**: 프린터 대기열, CPU 태스크 스케줄링, 데이터 캐싱 버퍼.
`
  },
  '알고리즘': {
    title: '알고리즘 공부의 시작: 시간 복잡도와 Big-O 표기법 마스터하기',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop',
    content: `
# 시간 복잡도와 Big-O 표기법의 핵심 개념

알고리즘 성능을 평가할 때 가장 중요한 기준은 바로 **시간 복잡도(Time Complexity)**입니다. 컴퓨터 사양에 상관없이 알고리즘이 처리해야 하는 입력 데이터의 크기($N$)에 따라 연산 횟수가 어떻게 증가하는지 수학적으로 표현합니다.

## 1. Big-O 표기법 종류

- **$O(1)$ - 상수 시간**: 입력에 관계없이 항상 일정한 속도로 실행됩니다. (e.g. 배열 인덱스 조회)
- **$O(\\log N)$ - 로그 시간**: 실행될 때마다 탐색 범위가 절반으로 줄어듭니다. (e.g. 이진 탐색)
- **$O(N)$ - 선형 시간**: 입력 크기 $N$에 비례하여 연산 횟수가 증가합니다. (e.g. 선형 탐색)
- **$O(N^2)$ - 2차 시간**: 중첩 루프가 있어 연산 횟수가 $N$의 제곱으로 폭증합니다. (e.g. 버블 정렬)

## 2. 알고리즘 최적화 전략
훌륭한 개발자는 코드 작성 전, 최악의 경우(Worst Case) 시간 복잡도를 고려합니다. $O(N^2)$ 로 구현된 로직을 자료구조나 Divide and Conquer 기법을 활용해 $O(N \\log N)$ 이하로 개선하는 것이 문제 해결력의 정수입니다.
`
  },
  '디자인 패턴': {
    title: '디자인 패턴 기초: 싱글톤(Singleton) 패턴의 개념과 실무 활용',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    content: `
# 싱글톤(Singleton) 패턴: 전역에서 단 하나의 객체 인스턴스 보장

어플리케이션을 구동할 때 데이터베이스 커넥션 풀, 로그 기록기(Logger), 설정 로더 등은 시스템 전역에서 단 하나만 생성되어 공유되는 것이 리소스 보존 측면에서 유리합니다. 이를 보장하는 설계 기법이 바로 **싱글톤 패턴**입니다.

## 1. 싱글톤 패턴 구현 메커니즘
1. 외부에서 클래스 인스턴스를 무분별하게 생성하지 못하도록 **생성자(Constructor)를 private**으로 선언합니다.
2. 클래스 내부에서 유일한 고유 인스턴스를 static 변수로 가집니다.
3. 이 인스턴스를 반환받을 수 있는 static 메서드(e.g., \`getInstance()\`)를 글로벌하게 공개합니다.

\`\`\`typescript
class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private constructor() {} // private 생성자

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}
\`\`\`

싱글톤 패턴은 메모리 공간을 극도로 절약하고 일관성 있는 객체 상태를 유지하는 데 매우 효과적인 기법입니다.
`
  },
  'WEB 지식': {
    title: '브라우저 동작 원리: 주소창에 google.com을 입력하면 일어나는 일',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    content: `
# 웹 브라우저의 내부 작동 원리와 네트워크 렌더링

매일 접하는 주소창 입력 뒤에는 컴퓨터 네트워크와 브라우저 렌더링 엔진의 정교한 연쇄 반응이 숨어있습니다. 전체 프로세스를 5단계로 정리합니다.

## 1. DNS Lookup (도메인 주소 변환)
사용자가 \`google.com\`을 입력하면 브라우저는 우선 도메인 이름을 숫자로 된 물리적인 IP 주소로 변환하기 위해 로컬 캐시, 라우터, 그리고 DNS 서버를 순차적으로 조회합니다.

## 2. TCP 3-Way Handshake & SSL 협상
IP 주소를 획득하면 대상 서버의 80(HTTP) 혹은 443(HTTPS) 포트를 통해 신뢰성 있는 연결을 만들기 위해 TCP 악수를 나누고, 데이터를 암호화하기 위해 SSL/TLS 인증 교환을 수행합니다.

## 3. HTTP Request & Response
연결 완료 후 브라우저는 서버로 \`GET / HTTP/1.1\` 요청 패킷을 발송하고, 서버는 HTML문서와 리소스를 200 OK 상태 코드와 함께 응답합니다.

## 4. CRP (Critical Rendering Path) 렌더링
브라우저 엔진은 다운로드한 HTML을 해석하여 **DOM 트리**를 만들고, CSS를 해석하여 **CSSOM 트리**를 구축합니다. 이 둘을 합쳐 **Render 트리**를 형성한 후 화면에 요소의 크기와 위치를 정하는 **Layout**과 실제 픽셀을 채우는 **Paint** 작업을 거쳐 화면에 출력합니다!
`
  },
  'HTTP 지식': {
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3 차이점 한눈에 정리하기',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    content: `
# 하이퍼텍스트 전송 프로토콜(HTTP)의 진화 과정과 성능 혁신

웹 브라우저와 웹 서버 간 데이터를 교환하는 HTTP 프로토콜은 속도와 전송 효율성을 극대화하기 위해 꾸준히 발전해왔습니다.

## 1. HTTP/1.1
- **특징**: 커넥션 하나당 한 번에 하나의 요청만 순차적으로 처리할 수 있어, 이미지나 스크립트가 많아지면 이전 요청이 끝날 때까지 대기하는 **HOLB (Head of Line Blocking)** 병목이 있었습니다.

## 2. HTTP/2 (2015년)
- **특징**: **Multiplexing** 기술을 도입하여 하나의 TCP 연결 속에서 수많은 요청과 응답을 순서에 상관없이 동시 다발적으로 전송할 수 있게 되어 속도가 수배 빨라졌습니다. 헤더 압축(HPACK)과 서버 푸시 기능도 지원합니다.

## 3. HTTP/3 (최신)
- **특징**: TCP가 가지는 태생적인 연결 지연과 패킷 유실 시 전체 대기 현상을 해결하기 위해, UDP 기반의 **QUIC 프로토콜**을 도입하여 연결 수립 시간을 최소화하고 모바일 네트워크 전환 시 끊김 없는 통신을 보장합니다.
`
  },
  'Network 지식': {
    title: 'TCP/IP 4계층 모델과 3-Way Handshake 동작 방식',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    content: `
# 네트워크 신뢰 통신: TCP/IP 계층 구조와 3-Way Handshake

인터넷 통신의 뼈대를 형성하는 TCP/IP 프로토콜 스택과, 두 단말 간 데이터를 신뢰성 있게 안전하게 송수신하기 위한 사전 연결 프로세스를 알아봅니다.

## 1. TCP/IP 4계층 모델

1. **어플리케이션 계층 (HTTP, DNS, FTP)**: 사용자 인터페이스 및 데이터 생성
2. **전송 계층 (TCP, UDP)**: 포트 번호를 바탕으로 단말 간 신뢰성 있는 연결 흐름 제어
3. **인터넷 계층 (IP)**: 패킷의 최적 경로를 설정하는 라우팅 수행
4. **네트워크 인터페이스 계층 (Ethernet)**: 물리적인 프레임 전송

---

## 2. TCP 3-Way Handshake 구조

데이터 전송 전 연결을 설정하기 위해 다음 3단계 악수 과정을 거칩니다:
1. **[Client] ── SYN (연결 요청) ──> [Server]**
2. **[Server] ── SYN-ACK (수락 및 역연결 요청) ──> [Client]**
3. **[Client] ── ACK (최종 확인) ──> [Server]**

이 과정을 마쳐야만 두 단말의 세션이 활성화(ESTABLISHED)되어 실제 데이터를 주거니 받거니 할 수 있는 파이프라인이 열립니다.
`
  },
  'CS 지식': {
    title: '🤔 스레드를 많이 쓸수록 항상 성능이 좋아질까?',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    content: `
# 멀티 스레딩과 컨텍스트 스위칭의 오버헤드 이해

흔히 CPU 성능을 최대로 뽑아내기 위해 스레드(Thread) 개수를 무작정 늘려 실행하곤 합니다. 하지만 스레드가 과도하게 많아지면 오히려 성능이 심각하게 곤두박질치는 임계점이 존재합니다.

## 1. 컨텍스트 스위칭(Context Switching)의 오버헤드
코어 개수는 한정되어 있는데 스레드가 수천 개 실행되면, CPU는 하나의 스레드 작업을 멈추고 다음 스레드로 전환하기 위해 현재 CPU 레지스터 상태를 백업하고 새로운 스레드 정보를 불러오는 **컨텍스트 스위칭** 작업을 초당 수만 번 반복하게 됩니다. 이 전환 연산 자체가 CPU 파워를 다 잡아먹어 버립니다.

## 2. 작업 특성별 적정 스레드 개수 공식
- **CPU Bound (연산 작업)**: 코어 개수와 동일하게 설정 ($N$ 또는 $N+1$)
- **I/O Bound (대기 작업)**: 데이터베이스 쿼리나 네트워크 대기 시간이 기므로 코어의 수배 이상 설정 ($2N$ ~ $4N$)
`
  },
  'IT 용어 지식': {
    title: '개발자 상식: 레거시(Legacy), 리팩토링(Refactoring), 기술 부채(Technical Debt)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: `
# 지속 가능한 소프트웨어 개발을 위한 핵심 개념 3가지

프로젝트가 커질수록 기획 요구사항은 수시로 변하고 코드는 썩어가기 마련입니다. 건강한 소프트웨어 생태계를 유지하기 위해 모든 개발자가 숙지해야 하는 대화 용어들을 알아봅니다.

## 1. 레거시 코드 (Legacy Code)
- **정의**: 기존에 구축되어 상용화되어 돌아가고 있지만, 작성된 지 오래되어 분석하기 어렵거나 자동화된 테스트 코드가 결여된 코드를 통칭합니다.

## 2. 기술 부채 (Technical Debt)
- **정의**: 빠른 기능 배포를 위해 임시방편(Hard Coding 등)으로 짠 엉성한 코드 아키텍처가 훗날 유지보수 비용과 버그 수정 시간을 기하급수적으로 늘려 대가를 지불하게 만드는 금융 부채와 유사한 개념입니다.

## 3. 리팩토링 (Refactoring)
- **정의**: 소프트웨어의 외부 기능적 동작(Input/Output)은 전혀 바꾸지 않은 채, 내부적인 코드 구조(가독성, 중복 제거, 패턴 적용)만을 깔끔하게 개선하여 기술 부채를 점진적으로 상환하는 정화 작업입니다.
`
  },
  'C': {
    title: 'C언어 기초: 포인터(Pointer)와 메모리 주소 개념 정복하기',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    content: `
# C언어 포인터: 하드웨어 메모리를 조종하는 정밀한 키보드

컴퓨터 아키텍처와 저수준 시스템 프로그래밍의 정수라 불리는 C언어의 꽃, **포인터(Pointer)**의 주소 연산 방식을 완벽하게 도해 설명합니다.

## 1. 변수와 메모리 주소
우리가 코드에서 \`int a = 10;\`을 선언하면 실제 물리 램(RAM) 메모리의 특정 번지 공간에 4바이트 크기로 숫자 10이 저장됩니다.

## 2. 포인터 변수 선언과 참조
포인터는 일반 데이터 값이 아닌 **다른 변수의 메모리 주소 자체**를 값으로 갖는 특별한 변수입니다.

\`\`\`c
#include <stdio.h>

int main() {
    int value = 42;
    int *ptr = &value; // value의 주소값을 ptr에 보관

    printf("value의 실제 데이터: %d\n", value);
    printf("value의 메모리 주소: %p\n", &value);
    printf("ptr이 가리키는 메모리 주소의 데이터: %d\n", *ptr); // 역참조
    return 0;
}
\`\`\`

포인터를 깊이 이해하면 하드웨어를 직접 제어하는 운영체제(OS) 소스 코드와 임베디드 코딩의 장막이 완전히 걷히게 됩니다.
`
  },
  'Java': {
    title: 'Java의 핵심: 객체 지향 프로그래밍(OOP) 4대 특징 완벽 가이드',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    content: `
# Java와 객체 지향 프로그래밍(OOP)의 위대한 사상

전 세계 수많은 대규모 엔터프라이즈 시스템의 중심에 있는 자바 언어는 객체 지향 프로그래밍 철학을 가장 철저히 따릅니다. OOP의 핵심 4대 특징을 정리합니다.

## 1. 캡슐화 (Encapsulation)
- **정의**: 데이터(속성)와 행위(메서드)를 하나의 클래스로 묶고, 민감한 내부 구현은 숨긴 채 외부에 꼭 필요한 최소한의 인터페이스만 노출(\`private\`, \`getter/setter\`)하여 객체의 무결성을 유지합니다.

## 2. 상속 (Inheritance)
- **정의**: 부모 클래스의 재산(필드, 메서드)을 자식 클래스가 그대로 물려받아 재사용함으로써 코드 중복을 대폭 방지합니다.

## 3. 다형성 (Polymorphism)
- **정의**: 하나의 객체가 여러 가지 타입의 형태를 가질 수 있는 성질입니다. 부모 클래스 타입의 레퍼런스로 자식 객체를 다룰 수 있어 인터페이스 일관성이 향상됩니다.

## 4. 추상화 (Abstraction)
- **정의**: 실체들의 공통적인 특징을 추출하여 부모 클래스나 인터페이스로 규격화하는 작업입니다. 불필요한 세부 디테일을 제거하고 핵심 비즈니스 로직에 집중하게 해줍니다.
`
  },
  'Spring': {
    title: 'Spring Boot 시작하기: MVC 아키텍처와 의존성 주입(DI)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    content: `
# 스프링 부트(Spring Boot) 백엔드 생태계 입문하기

기존 스프링의 끔찍하게 복잡한 XML 설정 지옥을 완전히 제거하고, WAS(Tomcat) 내장 및 라이브러리 자동 구성으로 업계 표준이 된 **Spring Boot**의 핵심 작동 원리를 알아봅니다.

## 1. IOC와 의존성 주입 (DI)
객체의 생명주기 관리 권한을 개발자가 아닌 스프링 컨테이너가 대신 수행하는 제어의 역전(IoC) 하에서, 필요한 부품 객체를 외부에서 찔러 넣어 조립해 주는 기법이 바로 **의존성 주입 (Dependency Injection)**입니다. 이를 통해 모듈 간 결합도가 극도로 완화되어 단위 테스트 작성이 매우 용이해집니다.

## 2. Spring MVC 패턴
- **Model**: 데이터와 비즈니스 서비스 상태 관리
- **View**: 클라이언트에 노출될 화면 구성 (타임리프 혹은 React 등의 JSON 스키마)
- **Controller**: 라우팅 요청을 최초로 수신하여 비즈니스 로직을 연결하고 모델 데이터를 반환
`
  },
  'Bootstrap': {
    title: 'Bootstrap 5 핵심 사용법: 반응형 Grid 시스템 완벽 정복',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop',
    content: `
# 부트스트랩 Grid: 코딩 한 줄 없이 만드는 프로급 반응형 웹

**Bootstrap**은 미리 세팅된 풍부한 CSS 클래스명을 적기만 하면 트렌디한 디자인의 UI 요소를 뚝딱 만들어 낼 수 있는 가장 대표적인 오픈소스 CSS 프레임워크입니다.

## 1. 12열 Grid 시스템 이해
부트스트랩 반응형 레이아웃의 근간은 한 행을 총 **12개의 가상의 칸**으로 조각내어 분할 배치하는 \`Grid System\`에 있습니다.

\`\`\`html
<div className="container">
  <div className="row">
    <!-- 모바일에서는 전체 폭, PC 화면(md 브레이크포인트 이상)에서는 반씩 나누어 가짐 -->
    <div className="col-12 col-md-6 bg-primary">왼쪽 메뉴</div>
    <div className="col-12 col-md-6 bg-success">오른쪽 본문</div>
  </div>
</div>
\`\`\`

직접 \`media query\`를 작성하며 고생할 필요 없이 최적화된 반응형 크기를 보장해 주어 프로토타이핑 속도를 극적으로 단축시킵니다.
`
  },
  'Linux': {
    title: '리눅스(Linux) 필수 터미널 명령어 및 권한(chmod/chown) 이해',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=800&auto=format&fit=crop',
    content: `
# 리눅스 터미널 정복: 서버 인프라 관리의 핵심 명령어

모든 클라우드 가상 서버(AWS EC2, Docker Container)의 근간은 리눅스 OS입니다. GUI 마우스 없이 서버를 완벽하게 리딩하는 필수 리눅스 명령어 셋을 알아봅니다.

## 1. 리눅스 핵심 권한 체계 (chmod)
리눅스의 모든 파일과 디렉토리는 소유자(User), 그룹(Group), 기타(Others)에 대한 읽기(r=4), 쓰기(w=2), 실행(x=1) 권한을 가집니다.

- **\`chmod 755 script.sh\`**
  - **7** (4+2+1): 소유자에게 모든 권한(rwx) 부여
  - **5** (4+1): 그룹에게 읽기/실행 권한(r-x) 부여
  - **5** (4+1): 외부인에게 읽기/실행 권한(r-x) 부여

## 2. 필수 인프라 명령어
- \`df -h\`: 남은 하드디스크 용량 확인
- \`free -m\`: 실시간 남은 램(RAM) 크기 확인
- \`ps -ef | grep node\`: 현재 구동 중인 프로세스 실시간 추적 및 탐지
`
  },
  'Apache': {
    title: 'Apache 웹 서버 설치 및 VirtualHost 다중 도메인 연동 가이드',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    content: `
# Apache HTTP Server 구축과 리버스 프록시 연동 실습

전 세계 수많은 웹 서비스를 구동해온 오픈소스 웹 서버의 대명사 **Apache**의 개념과 설치법, 그리고 도메인 분기 처리 방식을 소개합니다.

## 1. VirtualHost (가상 호스트)
하나의 서버 인프라 안에서 도메인이 다른 여러 사이트(e.g., \`siteA.com\`, \`siteB.com\`)를 각각 다른 폴더 리소스로 매핑하여 띄우는 가상화 호스팅 방식입니다.

\`\`\`apache
<VirtualHost *:80>
    ServerName siteA.com
    DocumentRoot "/var/www/siteA"
    ErrorLog "logs/siteA-error.log"
</VirtualHost>
\`\`\`

## 2. Reverse Proxy 연동
백엔드 포트(e.g. Node.js의 3000포트)를 숨긴 채, 아파치 서버의 80포트로 접속한 요청을 안전하게 뒷단 서버로 프록시 중계 및 로드밸런싱해 주는 필수 구조입니다.
`
  },
  'Tomcat': {
    title: 'WAS와 Web Server의 차이: Apache Tomcat 컨테이너 개념',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    content: `
# 정적 웹서버와 동적 WAS 컨테이너의 근본적인 인프라 차이점

자바 엔터프라이즈 환경에서 항상 등장하는 **Web Server**와 **WAS(Web Application Server)**의 차이점을 정밀 분해 분석합니다.

## 1. Web Server (정적 자원 처리)
- **대표군**: Nginx, Apache
- **동작**: 클라이언트가 요청하는 이미 작성된 파일(HTML, CSS, 이미지)을 그대로 하드디스크에서 읽어 반환합니다. 가볍고 빠릅니다.

## 2. WAS (동적 비즈니스 처리)
- **대표군**: Tomcat, WildFly, WebLogic
- **동작**: 사용자가 로그인하거나 상품을 구매할 때, 데이터베이스에 접근하고 비즈니스 로직 연산을 직접 자바 가상머신(JVM) 소스 안에서 돌려 실시간으로 결과를 만들어서 조립해 응답합니다.

보통 실무에서는 아파치(Web Server)를 전방에 배치하여 정적 요청을 빠르게 걸러내고, 자바 연산이 필요한 무거운 요청만 뒤에 있는 톰캣(WAS)으로 넘겨주는 연동 구조를 채택합니다.
`
  },
  'Jetty': {
    title: '초경량 임베디드 서블릿 컨테이너 Jetty의 특징과 활용',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    content: `
# Tomcat 대신 Jetty를 활용하는 마이크로서비스 인프라 설계

자바 서블릿 웹 서버 하면 주로 톰캣을 생각하지만, 모바일 통신 장비나 클라우드 기반 초경량 분산 서버리스 환경에서는 **Jetty**가 엄청난 강점을 보입니다.

## 1. Jetty의 뛰어난 강점
- **극단적인 경량성**: 설치 용량이 작고 기동(Cold Start) 시 메모리 사용량이 매우 적어 마이크로서비스 아키텍처(MSA) 및 Docker 컨테이너 확장에 이상적입니다.
- **임베디드성**: 내 어플리케이션 소스 코드 자체에 Jetty 서버 객체를 선언하여 하나의 자바 \`main()\` 구동 파일로 실행하기 쉽습니다.

구글 App Engine 등 대규모 고성능 서비스 인프라에서 수년간 애용해온 신뢰성 높은 서블릿 프레임워크입니다.
`
  },
  'Jenkins': {
    title: 'Jenkins를 활용한 CI/CD 자동화 빌드 및 배포 파이프라인 구축',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=800&auto=format&fit=crop',
    content: `
# 젠킨스(Jenkins): 지속적 통합과 배포(CI/CD)의 전통적 강자

수작업으로 서버에 접속해 \`git pull\`을 땡기고, \`npm run build\`를 치던 고단한 수동 릴리즈 시대를 끝내고, 젠킨스를 통해 자동화된 빌드/배포 환경을 설계해 봅니다.

## 1. Jenkins Pipeline과 Jenkinsfile
선언형 문법을 사용하여 빌드 전 단계를 코드 형태로 관리할 수 있습니다.

\`\`\`groovy
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { git 'https://github.com/my-repo.git' }
        }
        stage('Build') {
            steps { sh 'npm run build' }
        }
        stage('Deploy') {
            steps { sh 'scp -r ./dist user@server:/var/www' }
        }
    }
}
\`\`\`

오픈소스인 만큼 풍부한 플러그인을 활용하여 사내 프라이빗 클라우드 인프라와 완벽하게 유기적인 파이프라인 구축이 가능합니다.
`
  },
  'MySQL': {
    title: 'MySQL 기초: 인덱스(Index)의 작동 원리와 쿼리 성능 최적화',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    content: `
# MySQL 인덱스: 1억 건의 데이터 속에서 원하는 줄 단 0.01초 만에 찾기

관계형 데이터베이스(RDBMS)의 쿼리 성능 최적화 핵심은 바로 **인덱스(Index)**입니다. 인덱스의 내부 자료구조인 **B+Tree** 아키텍처와 활용 꿀팁을 공개합니다.

## 1. B+Tree 인덱스 구조
일반적인 풀스캔은 100페이지짜리 책을 처음부터 끝까지 정독하며 단어를 찾는 행위라면, 인덱스는 맨 뒷장의 **색인 단어 색인표**를 보고 바로 몇 쪽으로 가라고 순간 이동하는 것과 같습니다. 노드가 자식들을 촘촘하게 균형을 맞춰 정렬하여 보관하므로 대량 데이터에서도 고속 조회를 보장합니다.

## 2. 주의사항
- 인덱스는 마법이 아닙니다. 과도한 인덱스 추가는 \`INSERT\`, \`UPDATE\`, \`DELETE\` 연산 시마다 정렬 인덱스 테이블을 재배치해야 하므로 쓰기 연산 속도를 대폭 하락시킵니다. 꼭 빈번히 검색 필터링으로 쓰이는 컬럼 위주로 전략적 생성해야 합니다.
`
  },
  'MongoDB': {
    title: 'NoSQL의 대표 주자 MongoDB 핵심 개념 및 Document 데이터 다루기',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    content: `
# MongoDB: 복잡한 RDBMS 조인 대신 유연한 BSON 도큐먼트로 개발하기

어플리케이션 설계 시 데이터 스키마가 수시로 바뀌고 비정형 소셜 데이터를 초고속으로 저장하고 싶다면, 정통 테이블 대신 **MongoDB**와 같은 NoSQL 도큐먼트 디비가 탁월한 대안입니다.

## 1. Document 기반 유연성
기존 RDBMS는 컬럼을 새로 추가하려면 테이블의 모든 행을 수정해야 하지만, 몽고디비는 행마다 다른 형태의 JSON과 닮은 **BSON 객체** 데이터를 다채롭게 꽂아 넣을 수 있어 변화무쌍한 모던 서비스 기획 대응에 강점을 가집니다.

- **JSON 규격 매핑**: 백엔드 객체 데이터를 번거로운 맵 매핑 처리(ORM) 없이 프론트 엔드까지 스트레이트로 쏴줄 수 있어 개발 생산성이 2배 상승합니다.
`
  },
  'HTML': {
    title: 'HTML5 시맨틱 태그(Semantic Tags)의 중요성과 웹 표준 검색 최적화(SEO)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    content: `
# 시맨틱 마크업: 브라우저와 검색 봇에게 의미 있는 HTML 설계

무조건 \`<div>\`로 떡칠한 사이트는 화면상으로는 예쁘게 보일지 몰라도, 검색엔진 봇이나 시각장애용 리더기 입장에서는 무의미한 텍스트 덩어리에 불과합니다. 의미 있는 **시맨틱 태그**의 올바른 쓰임새를 학습합니다.

## 1. 대표 시맨틱 엘리먼트
- **\`<header>\`**: 사이트나 섹션의 헤더 로고 영역
- **\`<nav>\`**: 대메뉴 네비게이션 링크 그룹
- **\`<main>\`**: 페이지 내 유일한 핵심 본문 구획
- **\`<article>\`**: 그 자체로 독립적인 뉴스피드, 블로그 카드 콘텐츠
- **\`<section>\`**: 연관된 콘텐츠 주제들의 묶음 단위

시맨틱 마크업은 구글이나 네이버 검색엔진이 내 블로그 카드를 수집해 1페이지 상단에 띄워 주게 만드는 **SEO(검색엔진 최적화)** 마케팅의 절대적인 기초 기반입니다.
`
  },
  'CSV': {
    title: 'CSV 파일 형식 이해와 Python/Node.js에서 대량 데이터 파싱하기',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    content: `
# CSV (Comma-Separated Values): 데이터를 보관하는 가장 단순한 양식

다양한 시스템 간에 엑셀 데이터를 고속으로 내보내고(Export) 들여오기(Import) 할 때 사용하는 보편적 텍스트 포맷 **CSV**의 구조를 분석합니다.

## 1. CSV의 내부 모습
쉼표(\`,\`)를 구분자(Delimiter)로 사용하여 엑셀 격자 셀 데이터를 텍스트로 보존합니다:
\`\`\`csv
이름,나이,직무,이메일
Bong,26,Backend,bong@dev.com
Inpa,28,Frontend,inpa@dev.com
\`\`\`

## 2. 개발 활용법
파이썬이나 Node.js에서는 \`csv-parser\` 라이브러리나 내장 패키지를 통해 파일 전체를 메모리에 올리지 않고 스트림(Stream) 방식으로 한 줄씩 흘려 가며 파싱하여, 기가바이트(GB)급 초거대 파일도 단 1MB 수준의 적은 메모리만 사용하여 고속 가공해 낼 수 있습니다.
`
  },
  'XML': {
    title: 'XML 파일 형식의 기초와 JSON과의 차이점 비교 분석',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    content: `
# XML (Extensible Markup Language): 정교한 태그 기반 데이터 표기법

과거 공공기관 데이터 연동 API와 스프링 프레임워크 설정 정보로 전 세계를 지배해왔던 **XML**과 현대의 **JSON**을 정밀 비교해 봅니다.

## 1. XML 구조의 특징
HTML처럼 사용자가 직접 정의한 열고 닫는 태그(\`<user></user>\`)로 데이터 구조와 속성을 정의합니다. 데이터뿐만 아니라 스키마의 메타 정보도 정교하게 표현할 수 있어 안정적인 데이터 검증이 가능합니다.

## 2. JSON과 결정적 차이
- **XML**: 장황하고 닫는 태그가 필수이므로 문서 파일 크기가 커서 대역폭 소모가 큽니다.
- **JSON**: 가볍고 데이터와 매칭되는 대괄호/중괄호로만 단순하게 묶어 두어 파싱 속도가 현저히 빨라, 현대 모던 웹에서는 JSON이 대세로 완전히 자리잡았습니다.
`
  },
  'JSON': {
    title: 'JSON (JavaScript Object Notation) 데이터 포맷 완벽 가이드',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    content: `
# JSON: 현대 인터넷 웹 API의 공용 세계 만국 공통어

웹 개발자라면 누구나 매일 수백 번씩 호출하는 **JSON** 데이터 양식의 문법 규격과 파이썬/자바스크립트 내장 변환 라이브러리 활용법을 정리합니다.

## 1. JSON의 핵심 6대 타입
JSON은 오직 텍스트 파일 형식으로 구성되며 다음 타입만을 표준 지원합니다:
1. **String** (항상 쌍따옴표 \`""\` 필수)
2. **Number** (정수 및 실수)
3. **Object** (키-값 구조 \`{}\`)
4. **Array** (배열 \`[]\`)
5. **Boolean** (\`true\` / \`false\`)
6. **Null** (빈 데이터)

\`\`\`json
{
  "name": "Bong Dev",
  "skills": ["TypeScript", "Next.js", "AWS"],
  "isActive": true
}
\`\`\`

## 2. 자바스크립트 직렬화/역직렬화
- **\`JSON.stringify()\`**: 객체를 네트워크 전송용 문자열로 직렬화 변환
- **\`JSON.parse()\`**: 전송받은 문자열을 다시 사용가능한 자바스크립트 오브젝트로 변환
`
  },
  'YAML': {
    title: 'YAML 문법 완벽 마스터: 쿠버네티스 & Docker Compose 설정법',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
    content: `
# YAML (YAML Ain't Markup Language): 개발자 친화적 가독성 최고 설정 언어

인프라 자동화 도구(Ansible), 도커 컴포즈, 쿠버네티스 리소스 매니페스트 설정의 절대적 표준이 된 **YAML**의 핵심 문법 규칙을 소개합니다.

## 1. 가독성을 높이는 들여쓰기 규칙
YAML은 중괄호(\`{}\`)나 괄호 대신 오직 **들여쓰기 공백 (띄어쓰기 2칸 권장)**으로 계층과 부모-자식 관계를 규격 정의합니다.

\`\`\`yaml
version: '3.8'
services:
  web-blog:
    image: next-app:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=neon-db
\`\`\`

- **주의**: 들여쓰기 탭(Tab) 문자를 사용하면 컴파일 파싱 에러가 발생하므로 반드시 스페이스바(Space) 공백을 유지해야 합니다!
`
  },
  'SW 테스팅 이론': {
    title: '소프트웨어 테스팅 기본 개념: 화이트박스 vs 블랙박스 테스트',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: `
# 품질 보증(QA)의 기초: 구조 테스트와 기능 테스트 구분하기

작성한 프로그램이 실제 배포된 후 예기치 못한 비즈니스 크리티컬한 버그를 방지하기 위해 수행하는 소프트웨어 테스팅의 대원칙 두 분류를 분석합니다.

## 1. 화이트박스 테스트 (White-box Testing)
- **특징**: 내부 소스 코드의 제어 흐름, 구조(if문 분기, 루프 경로)를 상세하게 훤히 들여다보며 테스트 시나리오를 작성하는 방법입니다. 주로 개발자가 유닛 테스트(Jest, JUnit)를 작성할 때 여기에 속합니다.

## 2. 블랙박스 테스트 (Black-box Testing)
- **특징**: 내부 소스 코드는 전혀 모른 채, 오직 사용자처럼 기능 스펙 문서를 바탕으로 특정 인풋을 넣었을 때 올바른 아웃풋(기대 결과값)이 튀어나오는지 겉만 테스트하는 기법입니다. 수동 QA나 UI 동작 테스트가 이에 해당합니다.
`
  },
  'PICT': {
    title: 'Microsoft PICT를 활용한 페어와이즈(Pairwise) 조합 테스트 설계',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: `
# 페어와이즈 설계: 모든 경우의 수 조합 테스트 100배 효율적으로 줄이기

예를 들어 OS(3개), 브라우저(4개), 결제수단(5개)의 전체 조합을 테스트하려면 60번 ($3 \\times 4 \\times 5$)의 기하급수적인 테스트를 해야 합니다. 이를 획기적으로 줄여주는 수학적 설계 기법인 **Pairwise**와 마이크로소프트의 오픈소스 도구 **PICT** 사용법을 소개합니다.

## 1. Pairwise 이론
대부분의 치명적인 소프트웨어 결함은 하나의 입력값 에러 혹은 **단 두 개 변수 간의 충돌 관계**에서 발생한다는 연구 결과를 토대로, 60개 조합 대신 "모든 변수 쌍(Pair)이 최소한 한 번씩은 동시에 조합에 포함되도록" 수학적으로 재배치하여 단 12번의 테스트만으로 99% 버그를 발견해 낼 수 있는 설계 방식입니다.

## 2. PICT 도구 사용
간단한 텍스트 파일에 변수 후보를 입력하고 PICT CLI를 구동하는 것만으로 최적의 최소 테스트 집합 테이블이 자동 산출되어 QA 효율이 500% 상승합니다.
`
  },
  'Selenium': {
    title: 'Selenium WebDriver를 이용한 크로스 브라우저 웹 UI 자동화 테스트',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: `
# 셀레니움: 실제 웹 브라우저를 내 코드 손가락으로 자동 조종하기

전 세계 웹 UI 자동화 테스트의 터줏대감이자 가장 범용성 높은 도구 **Selenium**의 설정 방식과 스크립트 작성법을 소개합니다.

## 1. Selenium WebDriver 작동 구조
자바스크립트나 파이썬 코드로 작성한 테스트 스크립트의 명령을 브라우저 전용 드라이버(GeckoDriver, ChromeDriver)로 전송하면, 브라우저가 명령을 수신하여 실제 마우스 클릭, 글자 타이핑, 페이지 전환 동작을 실시간으로 수행합니다.

- **장점**: 크롬, 파이어폭스, 사파리, 엣지 등 거의 모든 웹 브라우저를 실기기로 정밀 테스트할 수 있어 크로스 브라우징 정합성 테스트에 안성맞춤입니다.
`
  },
  'Postman': {
    title: 'Postman 활용 극대화: API 테스트 자동화 및 환경 변수 설정',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: `
# 포스트맨 200% 정복: 단순 API 쏘기 툴에서 자동 테스트 프레임워크로

백엔드 서버 개발 중 API 응답을 테스트하기 위해 단순히 URL을 입력하고 쏘는 용도로만 Postman을 쓰고 계셨다면 반성하셔야 합니다. 테스트 탭의 **테스트 스크립트 기능**을 적극 활용해 봅시다.

## 1. Tests 자동 검증 기능
API 호출 성공 후 상태 코드가 200인지, 특정 JSON 필드가 누락되지 않고 잘 내려왔는지 테스트 자바스크립트 단정문을 내장해둘 수 있습니다.

\`\`\`javascript
pm.test("응답 성공 코드 200 확인", function () {
    pm.response.to.have.status(200);
});

pm.test("응답 데이터에 ID 필드 포함 확인", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.not.be.undefined;
});
\`\`\`

Collection Runner를 이용하면 수십 개의 순차적인 API 테스트를 단 한 번에 돌려 볼 수 있어 회귀 테스트 자동화에 최적입니다.
`
  },
  'JEST': {
    title: 'Jest를 이용한 React 유닛 테스트 및 Mocking 기법 실습',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: `
# 제스트(Jest): Zero Config 자바스크립트 테스트 러너의 표준

React 어플리케이션을 비롯한 자바스크립트 생태계에서 가장 편리하고 강력한 단위 테스트 프레임워크 **Jest**의 활용 전략을 정리합니다.

## 1. Mocking (모킹)의 필요성
데이터베이스나 외부 유료 결제 API 서버에 실제로 데이터를 쏘지 않고, 마치 쏜 것처럼 흉내 내어 리턴값을 미리 설정해 두고 컴포넌트나 비즈니스 알고리즘 자체만 순수하게 격리 테스트(Unit Test)하기 위해 **Mocking** 기법을 필수로 활용합니다.

\`\`\`javascript
// 간단한 모킹 함수 예시
const mockCallback = jest.fn(x => 42 + x);
test('mocking function test', () => {
  expect(mockCallback(0)).toBe(42);
  expect(mockCallback).toHaveBeenCalledTimes(1);
});
\`\`\`

빠르고 안정적인 코드 배포 프로세스를 만들기 위해 배포 파이프라인(CI)에서 모든 Jest 테스트 스크립트가 자동 수행되도록 통제합니다.
`
  },
  'Artillery': {
    title: 'Artillery를 활용한 초간편 웹 서비스 부하(Load) 및 성능 테스트',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: `
# 부하 테스트: 내 블로그에 갑자기 만 명의 사용자가 들어오면 버틸 수 있을까?

대규모 이벤트나 서비스 정식 오픈 전에 백엔드 아키텍처가 버틸 수 있는 한계점(Throughput, RPS)과 가용성을 검증하는 **Artillery** 부하 테스트 도구를 학습합니다.

## 1. 왜 Artillery인가?
복잡한 설치 과정 없이 초경량 Node.js 패키지 형태로 가볍고 편리하며, 테스트 시나리오를 가시적인 **YAML 설정 파일** 하나로 깔끔하게 기술하여 가상의 클라이언트 트래픽을 마음껏 폭격 쏴볼 수 있습니다.

\`\`\`yaml
config:
  target: 'https://my-blog-app.com'
  phases:
    - duration: 60
      arrivalRate: 50 # 60초 동안 매초 50명씩 접속 유도
\`\`\`

이를 통해 WAS의 커넥션 풀 크기나 DB 인덱스 병목 지점을 미리 발견해 튜닝할 수 있어 사후 장애를 완전히 차단해 냅니다.
`
  },
  'Pywinauto': {
    title: 'Pywinauto를 사용한 Windows 데스크톱 GUI 프로그램 자동화 제어',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    content: `
# 파이썬 RPA: 윈도우 메모장, 그림판 등 데스크톱 앱을 내 마음대로 자동화하기

웹 자동화에는 셀레니움이 있듯, 윈도우 OS 위에서 마우스로 더블 클릭하고 창을 옮기는 일반 설치형 데스크톱 프로그램 자동화에는 파이썬 **pywinauto** 라이브러리가 명답입니다.

## 1. 윈도우 OS 핸들러 객체 포착
컴퓨터 내부의 윈도우 창 핸들러(HWND)와 컨트롤 아이디를 추출하여 클릭, 텍스트 입력 등의 이벤트를 OS 하드웨어 신호 수준으로 쏴 줍니다.

\`\`\`python
from pywinauto.application import Application

# 메모장 프로그램 실행 및 텍스트 자동 타이핑
app = Application(backend="win32").start("notepad.exe")
app.Notepad.menu_select("도움말 -> 메모장 정보")
app.Notepad.Edit.type_keys("Hello World from pywinauto!", with_spaces=True)
\`\`\`

단순 반복적인 윈도우 행정 전산 작업이나 레거시 사내 데스크톱 프로그램 품질 QA 업무 시 막강한 비즈니스 자동화 혁신(RPA)을 이루어 냅니다.
`
  },
  'IntelliJ': {
    title: 'IntelliJ IDEA 200% 활용법: 필수 플러그인과 유용한 단축키 모음',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    content: `
# 인텔리제이 정복: Java/Spring 개발자의 필수 최강 에디터 생산성 가이드

최상급 자바 통합 개발 환경(IDE)인 **IntelliJ IDEA**를 사용하여 개발 타이핑 속도를 200% 이상 끌어올리는 알짜배기 사용법을 공개합니다.

## 1. 필수 초강력 플러그인
- **Key Promoter X**: 내가 마우스로 클릭하는 기능에 매칭되는 단축키를 우측 하단에 말풍선 팝업으로 강제 노출해 주어, 자연스럽게 키보드로만 조작하도록 유도해 줍니다.
- **GitToolBox**: 코드 라인 끝에 실시간으로 작성자 이름, 작성 시기, 해당 커밋 메시지를 흐리게 투영(Blame)해 주어 협업 시 신속한 소스 파악이 가능합니다.

## 2. 절대 암기 필수 단축키 (Windows 기준)
- **\`Double Shift\` (Shift 두 번)**: 클래스, 파일, 기호, 심볼 등 프로젝트 내 모든 것을 초고속 검색
- **\`Ctrl + Alt + L\`**: 꼬여버린 들여쓰기와 가독성 나쁜 소스 정합성 포맷팅 자동 정렬
`
  }
};

// Subcategory-to-Unsplash mapping for dynamic thumbnail healing
const categoryThumbnailMap: Record<string, string> = {
  '자료구조': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop',
  '알고리즘': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop',
  '디자인 패턴': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
  'WEB 지식': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'HTTP 지식': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'Network 지식': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
  'CS 지식': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
  'IT 용어 지식': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'C': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  'Java': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  'JavaScript': 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=800&auto=format&fit=crop',
  'TypeScript': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  'Python': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=800&auto=format&fit=crop',
  'React': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
  'Node.js': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
  'Nest.js': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  'Next.js': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
  'Spring': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  'CSS': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop',
  'Sass': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop',
  'Bootstrap': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop',
  'Window': 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=800&auto=format&fit=crop',
  'Linux': 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=800&auto=format&fit=crop',
  'Apache': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'Tomcat': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'Jetty': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'Docker': 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=800&auto=format&fit=crop',
  'AWS': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'MLOps': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
  'GIT': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=800&auto=format&fit=crop',
  'Github': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
  'Jenkins': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=800&auto=format&fit=crop',
  'CI/CD': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  '데이터베이스 이론': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
  'MySQL': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
  'MongoDB': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
  'Redis': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  'HTML': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
  'Markdown': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
  'CSV': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
  'XML': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
  'JSON': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
  'YAML': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
  'SW 테스팅 이론': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'Cypress': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'PICT': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'Selenium': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'Postman': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'JEST': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'Artillery': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'Pywinauto': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
  'VSCode': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  'IntelliJ': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
};

// Dynamically traverse categories array to collect all leaves
function getLeafCategoryNames(nodes: CategoryNode[]): string[] {
  const list: string[] = [];
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) {
      list.push(node.name);
    } else {
      list.push(...getLeafCategoryNames(node.children));
    }
  }
  return list;
}

async function runDynamicSeedingAndHealing() {
  console.log('Starting dynamic zero-post seeding and thumbnail healing...');
  try {
    // 1. Fetch all existing posts
    const existingPosts = await db.select().from(posts);
    
    // 2. Count posts per category
    const categoryCounts: Record<string, number> = {};
    for (const post of existingPosts) {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    }
    
    // 3. Extract all leaf category names
    const leaves = getLeafCategoryNames(CATEGORIES);
    console.log(`Discovered ${leaves.length} leaf categories in total.`);

    // 4. Find categories with 0 posts and seed them
    let seededCount = 0;
    for (const leaf of leaves) {
      const count = categoryCounts[leaf] || 0;
      if (count === 0) {
        console.log(`Category "${leaf}" has 0 posts. Preparing seed post...`);
        const template = postTemplates[leaf] || {
          title: `${leaf} 기술 완벽 입문 및 활용 실습 가이드`,
          thumbnailUrl: categoryThumbnailMap[leaf] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
          content: `
# ${leaf} 기술 가이드: 기초 개념부터 실전 구축까지

현대 기술 생태계에서 매우 중요하게 사용되는 **${leaf}** 기술의 작동 구조와 장점, 그리고 실무 개발 환경에서의 구성 방법을 상세히 설명합니다.

## 1. ${leaf} 기술 핵심 요약
- **목표**: 비즈니스 효율성 향상 및 최적화
- **특징**: 빠른 기동, 직관적인 사용법, 높은 확장성
- **주요 혜택**: 대량 의존성 제거, 개발 속도 단축

## 2. 단계별 실무 세팅법
1. 개발 환경 설치 및 기초 구성을 마칩니다.
2. 예제 소스 코드 및 매니페스트 설정을 확인합니다.
3. 로컬 테스트 및 배포 파이프라인 연동을 수행합니다.

이 기술을 프로젝트에 도입하면 전반적인 소스 완성도와 관리 효율성을 2배 이상 높일 수 있습니다.
`
        };

        // Insert new post for empty category
        await db.insert(posts).values({
          title: template.title,
          category: leaf,
          thumbnailUrl: template.thumbnailUrl,
          author: 'Bong Dev',
          commentCount: 0,
          content: template.content.trim()
        });
        
        console.log(`✅ Successfully seeded category: "${leaf}" -> Post Title: "${template.title}"`);
        seededCount++;
      }
    }

    console.log(`Seeded ${seededCount} empty categories in total.`);

    // 5. Sweep and HEAL all broken/blocked thumbnails in the database
    console.log('Sweeping database to heal broken, blocked (Daum/Kakao CDN), or null thumbnails...');
    const allPostsAfterSeed = await db.select().from(posts);
    let healedCount = 0;
    
    for (const post of allPostsAfterSeed) {
      const url = post.thumbnailUrl || '';
      
      // If thumbnail is null, empty, or contains daumcdn.net / kakaocdn.net (hotlinking blocked)
      if (!url || url.includes('daumcdn.net') || url.includes('kakaocdn.net') || url.includes('tistory.com')) {
        const leafCat = post.category;
        const healedUrl = categoryThumbnailMap[leafCat] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop';
        
        await db.update(posts)
          .set({ thumbnailUrl: healedUrl })
          .where(eq(posts.id, post.id));
        
        console.log(`Healed thumbnail for post ID ${post.id} ("${post.title}") -> Synced with Unsplash: "${healedUrl}"`);
        healedCount++;
      }
    }
    
    console.log(`✅ Successfully healed ${healedCount} broken/blocked post thumbnails!`);
    console.log('🎉 Dynamic Zero-Post Seeding & Thumbnail Healing fully completed!');
  } catch (error) {
    console.error('❌ Error during dynamic seeding & healing:', error);
  } finally {
    process.exit(0);
  }
}

runDynamicSeedingAndHealing();
