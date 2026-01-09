// api/remove-background.js
// Vercel Serverless Function - 851-labs/background-remover

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl, apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ 
      error: 'API 키가 필요합니다.' 
    });
  }

  if (!imageUrl) {
    return res.status(400).json({ error: '이미지 URL이 필요합니다.' });
  }

  try {
    console.log('🖼️  배경 제거 시작');

    // Use 851-labs/background-remover
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc",
        input: {
          image: imageUrl
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ 배경 제거 API 오류:', errorText);
      throw new Error('배경 제거 API 오류');
    }

    let prediction = await createResponse.json();
    console.log('📝 배경 제거 Prediction 생성:', prediction.id);

    // Wait for completion
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts && prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${apiKey}`,
          },
        }
      );
      
      prediction = await statusResponse.json();
      attempts++;
      
      console.log(`⏳ 배경 제거 대기 중... (${attempts}/${maxAttempts}) - 상태: ${prediction.status}`);
    }
    
    if (prediction.status === 'failed') {
      console.error('❌ 배경 제거 실패:', prediction.error);
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
      console.error('❌ 투명 이미지 URL 없음');
      return res.status(200).json({ 
        transparentImageUrl: imageUrl,
        warning: '배경 제거 결과를 찾을 수 없어 원본 이미지를 반환합니다.'
      });
    }

    console.log('✅ 배경 제거 완료');

    return res.status(200).json({ 
      transparentImageUrl,
      predictionId: prediction.id
    });

  } catch (error) {
    console.error('💥 배경 제거 오류:', error);
    return res.status(200).json({ 
      transparentImageUrl: imageUrl,
      warning: '배경 제거 중 오류가 발생하여 원본 이미지를 반환합니다.'
    });
  }
};
