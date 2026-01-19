// App State
let appState = {
    age: '30대',
    gender: '남성',
    ethnicity: '한국인',
    clothing: '회색 정장',
    imageWithBg: null,
    imageWithoutBg: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadApiKey();
});

function setupEventListeners() {
    // Generate button
    document.getElementById('btn-generate').addEventListener('click', generateImage);
    
    // Download buttons
    document.getElementById('btn-download-with-bg').addEventListener('click', () => downloadImage(true));
    document.getElementById('btn-download-no-bg').addEventListener('click', () => downloadImage(false));
    
    // Input fields
    document.getElementById('age-input').addEventListener('input', (e) => {
        appState.age = e.target.value;
    });
    
    document.getElementById('gender-input').addEventListener('input', (e) => {
        appState.gender = e.target.value;
    });
    
    document.getElementById('ethnicity-input').addEventListener('input', (e) => {
        appState.ethnicity = e.target.value;
    });
    
    document.getElementById('clothing-input').addEventListener('input', (e) => {
        appState.clothing = e.target.value;
    });
    
    // API key input
    document.getElementById('api-key-input').addEventListener('input', (e) => {
        saveApiKey(e.target.value);
    });
}

function buildPrompt(withBackground) {
    const age = appState.age || '30대';
    const gender = appState.gender || '남성';
    const ethnicity = appState.ethnicity || '한국인';
    const clothing = appState.clothing || '회색 정장';
    
    let ageNumber = age.replace(/[^0-9]/g, '');
    if (!ageNumber) ageNumber = '30';
    
    // Detailed text-to-image prompt
    let prompt = '';
    
    // 1. Main subject
    prompt += `Professional studio portrait photograph of a ${ageNumber} year old ${gender} person from behind, `;
    
    // 2. Ethnicity details
    if (ethnicity.includes('한국') || ethnicity.toLowerCase().includes('korean')) {
        prompt += 'Korean ethnicity, East Asian features, typical Korean skin tone and hair, ';
    } else if (ethnicity.includes('일본') || ethnicity.toLowerCase().includes('japanese')) {
        prompt += 'Japanese ethnicity, East Asian features, ';
    } else if (ethnicity.includes('중국') || ethnicity.toLowerCase().includes('chinese')) {
        prompt += 'Chinese ethnicity, East Asian features, ';
    } else if (ethnicity.includes('서양') || ethnicity.includes('미국') || ethnicity.toLowerCase().includes('caucasian') || ethnicity.toLowerCase().includes('american')) {
        prompt += 'Caucasian ethnicity, Western features, lighter skin tone, ';
    } else if (ethnicity.includes('흑인') || ethnicity.toLowerCase().includes('african') || ethnicity.toLowerCase().includes('black')) {
        prompt += 'African ethnicity, dark skin tone, ';
    } else {
        prompt += `${ethnicity} ethnicity, `;
    }
    
    // 3. Age-specific details
    if (parseInt(ageNumber) < 20) {
        prompt += 'young person, youthful appearance, smooth skin, young hairstyle, ';
    } else if (parseInt(ageNumber) < 40) {
        prompt += 'adult person, mature appearance, professional look, ';
    } else if (parseInt(ageNumber) < 60) {
        prompt += 'middle-aged person, some grey hair, mature features, ';
    } else {
        prompt += 'elderly person, grey or white hair, aged features, ';
    }
    
    // 4. Gender-specific details
    if (gender.includes('여성') || gender.toLowerCase().includes('female')) {
        prompt += 'female body shape, feminine shoulders, female hairstyle, ';
    } else {
        prompt += 'male body shape, masculine shoulders, male hairstyle, ';
    }
    
    // 5. Clothing
    prompt += `wearing ${clothing}, `;
    
    // 6. Camera and composition (consistent style)
    prompt += 'exact back view, centered composition, upper body portrait cropped at waist, ';
    
    // 7. Lighting (dramatic rim light effect)
    if (withBackground) {
        prompt += 'dramatic studio lighting with warm golden rim light (2700K color temperature), ';
        prompt += 'strong edge lighting creating a bright outline on the shoulders and head, ';
        prompt += 'pure black background (#000000), ';
    } else {
        prompt += 'soft studio lighting with subtle rim light, ';
        prompt += 'pure white background (#FFFFFF), ';
    }
    
    // 8. Technical quality
    prompt += 'professional photography, photorealistic, high detail, 8K quality, ';
    prompt += 'commercial studio portrait, editorial style, cinematic lighting, ';
    prompt += 'sharp focus, professional color grading, ';
    
    // 9. Negative prompts (what to avoid)
    prompt += 'NOT: side view, NOT: face visible, NOT: front view, NOT: three-quarter view, ';
    prompt += 'NOT: low quality, NOT: blurry, NOT: distorted, NOT: amateur, ';
    prompt += 'NOT: multiple people, NOT: cropped head, NOT: unusual angles. ';
    
    // 10. Final emphasis
    prompt += 'Perfect centered back view portrait, professional studio quality.';
    
    return prompt;
}

