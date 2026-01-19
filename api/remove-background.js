export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, imageUrl } = req.body;

  if (!apiKey || !apiKey.startsWith('r8_')) {
    return res.status(400).json({ error: 'Valid API key required' });
  }

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL required' });
  }

  try {
    console.log('🎨 배경 제거 시작');

    // Create prediction with 851-labs background remover
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        version: "a029dff38972b5fda4ec5d75d7d1cd25aeff621d2cf4946a41055d7db66b80bc",
        input: {
          image: imageUrl
        }
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('Replicate API error:', errorData);
      return res.status(createResponse.status).json({ 
        error: errorData.detail || 'Background removal failed' 
      });
    }

    const prediction = await createResponse.json();
    console.log('✅ Prediction created:', prediction.id);

    // Wait for completion
    let finalPrediction = prediction;
    while (finalPrediction.status === 'starting' || finalPrediction.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${finalPrediction.id}`, {
        headers: {
          'Authorization': `Token ${apiKey}`
        }
      });
      
      finalPrediction = await statusResponse.json();
    }

    if (finalPrediction.status === 'failed') {
      console.error('Prediction failed:', finalPrediction.error);
      return res.status(500).json({ error: finalPrediction.error || 'Background removal failed' });
    }

    const resultImageUrl = finalPrediction.output;
    
    if (!resultImageUrl) {
      console.error('No image in output:', finalPrediction);
      return res.status(500).json({ error: 'No image generated' });
    }

    console.log('✅ Background removed:', resultImageUrl);
    return res.status(200).json({ imageUrl: resultImageUrl });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
