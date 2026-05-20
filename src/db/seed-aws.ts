import { config } from 'dotenv';
import { db } from './index';
import { posts } from './schema';
import { eq } from 'drizzle-orm';

config();

const awsPosts = [
  {
    title: 'AWS EC2 기초 및 서버 인스턴스 구축하기',
    category: 'AWS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# AWS EC2 (Elastic Compute Cloud) 기초 완벽 실습

클라우드 컴퓨팅의 기본은 독립된 가상 서버를 대여하여 원하는 환경을 구축하는 것입니다. AWS EC2는 가장 대표적인 가상 서버 서비스입니다. 이번 가이드에서는 EC2 인스턴스를 생성하고 접속하는 전 과정을 상세히 다룹니다.

## 1. EC2 핵심 개념 이해하기

- **인스턴스(Instance)**: AWS 클라우드에서 실행되는 가상 컴퓨터 서버입니다.
- **AMI (Amazon Machine Image)**: 서버 OS 및 초기 기본 소프트웨어가 미리 세팅된 가상 이미지입니다. (e.g. Ubuntu 22.04 LTS, Amazon Linux 2023)
- **보안 그룹 (Security Group)**: 가상 방화벽으로, 허용할 IP와 포트를 제어하는 인바운드/아웃바운드 규칙을 정의합니다.
- **키 페어 (Key Pair)**: 가상 서버에 SSH 접속을 하기 위한 암호화된 비밀키(Private Key, .pem/.ppk)입니다.

---

## 2. EC2 인스턴스 생성 (Launch Instance) 절차

1. **AWS 콘솔** 로그인 후 **EC2 대시보드**로 이동합니다.
2. **[인스턴스 시작 (Launch Instance)]** 버튼을 클릭합니다.
3. **이름 및 태그**를 입력합니다. (e.g. \`Bong-Tech-Blog-Server\`)
4. **AMI 선택**: OS로 **Ubuntu Server 22.04 LTS**를 선택합니다.
5. **인스턴스 유형**: 프리티어 등급인 **t2.micro** 또는 **t3.micro**를 선택합니다.
6. **키 페어 생성**: 새 키 페어를 생성하고 \`.pem\` 파일을 로컬 컴퓨터에 안전하게 저장합니다. (분실 시 접속 불가!)
7. **네트워크 설정 (보안 그룹)**:
   - **SSH 허용 (22포트)**: 자신의 IP만 허용하도록 설정합니다.
   - **HTTP (80포트) 및 HTTPS (443포트) 허용**: 외부 클라이언트의 웹 접속을 위해 허용합니다.
8. **인스턴스 시작** 버튼을 클릭하여 인스턴스를 활성화합니다.

---

## 3. SSH를 통한 EC2 서버 접속 방법 (Windows/Mac)

### 3.1 Mac & Linux 터미널
\`\`.pem\`\` 파일이 다운로드된 디렉토리로 이동하여 아래 명령어를 실행합니다.

\`\`\`bash
# 1. 키 파일 권한 변경 (소유자 읽기 전용)
chmod 400 your-key-pair.pem

# 2. Public IP를 사용하여 SSH 접속
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>
\`\`\`

### 3.2 Windows PowerShell
PowerShell을 열고 동일하게 실행합니다.

\`\`\`powershell
ssh -i "your-key-pair.pem" ubuntu@<your-ec2-public-ip>
\`\`\`

---

## 4. 기본적인 웹 서버(Nginx) 구성해보기

EC2에 정상 접속했다면, 기본적인 웹 서버를 띄워 외부에서 브라우저를 통해 정상적으로 들어올 수 있는지 테스트합니다.

\`\`\`bash
# 1. 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# 2. Nginx 웹 서버 설치
sudo apt install nginx -y

# 3. Nginx 서비스 실행 및 활성화
sudo systemctl start nginx
sudo systemctl enable nginx
\`\`\`

설치 완료 후 브라우저 주소창에 EC2의 **퍼블릭 IP**를 입력하고 접속하면, 멋진 **"Welcome to nginx!"** 기본 페이지를 볼 수 있습니다!

EC2 인스턴스는 자유도가 매우 높아 Node.js, Spring Boot, Python, Docker 등 원하는 모든 백엔드 서버를 배포할 수 있는 초석이 됩니다.
`
  },
  {
    title: 'S3 정적 웹 호스팅과 CloudFront CDN 연동',
    category: 'AWS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# AWS S3 정적 호스팅과 CloudFront를 통한 글로벌 초고속 배포

정적 리소스(HTML, CSS, JS, 이미지)로 구성된 웹 프론트엔드 어플리케이션은 비싸고 관리하기 복잡한 EC2 서버를 쓰는 것보다, 객체 스토리지인 **AWS S3**에 올리고 글로벌 CDN인 **CloudFront**를 통해 배포하는 것이 비용과 속도 면에서 100배 효율적입니다.

---

## 1. AWS S3 (Simple Storage Service) 버킷 설정

S3 버킷은 데이터를 담는 클라우드 폴더입니다.

1. **S3 대시보드**에서 **[버킷 만들기]**를 클릭합니다.
2. **버킷 이름**은 전 세계에서 유일해야 합니다. (e.g. \`bong-dev-static-bucket\`)
3. **리전**을 설정합니다. (e.g. 서울 \`ap-northeast-2\`)
4. **객체 소유권** 및 **퍼블릭 액세스 차단 설정**: 
   - CloudFront를 통해서만 안전하게 액세스하게 만들기 위해, 퍼블릭 액세스 차단은 그대로 **[모두 차단]** 상태를 유지합니다! (가장 권장되는 보안 구조)
5. **버킷 만들기**를 클릭합니다.

---

## 2. CloudFront (글로벌 CDN) 연동 및 OAC 설정

S3 버킷의 정적 파일들을 전 세계 사용자 근처의 에지 로케이션(Edge Location) 캐시에 보관하여 초고속으로 전송하도록 CloudFront를 설정합니다. 또한 **OAC (Origin Access Control)** 기술을 적용하여 오직 CloudFront를 통한 요청만 S3가 허용하도록 보안을 설정합니다.

1. **CloudFront 대시보드**에서 **[배포 생성 (Create Distribution)]**을 클릭합니다.
2. **원본 도메인 (Origin Domain)**: 위에서 생성한 S3 버킷을 선택합니다.
3. **원본 액세스 (Origin Access)**: **[Origin access control settings (recommended)]**를 선택합니다.
   - [Create control setting] 버튼을 눌러 기본 OAC 설정을 만듭니다.
4. **뷰어 프로토콜 정책**: **[Redirect HTTP to HTTPS]**를 선택해 보안을 강화합니다.
5. **캐시 설정**: 기본 권장 정책을 유지하고 배포를 생성합니다.
6. **중요: S3 버킷 정책 복사 및 적용**
   - 배포 생성 완료 후 나오는 **S3 버킷 정책 문서**를 복사합니다.
   - S3 버킷으로 돌아가 **[권한] -> [버킷 정책]**에 복사한 문서를 붙여넣고 저장합니다. 이 작업을 해줘야 CloudFront가 S3의 파일들을 안전하게 가져올 수 있습니다.

---

## 3. 프론트엔드 배포 및 접속 테스트

1. 빌드 완료된 React, Vue, 또는 Vite 아웃풋 디렉토리의 모든 파일(\`index.html\`, \`assets/\` 등)을 S3 버킷의 루트 경로에 업로드합니다.
2. CloudFront 배포가 활성화(Enabled)될 때까지 약 1~2분 기다립니다.
3. 생성된 **CloudFront 배포 도메인 이름 (e.g. \`d12345abcdef.cloudfront.net\`)**으로 접속합니다.
4. 초고속으로 로딩되는 프론트엔드 어플리케이션을 감상하고, 개발자 도구를 통해 HTTPS 자격 증명이 올바르게 작동하는지 확인합니다!

---

## 4. 아키텍처 요약 및 장점

\`\`\`
[사용자 브라우저] ────> [CloudFront (글로벌 CDN)] ────(OAC 보안 연동)────> [AWS S3 버킷]
\`\`\`

- **무한 확장성**: 동시 접속자가 100만 명이 몰려도 서버 다운 현상이 없습니다.
- **초저렴한 가격**: 웹 서버 구동 비용 없이 오직 파일 보관 및 전송 트래픽 용량만큼만 지불합니다.
- **글로벌 캐싱**: 전 세계 어디서든 수 밀리초만에 정적 리소스 로딩이 가능합니다.
`
  },
  {
    title: 'AWS RDS 인스턴스 생성 및 데이터베이스 연결',
    category: 'AWS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    author: 'Bong Dev',
    commentCount: 0,
    content: `
# AWS RDS 생성과 백엔드 어플리케이션 연결 가이드

서버 어플리케이션을 아무리 잘 구축해도 데이터가 유실되거나 DB 성능이 병목을 일으키면 서비스 전체가 무너집니다. **AWS RDS (Relational Database Service)**는 하드웨어 프로비저닝, DB 설정, 패치, 백업 등 데이터베이스 운영 업무를 완전 자동화해주는 관리형 관계형 데이터베이스 서비스입니다.

이번 가이드에서는 PostgreSQL/MySQL 인스턴스를 생성하고, 로컬 및 EC2 서버에서 원격 접속하는 실습을 진행합니다.

---

## 1. RDS 인스턴스 생성하기

1. **AWS RDS 콘솔**로 이동하여 **[데이터베이스 생성]**을 클릭합니다.
2. **데이터베이스 생성 방식**: 표준 생성(Standard Create)을 선택합니다.
3. **엔진 옵션**: 개발 목적에 널리 사용되는 **PostgreSQL** 또는 **MySQL**을 선택합니다.
4. **템플릿**: 비용이 발생하지 않는 **프리티어 (Free Tier)**를 선택합니다!
5. **설정**:
   - DB 인스턴스 식별자: \`bong-database\`
   - 마스터 사용자 이름: \`postgres\` (또는 원하는 이름)
   - 마스터 암호: 안전하고 기억하기 쉬운 강력한 암호를 설정합니다.
6. **인스턴스 구성**: \`db.t3.micro\` 또는 \`db.t4g.micro\` (프리티어 사양)
7. **연결 (VPC 설정)**:
   - **퍼블릭 액세스**: 로컬 컴퓨터에서 DBeaver나 pgAdmin 등 외부 툴로 원격 접속하여 개발하고 싶다면 **[예 (Yes)]**를 선택합니다. (실 운영 환경에서는 보안을 위해 '아니요'를 하고 EC2 내부 망을 통해서만 접속해야 합니다.)
   - **보안 그룹**: 새 보안 그룹을 생성합니다. (e.g. \`rds-sg\`)
8. **데이터베이스 생성** 버튼을 누릅니다. 생성 완료까지 약 3~5분이 소요됩니다.

---

## 2. 보안 그룹 설정 (방화벽 열기)

RDS 생성이 완료되면 생성된 데이터베이스의 **엔드포인트 (Endpoint, 접속 주소)**가 나타납니다. 하지만 외부 접속 허용 설정(보안 그룹 규칙)을 하지 않으면 접속이 모두 차단됩니다.

1. 생성된 RDS 인스턴스를 클릭하고 **[보안 그룹]**을 클릭합니다.
2. **인바운드 규칙 편집**을 선택합니다.
3. 규칙을 추가합니다:
   - 유형: **PostgreSQL (5432 포트)** 또는 **MySQL/Aurora (3306 포트)**
   - 소스: **[내 IP]**를 선택하여 개발자의 로컬 컴퓨터 접속을 우선 허용합니다.
   - EC2 서버에서도 데이터베이스에 붙어야 하므로, EC2 서버가 사용하는 보안 그룹 ID를 소스로 한 번 더 추가해 줍니다.

---

## 3. 로컬 툴(DBeaver)에서 연결 및 DB 생성하기

1. **DBeaver** (또는 pgAdmin)를 열고 새 데이터베이스 연결을 선택합니다.
2. **Host**: RDS 상세 페이지에서 확인한 **엔드포인트 주소**를 입력합니다.
3. **Port**: 5432 (PostgreSQL) 또는 3066 (MySQL)
4. **Username & Password**: 인스턴스 생성 시 입력했던 마스터 계정 정보를 입력합니다.
5. **[Test Connection]**을 클릭하여 녹색 체크 표시가 뜨며 정상 연동됨을 확인합니다!
6. 데이터베이스 연결 후, 백엔드 서비스에서 사용할 스키마를 생성합니다:
   \`\`\`sql
   CREATE DATABASE my_tech_blog;
   \`\`\`

---

## 4. 백엔드 어플리케이션(Node.js/Next.js/Drizzle) 연결 설정

Drizzle ORM이나 Prisma를 사용할 경우, 환경 변수에 RDS 엔드포인트 URL을 세팅해 줍니다.

\`\`\`env
# .env 파일 예시
DATABASE_URL="postgresql://postgres:<마스터암호>@<rds엔드포인트주소>:5432/my_tech_blog?sslmode=require"
\`\`\`

이렇게 RDS를 도입하면 스냅샷 백업이 매일 자동으로 관리되고, 서비스 트래픽이 많아지면 클릭 한 번으로 고사양 스펙으로 스케일업(Scale-up)할 수 있어 매우 신뢰도 높은 안정적인 서비스를 운영할 수 있습니다!
`
  }
];

const leafCategoryMap: Record<string, string> = {
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
  'CI/CD 기초와 GitHub Actions 파이프라인': 'https://images.unsplash.com/photo-1618335824172-8d7d967e88de?q=80&w=800&auto=format&fit=crop',
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

async function runSeedAndSync() {
  console.log('Starting seed and sync script...');
  try {
    // 1. Delete old AWS posts to prevent duplication
    const oldTitles = awsPosts.map(p => p.title);
    for (const title of oldTitles) {
      await db.delete(posts).where(eq(posts.title, title));
      console.log(`Deleted old post if exists: "${title}"`);
    }

    // 2. Insert new AWS posts
    for (const post of awsPosts) {
      await db.insert(posts).values(post);
      console.log(`Inserted AWS post: "${post.title}"`);
    }

    // 3. Sync and map all posts (including old and new ones) to leaf categories and working thumbnails
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
      
      console.log(`Synced post ID ${post.id}: "${post.title}" -> Category: "${mappedCategory}"`);
    }

    console.log('✅ Seeding and Synchronization completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seed and sync:', error);
  } finally {
    process.exit(0);
  }
}

runSeedAndSync();