async function generateImage() {
    const apiKey = document.getElementById('api-key-input').value.trim();
    
    if (!apiKey || !apiKey.startsWith('r8_')) {
        showError('올바른 Replicate API 키를 입력하세요! (r8_로 시작)');
        return;
    }
    
    try {
        disableButtons();
        updateStatus('AI가 이미지를 생성하고 있습니다... (1/2)', true);
        
        // Generate image with background
        const prompt = buildPrompt(true);
        const imageWithBg = await callGenerateAPI(apiKey, prompt);
        appState.imageWithBg = imageWithBg;
        
        updateStatus('배경 제거 중... (2/2)', true);
        
        // Remove background
        const imageWithoutBg = await callRemoveBackgroundAPI(apiKey, imageWithBg);
        appState.imageWithoutBg = imageWithoutBg;
        
        updateStatus('완료!', false);
        showPreview();
        enableButtons();
        
    } catch (err) {
        console.error('Generation error:', err);
        showError('이미지 생성 중 오류가 발생했습니다: ' + err.message);
        enableButtons();
    }
}

async function callGenerateAPI(apiKey, prompt) {
    const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, prompt })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Image generation failed');
    }
    
    const data = await response.json();
    return data.imageUrl;
}

async function callRemoveBackgroundAPI(apiKey, imageUrl) {
    const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, imageUrl })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Background removal failed');
    }
    
    const data = await response.json();
    return data.imageUrl;
}

function showPreview() {
    document.getElementById('preview-placeholder').classList.add('hidden');
    document.getElementById('preview-image').classList.remove('hidden');
    document.getElementById('generated-image').src = appState.imageWithBg;
    document.getElementById('transparent-badge').classList.add('hidden');
    document.getElementById('image-info').textContent = `${appState.age} ${appState.gender} (${appState.ethnicity}), ${appState.clothing}`;
}

async function downloadImage(withBg) {
    const imageUrl = withBg ? appState.imageWithBg : appState.imageWithoutBg;
    if (!imageUrl) return;
    
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        const bgType = withBg ? 'with-bg' : 'transparent';
        const safeAge = appState.age.replace(/[^a-zA-Z0-9가-힣]/g, '');
        const safeGender = appState.gender.replace(/[^a-zA-Z0-9가-힣]/g, '');
        const safeEthnicity = appState.ethnicity.replace(/[^a-zA-Z0-9가-힣]/g, '');
        const filename = `silhouette-${safeAge}-${safeGender}-${safeEthnicity}-${bgType}-${Date.now()}.png`;
        link.download = filename;
        link.href = url;
        link.click();
        
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Download error:', err);
        showError('다운로드 중 오류가 발생했습니다.');
    }
}

function disableButtons() {
    document.getElementById('btn-generate').disabled = true;
    document.getElementById('loading-spinner').classList.remove('hidden');
}

function enableButtons() {
    document.getElementById('btn-generate').disabled = false;
    document.getElementById('loading-spinner').classList.add('hidden');
}

function updateStatus(message, isLoading) {
    const statusText = document.getElementById('status-text');
    statusText.textContent = message;
    statusText.style.color = isLoading ? '#93c5fd' : '#86efac';
}

function showError(message) {
    const statusText = document.getElementById('status-text');
    statusText.textContent = '❌ ' + message;
    statusText.style.color = '#fca5a5';
    document.getElementById('loading-spinner').classList.add('hidden');
}

function saveApiKey(apiKey) {
    try {
        localStorage.setItem('replicate_api_key', apiKey);
    } catch (err) {
        console.error('Failed to save API key:', err);
    }
}

function loadApiKey() {
    try {
        const apiKey = localStorage.getItem('replicate_api_key');
        if (apiKey) {
            document.getElementById('api-key-input').value = apiKey;
        }
    } catch (err) {
        console.error('Failed to load API key:', err);
    }
}
