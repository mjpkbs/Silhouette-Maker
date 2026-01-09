# 실루엣 생성기 배포 가이드

## 📋 준비사항

### 1. API 키 발급

#### Replicate (필수)
1. https://replicate.com 회원가입
2. Account Settings → API Tokens
3. API 키 복사

#### BRIA (배경 제거 - 무료 옵션)
1. https://bria.ai 회원가입
2. 무료 크레딧으로 시작
3. API 키 발급

#### Remove.bg (배경 제거 - 대안)
1. https://remove.bg 회원가입
2. API 키 발급 (무료: 50 이미지/월)

## 🚀 Vercel 배포 (추천)

### 단계 1: 프로젝트 구조 준비

```
silhouette-generator/
├── pages/
│   ├── index.jsx                    # silhouette-generator-pro.jsx 내용
│   └── api/
│       ├── generate-image.js        # API 라우트
│       └── remove-background.js     # API 라우트
├── package.json
├── next.config.js
└── .env.local                       # API 키 저장
```

### 단계 2: package.json 생성

```json
{
  "name": "silhouette-generator",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "lucide-react": "^0.303.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0"
  }
}
```

### 단계 3: Tailwind CSS 설정

**tailwind.config.js**
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**postcss.config.js**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**styles/globals.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 단계 4: 환경 변수 설정

**.env.local** (로컬 개발용)
```env
REPLICATE_API_KEY=r8_xxxxxxxxxxxx
BRIA_API_KEY=your_bria_key
REMOVE_BG_API_KEY=your_removebg_key
```

### 단계 5: Vercel 배포

#### 방법 1: Vercel CLI
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

#### 방법 2: GitHub 연동
1. GitHub에 저장소 생성
2. 코드 푸시
3. https://vercel.com 로그인
4. "Import Project" → GitHub 저장소 선택
5. Environment Variables 설정:
   - `REPLICATE_API_KEY`
   - `BRIA_API_KEY` (선택)
   - `REMOVE_BG_API_KEY` (선택)
6. Deploy 클릭

## 🌐 Netlify 배포

### Netlify Functions 사용

**netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "out"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**netlify/functions/generate-image.js**
```javascript
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt } = JSON.parse(event.body);
  const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

  try {
    // Replicate API 호출 로직 (위 코드 참조)
    // ...
    
    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

## 💰 비용 계산

### Replicate (Flux Schnell)
- **비용**: ~$0.003 per image
- **예상**: 1,000 이미지 = $3
- **속도**: 2-4초

### 배경 제거
#### BRIA
- **무료 티어**: 월 1,000 이미지
- **유료**: $0.004 per image

#### Remove.bg
- **무료**: 월 50 이미지
- **구독**: $9/월 (500 이미지)

### 총 예상 비용
- **1,000 이미지 생성 + 배경 제거**: 약 $7-10

## 🔧 프로덕션 최적화

### 1. 캐싱 구현

```javascript
// lib/cache.js
const imageCache = new Map();

export function getCachedImage(key) {
  return imageCache.get(key);
}

export function setCachedImage(key, value) {
  imageCache.set(key, value);
  // 1시간 후 자동 삭제
  setTimeout(() => imageCache.delete(key), 3600000);
}
```

### 2. Rate Limiting

```javascript
// middleware/rateLimit.js
const rateLimits = new Map();

export function checkRateLimit(userId, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || [];
  
  // 시간 윈도우 내 요청만 필터링
  const recentRequests = userLimits.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  recentRequests.push(now);
  rateLimits.set(userId, recentRequests);
  return true;
}
```

### 3. 에러 핸들링

```javascript
// API 라우트에 추가
try {
  // API 호출
} catch (error) {
  if (error.message.includes('rate limit')) {
    return res.status(429).json({ 
      error: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' 
    });
  }
  
  if (error.message.includes('timeout')) {
    return res.status(504).json({ 
      error: '이미지 생성 시간이 초과되었습니다.' 
    });
  }
  
  return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
}
```

### 4. 이미지 최적화

```javascript
// Next.js Image 컴포넌트 사용
import Image from 'next/image';

<Image
  src={generatedImage}
  alt="Silhouette"
  width={1024}
  height={1536}
  quality={90}
  priority
/>
```

## 📊 모니터링

### Vercel Analytics
```javascript
// pages/_app.jsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Sentry 에러 추적
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

## 🧪 테스트

### 로컬 테스트
```bash
# 개발 서버 실행
npm run dev

# http://localhost:3000 접속
```

### API 테스트
```bash
# generate-image 엔드포인트 테스트
curl -X POST http://localhost:3000/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "rear view of an adult wearing suit"}'
```

## 🚨 문제 해결

### API 키 오류
```
Error: API key not configured
→ .env.local 파일 확인 및 Vercel 환경 변수 재설정
```

### CORS 오류
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
        ],
      },
    ];
  },
};
```

### 타임아웃 오류
```javascript
// API 라우트에서 타임아웃 증가
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
    externalResolver: true,
  },
  maxDuration: 60, // Vercel Pro 필요
};
```

## 📱 모바일 최적화

```javascript
// Responsive 이미지 처리
<div className="w-full max-w-2xl mx-auto">
  <img
    src={generatedImage}
    alt="Silhouette"
    className="w-full h-auto"
    loading="lazy"
  />
</div>
```

## 🔐 보안

### API 키 보호
```javascript
// API 라우트에서만 사용
// 절대 클라이언트 코드에 노출 금지

// ❌ 잘못된 예
const apiKey = 'r8_xxxx'; 

// ✅ 올바른 예
const apiKey = process.env.REPLICATE_API_KEY;
```

### Rate Limiting
```javascript
// IP 기반 제한
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1분
  uniqueTokenPerInterval: 500,
});

export default async function handler(req, res) {
  try {
    await limiter.check(res, 10, 'CACHE_TOKEN'); // 분당 10회
    // API 로직
  } catch {
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
}
```

## 📈 스케일링

### 대용량 트래픽 대비
1. **Vercel Pro 플랜** - 무제한 함수 실행
2. **Redis 캐싱** - Upstash 사용
3. **CDN** - 이미지 캐싱
4. **Queue 시스템** - 비동기 처리

### 비용 최적화
1. 생성된 이미지 재사용
2. 사용자 크레딧 시스템
3. 배치 처리로 API 호출 최소화

## 📚 추가 리소스

- Replicate 문서: https://replicate.com/docs
- Vercel 가이드: https://vercel.com/docs
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- Tailwind CSS: https://tailwindcss.com/docs
