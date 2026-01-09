// api/generate-image.js
// Vercel Serverless Function

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

  const { prompt, withBackground } = req.body;
  const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

  if (!REPLICATE_API_KEY) {
    return res.status(500).json({ 
      error: 'API 키가 설정되지 않았습니다. Vercel 환경 변수를 확인해주세요.' 
    });
  }

  try {
    console.log('🎨 이미지 생성 시작:', { prompt: prompt.substring(0, 100), withBackground });

    // 1. Replicate prediction 생성 (Flux Schnell 모델)
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
        input: {
          prompt: prompt,
          go_fast: true,
          megapixels: "1",
          num_outputs: 1,
          aspect_ratio: "2:3",
          output_format: "png",
          output_quality: 100,
          num_inference_steps: 4
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Replicate API 오류:', errorText);
      throw new Error(`Replicate API 오류: ${createResponse.status}`);
    }

    let prediction = await createResponse.json();
    console.log('📝 Prediction 생성됨:', prediction.id);

    // 2. Prediction 완료 대기
    let attempts = 0;
    const maxAttempts = 60;
    
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
      
      console.log(`⏳ 대기 중... (${attempts}/${maxAttempts}) - 상태: ${prediction.status}`);
    }
    
    if (prediction.status === 'failed') {
      console.error('❌ 이미지 생성 실패:', prediction.error);
      throw new Error(prediction.error || '이미지 생성에 실패했습니다.');
    }
    
    if (prediction.status !== 'succeeded') {
      console.error('⏰ 타임아웃:', { attempts, status: prediction.status });
      throw new Error('이미지 생성 시간이 초과되었습니다. 다시 시도해주세요.');
    }

    const imageUrl = prediction.output?.[0];
    
    if (!imageUrl) {
      console.error('❌ 이미지 URL 없음:', prediction);
      throw new Error('생성된 이미지를 찾을 수 없습니다.');
    }

    console.log('✅ 이미지 생성 완료:', imageUrl);

    return res.status(200).json({ 
      imageUrl,
      predictionId: prediction.id
    });

  } catch (error) {
    console.error('💥 이미지 생성 오류:', error);
    return res.status(500).json({ 
      error: error.message || '이미지 생성 중 오류가 발생했습니다.' 
    });
  }
};
