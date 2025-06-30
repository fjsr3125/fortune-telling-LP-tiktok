(function() {
    'use strict';

// 占い体験のデータと設定
const fortuneData = {
    questions: [
        {
            id: 1,
            title: "今、あなたの心を最も占めているものは？",
            answers: [
                { text: "恋愛・人間関係の悩み", value: "love" },
                { text: "仕事・キャリアの不安", value: "career" },
                { text: "将来への漠然とした不安", value: "future" },
                { text: "家族との関係", value: "family" }
            ]
        },
        {
            id: 2,
            title: "最近、直感や第六感を感じることはありますか？",
            answers: [
                { text: "よくある。虫の知らせを感じる", value: "strong_intuition" },
                { text: "時々ある。なんとなく分かる時がある", value: "medium_intuition" },
                { text: "たまにある。偶然かもしれない", value: "weak_intuition" },
                { text: "あまりない。論理的に考える方だ", value: "logical" }
            ]
        },
        {
            id: 3,
            title: "夢でよく見るものは？",
            answers: [
                { text: "知らない場所や人", value: "spiritual" },
                { text: "過去の出来事や懐かしい人", value: "past" },
                { text: "日常的な出来事", value: "present" },
                { text: "あまり夢を覚えていない", value: "none" }
            ]
        },
        {
            id: 4,
            title: "人生で一番重要な決断を迫られた時、何を頼りにしますか？",
            answers: [
                { text: "心の声・直感", value: "heart" },
                { text: "論理的な分析", value: "logic" },
                { text: "信頼する人のアドバイス", value: "advice" },
                { text: "世間の常識や慣例", value: "common" }
            ]
        },
        {
            id: 5,
            title: "あなたが最も求めているものは？",
            answers: [
                { text: "真実の愛と深い絆", value: "true_love" },
                { text: "経済的な安定と成功", value: "success" },
                { text: "心の平安と健康", value: "peace" },
                { text: "自分らしい生き方", value: "authenticity" }
            ]
        },
        {
            id: 6,
            title: "過去に「運命的だ」と感じた出来事はありますか？",
            answers: [
                { text: "はい、はっきりと覚えている", value: "strong_destiny" },
                { text: "多分あったと思う", value: "maybe_destiny" },
                { text: "よく分からない", value: "unclear" },
                { text: "そういうことは信じない", value: "no_destiny" }
            ]
        },
        {
            id: 7,
            title: "今、あなたの魂が一番必要としているものは？",
            answers: [
                { text: "愛と癒し", value: "healing" },
                { text: "成長と変化", value: "growth" },
                { text: "安定と安心", value: "stability" },
                { text: "自由と冒険", value: "freedom" }
            ]
        }
    ],
    
    // ランダム生成用の要素配列
    randomElements: {
        types: [
            "運命の愛が近づいています💕",
            "仕事運大転換期🌟",
            "金運上昇のサイン💰",
            "人間関係の浄化期🌸",
            "霊的覚醒の兆し✨",
            "安定と平和の運勢🕊️",
            "自立と成長の時期🦋",
            "創造力開花の時🎨",
            "健康運向上期🍃",
            "学びと成長の季節📚"
        ],
        descriptions: [
            "あなたの魂が新しいステージへと導かれています。",
            "宇宙のエネルギーがあなたを支えています。",
            "これまでの努力が実を結ぶ時期が来ました。",
            "直感を信じて行動することで道が開けます。",
            "心の声に従うことで真の幸せを見つけられます。",
            "新しい出会いや機会が待っています。",
            "過去の経験が今後の糧となるでしょう。",
            "周りの人との絆が深まる時期です。"
        ],
        colors: ["ローズピンク", "ゴールド", "ライトブルー", "パープル", "エメラルドグリーン", "シルバー", "コーラルピンク", "ラベンダー"],
        numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"],
        compatibility: ["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"],
        advice: [
            "新しいことにチャレンジしてみましょう",
            "周りの人との関係を大切にしてください",
            "自分の直感を信じて行動しましょう",
            "今は焦らずじっくりと取り組みましょう",
            "積極的にコミュニケーションを取りましょう"
        ],
        timelines: [
            "1ヶ月以内に変化が訪れます",
            "3ヶ月後に重要な出来事があります",
            "半年以内に大きな転機が来ます",
            "来年の春頃に良い知らせがあります"
        ]
    }
};

// アプリケーションの状態管理
let currentQuestionIndex = 0;
let userAnswers = [];
let fortuneResult = null;

// 音響効果管理
const audioContext = {
    audioCtx: null,
    bgm: null,
    clickSound: null,
    magicSound: null,
    isEnabled: false,
    
    init() {
        // シングルトンパターンでAudioContextを初期化
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (error) {
            console.warn('Audio context initialization failed:', error);
        }
    },
    
    createSounds() {
        if (!this.audioCtx) return;
        
        // 事前に音源設定を準備（実際の音再生は playTone で行う）
        this.clickSound = { frequency: 800, duration: 0.1, type: 'sine' };
        this.magicSound = { frequency: 1200, duration: 0.3, type: 'sine' };
    },
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.isEnabled || !this.audioCtx) return;
        
        try {
            // AudioContextの状態を確認し、必要に応じて再開
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
            
            oscillator.start(this.audioCtx.currentTime);
            oscillator.stop(this.audioCtx.currentTime + duration);
            
        } catch (error) {
            console.warn('Audio playback error:', error);
        }
    },
    
    playClick() {
        if (this.clickSound) {
            this.playTone(this.clickSound.frequency, this.clickSound.duration, this.clickSound.type);
        }
    },
    
    playMagic() {
        if (this.magicSound) {
            this.playTone(this.magicSound.frequency, this.magicSound.duration, this.magicSound.type);
        }
    },
    
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    },
    
    destroy() {
        // クリーンアップ用メソッド
        if (this.audioCtx) {
            this.audioCtx.close();
            this.audioCtx = null;
        }
    }
};

