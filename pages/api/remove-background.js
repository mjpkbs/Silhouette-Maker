// pages/api/remove-background.js
// Replicate RMBG 모델을 사용한 배경 제거

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl } = req.body;
  const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

  if (!REPLICATE_API_KEY) {
    return res.status(500).json({ 
      error: 'API 키가 설정되지 않았습니다.' 
    });
  }

  if (!imageUrl) {
    return res.status(400).json({ error: '이미지 URL이 필요합니다.' });
  }

  try {
    console.log('🖼️  배경 제거 시작:', imageUrl);

    // Replicate RMBG-1.4 모델 사용
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1", // RMBG-1.4
        input: {
          image: imageUrl
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ RMBG API 오류:', errorText);
      throw new Error(`배경 제거 API 오류: ${createResponse.status}`);
    }

    let prediction = await createResponse.json();
    console.log('📝 배경 제거 Prediction 생성:', prediction.id);

    // Prediction 완료 대기
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts && prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${REPLICATE_API_KEY}`,
          },
        }
      );
      
      prediction = await statusResponse.json();
      attempts++;
      
      console.log(`⏳ 배경 제거 대기 중... (${attempts}/${maxAttempts}) - 상태: ${prediction.status}`);
    }
    
    if (prediction.status === 'failed') {
      console.error('❌ 배경 제거 실패:', prediction.error);
      // 배경 제거 실패 시 원본 반환
      return res.status(200).json({ 
        transparentImageUrl: imageUrl,
        warning: '배경 제거에 실패하여 원본 이미지를 반환합니다.'
      });
    }
    
    if (prediction.status !== 'succeeded') {
      console.error('⏰ 배경 제거 타임아웃');
      return res.status(200).json({ 
        transparentImageUrl: imageUrl,
        warning: '배경 제거 시간이 초과되어 원본 이미지를 반환합니다.'
      });
    }

    const transparentImageUrl = prediction.output;
    
    if (!transparentImageUrl) {
      console.error('❌ 투명 이미지 URL 없음:', prediction);
      return res.status(200).json({ 
        transparentImageUrl: imageUrl,
        warning: '배경 제거 결과를 찾을 수 없어 원본 이미지를 반환합니다.'
      });
    }

    console.log('✅ 배경 제거 완료:', transparentImageUrl);

    return res.status(200).json({ 
      transparentImageUrl,
      predictionId: prediction.id
    });

  } catch (error) {
    console.error('💥 배경 제거 오류:', error);
    // 오류 발생 시 원본 이미지 반환
    return res.status(200).json({ 
      transparentImageUrl: imageUrl,
      warning: '배경 제거 중 오류가 발생하여 원본 이미지를 반환합니다.'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  maxDuration: 60,
};
