// api/generate-image.js
// Vercel Serverless Function - accepts API key from client

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

  const { prompt, withBackground, apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ 
      error: 'API 키가 필요합니다.' 
    });
  }

  try {
    console.log('🎨 이미지 생성 시작 (img2img mode)');

    // Reference image URL - multiple methods to get the correct URL
    let referenceImageUrl;
    
    // Method 1: Check if deployed on Vercel
    if (process.env.VERCEL_URL) {
      referenceImageUrl = `https://${process.env.VERCEL_URL}/reference.png`;
    }
    // Method 2: Check custom domain (update after deployment)
    else if (req.headers.host) {
      referenceImageUrl = `https://${req.headers.host}/reference.png`;
    }
    // Method 3: Fallback to hardcoded URL (UPDATE THIS AFTER FIRST DEPLOYMENT!)
    else {
      // TODO: Replace with your actual deployed URL after first deployment
      referenceImageUrl = 'https://your-site.vercel.app/reference.png';
      // Example: 'https://silhouette-maker.vercel.app/reference.png'
    }
    
    console.log('📸 Reference image URL:', referenceImageUrl);

    // Create prediction with SDXL img2img
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL img2img
        input: {
          image: referenceImageUrl,
          prompt: prompt,
          prompt_strength: 0.65, // Adjust 0.5-0.8 (lower = more similar to reference)
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: "K_EULER",
          num_outputs: 1
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Replicate API 오류:', errorText);
      throw new Error('API 키가 올바르지 않거나 Replicate API 오류가 발생했습니다.');
    }

    let prediction = await createResponse.json();
    console.log('📝 Prediction 생성됨:', prediction.id);

    // Wait for completion
    let attempts = 0;
    const maxAttempts = 60;
    
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
      
      console.log(`⏳ 대기 중... (${attempts}/${maxAttempts}) - 상태: ${prediction.status}`);
    }
    
    if (prediction.status === 'failed') {
      console.error('❌ 이미지 생성 실패:', prediction.error);
      throw new Error(prediction.error || '이미지 생성에 실패했습니다.');
    }
    
    if (prediction.status !== 'succeeded') {
      console.error('⏰ 타임아웃');
      throw new Error('이미지 생성 시간이 초과되었습니다. 다시 시도해주세요.');
    }

    const imageUrl = prediction.output?.[0];
    
    if (!imageUrl) {
      console.error('❌ 이미지 URL 없음');
      throw new Error('생성된 이미지를 찾을 수 없습니다.');
    }

    console.log('✅ 이미지 생성 완료');

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