// DOM要素の取得
const heroSection = document.getElementById('hero');
const fortuneSection = document.getElementById('fortune');
const resultSection = document.getElementById('result');
const startButton = document.getElementById('startFortune');
const progressFill = document.getElementById('progressFill');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const questionTitle = document.getElementById('questionTitle');
const answersContainer = document.getElementById('answersContainer');
const lineRegisterButton = document.getElementById('lineRegister');

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // DOM要素の確認とエラーハンドリング
    if (startButton) {
        startButton.addEventListener('click', startFortune);
        console.log('Start button event listener added');
    } else {
        console.error('Start button not found');
    }
    
    if (lineRegisterButton) {
        lineRegisterButton.addEventListener('click', handleLineRegistration);
    }
    
    if (totalQuestionsSpan) {
        totalQuestionsSpan.textContent = fortuneData.questions.length;
    }
    
    createStars();
    audioContext.init();
    createAudioControls();
    
    // その他のボタンのイベントリスナー追加
    const finalCtaButton = document.getElementById('finalCtaButton');
    const shareTwitterBtn = document.getElementById('shareTwitterBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    if (finalCtaButton) {
        finalCtaButton.addEventListener('click', startFortune);
    }
    
    if (shareTwitterBtn) {
        shareTwitterBtn.addEventListener('click', shareTwitter);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartFortune);
    }
    
    // FAQのアコーディオン機能を追加
    initializeFAQ();
}

// FAQアコーディオンの初期化
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', toggleFAQ);
        question.addEventListener('keydown', handleFAQKeydown);
    });
}

// FAQの開閉切り替え
function toggleFAQ(event) {
    const question = event.target;
    const answerId = question.getAttribute('aria-controls');
    const answer = document.getElementById(answerId);
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // 状態を切り替え
    question.setAttribute('aria-expanded', !isExpanded);
    answer.setAttribute('aria-hidden', isExpanded);
    
    // CSSクラスでスタイル制御
    question.classList.toggle('expanded', !isExpanded);
    answer.classList.toggle('visible', !isExpanded);
}

// FAQのキーボード操作対応
function handleFAQKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFAQ(event);
    }
}

// 音響コントロールボタンの作成
function createAudioControls() {
    const audioButton = document.createElement('button');
    audioButton.className = 'audio-toggle';
    audioButton.innerHTML = '🔇';
    audioButton.title = 'サウンドのON/OFF';
    
    audioButton.addEventListener('click', () => {
        const isEnabled = audioContext.toggle();
        audioButton.innerHTML = isEnabled ? '🔊' : '🔇';
        audioContext.playClick();
    });
    
    document.body.appendChild(audioButton);
}

// 星のアニメーション生成
function createStars() {
    const starsContainer = document.querySelector('.stars');
    
    // 通常の星を生成（数を減らしてパフォーマンス向上）
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        
        // ランダムな大きさ
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        starsContainer.appendChild(star);
    }
    
    // 流れ星を生成（頻度を下げる）
    setInterval(() => {
        createShootingStar();
    }, 8000 + Math.random() * 7000);
}

// 流れ星生成
function createShootingStar() {
    const starsContainer = document.querySelector('.stars');
    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    shootingStar.style.left = Math.random() * 50 + '%';
    shootingStar.style.top = Math.random() * 50 + '%';
    starsContainer.appendChild(shootingStar);
    
    // 3秒後に削除
    setTimeout(() => {
        if (shootingStar.parentNode) {
            shootingStar.parentNode.removeChild(shootingStar);
        }
    }, 3000);
}

// 占い開始
function startFortune() {
    console.log('startFortune called');
    
    if (!heroSection || !fortuneSection) {
        console.error('Required sections not found');
        return;
    }
    
    heroSection.classList.add('hidden');
    fortuneSection.classList.remove('hidden');
    currentQuestionIndex = 0;
    userAnswers = [];
    
    // 音効果
    audioContext.playClick();
    
    showQuestion();
}

// 質問表示
function showQuestion() {
    console.log('Showing question', currentQuestionIndex + 1);
    const question = fortuneData.questions[currentQuestionIndex];
    
    if (!question) {
        console.error('Question not found for index', currentQuestionIndex);
        return;
    }
    
    // プログレスバー更新
    const progress = ((currentQuestionIndex + 1) / fortuneData.questions.length) * 100;
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    // プログレスバーのaria-valuenow属性を更新
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    if (currentQuestionSpan) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
    }
    
    // 質問内容表示
    if (questionTitle) {
        questionTitle.textContent = question.title;
    }
    if (answersContainer) {
        answersContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerButton = document.createElement('button');
            answerButton.className = 'answer-button';
            answerButton.textContent = answer.text;
            answerButton.setAttribute('role', 'radio');
            answerButton.setAttribute('aria-checked', 'false');
            answerButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
            answerButton.addEventListener('click', () => selectAnswer(answer.value));
            
            // キーボード操作対応
            answerButton.addEventListener('keydown', (e) => {
                handleAnswerKeydown(e, index);
            });
            
            // タッチジェスチャーの追加
            answerButton.addEventListener('touchstart', (e) => {
                answerButton.classList.add('touching');
                audioContext.playClick();
            }, { passive: true });
            
            answerButton.addEventListener('touchend', (e) => {
                answerButton.classList.remove('touching');
            }, { passive: true });
            
            // アニメーション用のディレイ
            answerButton.style.animationDelay = (index * 0.1) + 's';
            
            answersContainer.appendChild(answerButton);
        });
    }
}

// 回答ボタンのキーボード操作
function handleAnswerKeydown(event, currentIndex) {
    const buttons = document.querySelectorAll('.answer-button');
    let newIndex = currentIndex;
    
    switch(event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
            event.preventDefault();
            newIndex = (currentIndex + 1) % buttons.length;
            break;
        case 'ArrowUp':
        case 'ArrowLeft':
            event.preventDefault();
            newIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            break;
        case 'Enter':
        case ' ':
            event.preventDefault();
            event.target.click();
            return;
    }
    
    if (newIndex !== currentIndex) {
        buttons[currentIndex].setAttribute('tabindex', '-1');
        buttons[newIndex].setAttribute('tabindex', '0');
        buttons[newIndex].focus();
    }
}

// 回答選択
function selectAnswer(answerValue) {
    console.log('Answer selected:', answerValue);
    userAnswers.push(answerValue);
    audioContext.playClick();
    
    // 選択されたボタンのハイライト
    const buttons = document.querySelectorAll('.answer-button');
    buttons.forEach(btn => btn.style.pointerEvents = 'none');
    
    if (currentQuestionIndex < fortuneData.questions.length - 1) {
        currentQuestionIndex++;
        console.log('Moving to question', currentQuestionIndex + 1);
        // 即座に次の質問を表示（ローディングなし）
        setTimeout(() => {
            showQuestion();
        }, 100);
    } else {
        console.log('All questions answered, showing final result');
        // 最終結果は考えているような演出で表示
        showFinalLoading(() => {
            console.log('Final loading complete, showing result');
            showResult();
        });
    }
}

// ローディングアニメーション
function showLoadingAnimation(callback) {
    const container = document.getElementById('questionContainer');
    container.innerHTML = `
        <div class="loading-container">
            <div class="crystal-ball">
                <div class="crystal-shine"></div>
                <div class="crystal-reflection"></div>
            </div>
            <p class="loading-text">魂の声を聞いています...</p>
            <div class="loading-dots">
                <span>•</span><span>•</span><span>•</span>
            </div>
        </div>
    `;
    
    setTimeout(callback, 200);
}

// 最終結果ローディング
function showFinalLoading(callback) {
    const container = document.getElementById('questionContainer');
    container.innerHTML = `
        <div class="loading-container final-loading">
            <div class="mystical-circle">
                <div class="rotating-symbols">
                    <span>✨</span><span>🔮</span><span>⭐</span><span>🌙</span>
                </div>
            </div>
            <p id="finalLoadingText" class="loading-text">あなたの魂の声を読み取っています...</p>
            <div class="progress-ring">
                <div class="progress-ring-fill"></div>
            </div>
        </div>
    `;
    
    // 段階的にテキストを変更して考えている感を演出
    const messages = [
        "あなたの魂の声を読み取っています...",
        "宇宙からのメッセージを受信中...",
        "運命の糸を確認しています...",
        "過去・現在・未来を見通しています...",
        "エネルギーの流れを感じています...",
        "霊視結果をまとめています..."
    ];
    
    let messageIndex = 0;
    const textElement = document.getElementById('finalLoadingText');
    
    const updateMessage = () => {
        if (textElement && messageIndex < messages.length) {
            textElement.textContent = messages[messageIndex];
            messageIndex++;
        }
    };
    
    // 各メッセージを800msごとに表示（5秒で6メッセージ）
    const messageInterval = setInterval(updateMessage, 800);
    
    setTimeout(() => {
        clearInterval(messageInterval);
        callback();
    }, 5000);
}

// 結果表示
function showResult() {
    fortuneSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    // 魔法的な効果音
    audioContext.playMagic();
    
    // ランダム結果生成
    fortuneResult = generateRandomResult();
    
    // 基本結果表示
    document.getElementById('resultType').textContent = fortuneResult.type;
    document.getElementById('resultDescription').textContent = fortuneResult.description;
    document.getElementById('luckyColor').textContent = fortuneResult.color;
    document.getElementById('luckyNumber').textContent = fortuneResult.number;
    
    // 詳細情報がある場合は追加表示
    if (fortuneResult.compatibility) {
        addDetailedResult('相性の良い星座', fortuneResult.compatibility, '♋');
    }
    if (fortuneResult.advice) {
        addDetailedResult('アドバイス', fortuneResult.advice, '💡');
    }
    if (fortuneResult.warning) {
        addDetailedResult('注意点', fortuneResult.warning, '⚠️');
    }
    if (fortuneResult.timeline) {
        addDetailedResult('時期', fortuneResult.timeline, '📅');
    }
    
    // 結果表示アニメーション
    setTimeout(() => {
        document.querySelector('.result-card').classList.add('show');
    }, 300);
}

// 詳細情報を結果カードに追加
function addDetailedResult(label, content, icon) {
    const luckyItems = document.querySelector('.lucky-items');
    const detailItem = document.createElement('div');
    detailItem.className = 'lucky-item detail-item';
    detailItem.innerHTML = `
        <span class="lucky-label">${icon} ${label}:</span>
        <span class="lucky-value detail-value">${content}</span>
    `;
    luckyItems.appendChild(detailItem);
}

// ランダム結果生成
function generateRandomResult() {
    const elements = fortuneData.randomElements;
    
    // ランダム選択関数
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
    
    return {
        type: getRandomItem(elements.types),
        description: getRandomItem(elements.descriptions),
        color: getRandomItem(elements.colors),
        number: getRandomItem(elements.numbers),
        compatibility: getRandomItem(elements.compatibility),
        advice: getRandomItem(elements.advice),
        timeline: getRandomItem(elements.timelines)
    };
}

// LINE登録処理
function handleLineRegistration() {
    // 提供されたLINE友だち追加URL
    const lineUrl = "https://lin.ee/k7U3dgX";
    
    // トラッキング用のイベント送信
    if (typeof gtag !== 'undefined') {
        gtag('event', 'line_registration_attempt', {
            'event_category': 'conversion',
            'event_label': 'fortune_result'
        });
    }
    
    // LINE登録ページを新しいタブで開く
    window.open(lineUrl, '_blank');
    
    // 登録完了のメッセージ表示
    showRegistrationMessage();
}

// 登録完了メッセージ
function showRegistrationMessage() {
    const message = document.createElement('div');
    message.className = 'registration-message';
    message.innerHTML = `
        <div class="message-content">
            <h4>🎉 ありがとうございます！</h4>
            <p>LINE友だち追加後、詳しい占い結果をお送りします。<br>
            お楽しみにお待ちください✨</p>
        </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Twitter シェア
function shareTwitter() {
    const text = `神秘の占い館で占いました！私の結果は「${fortuneResult.type}」✨ あなたも運命を占ってみませんか？`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

// 占い再開始
function restartFortune() {
    resultSection.classList.add('hidden');
    heroSection.classList.remove('hidden');
    currentQuestionIndex = 0;
    userAnswers = [];
    fortuneResult = null;
    
    // 詳細結果をクリア
    const luckyItems = document.querySelector('.lucky-items');
    if (luckyItems) {
        const detailItems = luckyItems.querySelectorAll('.detail-item');
        detailItems.forEach(item => item.remove());
    }
}

// ページアンロード時のクリーンアップ
window.addEventListener('beforeunload', () => {
    if (audioContext && audioContext.destroy) {
        audioContext.destroy();
    }
});

})(); // IIFE終了