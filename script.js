// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

// 幻灯片总数
const totalSlides = 8;
let currentSlide = 0;
let isScrolling = false;

// 初始化导航点
function initNavDots() {
    const navDotsContainer = document.querySelector('.nav-dots');
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        navDotsContainer.appendChild(dot);
    }
}

// 更新导航点状态
function updateNavDots(index) {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 跳转到指定幻灯片
function goToSlide(index) {
    if (index < 0 || index >= totalSlides || isScrolling) return;
    
    isScrolling = true;
    currentSlide = index;
    
    const slides = document.querySelectorAll('.slide');
    slides[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    updateNavDots(index);
    
    // 隐藏滚动提示（第一页后）
    if (index > 0) {
        document.querySelector('.scroll-hint').style.opacity = '0';
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// 处理滚动事件
function handleScroll() {
    if (isScrolling) return;
    
    const slides = document.querySelectorAll('.slide');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    slides.forEach((slide, index) => {
        const slideTop = slide.offsetTop;
        const slideBottom = slideTop + slide.offsetHeight;
        
        if (scrollPosition >= slideTop && scrollPosition < slideBottom) {
            if (currentSlide !== index) {
                currentSlide = index;
                updateNavDots(index);
                
                // 隐藏滚动提示（第一页后）
                if (index > 0) {
                    document.querySelector('.scroll-hint').style.opacity = '0';
                } else {
                    document.querySelector('.scroll-hint').style.opacity = '1';
                }
            }
        }
    });
}

// 处理键盘事件
function handleKeyPress(e) {
    if (isScrolling) return;
    
    switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            if (currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            }
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides - 1);
            break;
    }
}

// 处理鼠标滚轮事件（防止快速滚动）
let wheelTimeout;
function handleWheel(e) {
    clearTimeout(wheelTimeout);
    
    wheelTimeout = setTimeout(() => {
        if (!isScrolling) {
            const delta = e.deltaY;
            const slides = document.querySelectorAll('.slide');
            const currentSlideElement = slides[currentSlide];
            const scrollPosition = window.scrollY;
            const slideTop = currentSlideElement.offsetTop;
            const slideBottom = slideTop + currentSlideElement.offsetHeight;
            
            // 检查是否在幻灯片边界
            if (delta > 0 && scrollPosition + window.innerHeight >= slideBottom - 10) {
                // 向下滚动，到达底部，切换到下一张
                if (currentSlide < totalSlides - 1) {
                    goToSlide(currentSlide + 1);
                }
            } else if (delta < 0 && scrollPosition <= slideTop + 10) {
                // 向上滚动，到达顶部，切换到上一张
                if (currentSlide > 0) {
                    goToSlide(currentSlide - 1);
                }
            }
        }
    }, 100);
}

// 触摸事件处理（移动端）
let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold && !isScrolling) {
        if (diff > 0) {
            // 向上滑动，下一张
            if (currentSlide < totalSlides - 1) {
                goToSlide(currentSlide + 1);
            }
        } else {
            // 向下滑动，上一张
            if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
    }
}


// GSAP 动画初始化
function initGSAPAnimations() {
    // 封面页动画
    const tl1 = gsap.timeline();
    tl1.from('.slide-1 .figma-background-image', {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: 'power2.out'
    })
    .from('.slide-1 .image-overlay', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=1')
    .from('.slide-1 .glass-container', {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.slide-1 .main-title', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.slide-1 .subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.slide-1 .info-item', {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.8,
        ease: 'back.out(1.7)'
    }, '-=0.4')
    .from('.slide-1 .mountain-bg', {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power2.out'
    }, '-=1');

    // 四象限卡片动画 - 更丰富的动画效果
    gsap.utils.toArray('.slide-2 .quarter-card').forEach((card, index) => {
        // 先设置初始可见状态
        gsap.set(card, { opacity: 1, visibility: 'visible', y: 0, scale: 1, rotation: 0 });
        
        // 卡片进入动画
        const cardAnim = gsap.from(card, {
            opacity: 0,
            y: 80,
            scale: 0.8,
            rotation: -5,
            duration: 1,
            delay: index * 0.2,
            ease: 'back.out(1.7)',
            immediateRender: false,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(card, { opacity: 1, visibility: 'visible' });
                }
            }
        });
        
        // 卡片内容依次出现
        const title = card.querySelector('.quarter-card-title');
        const icon = card.querySelector('.quarter-card-icon');
        const text = card.querySelector('.quarter-card-text');
        const letter = card.querySelector('.quarter-letter');
        
        // 确保所有元素初始可见
        if (title) gsap.set(title, { opacity: 1, visibility: 'visible', x: 0 });
        if (icon) gsap.set(icon, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
        if (text) gsap.set(text, { opacity: 1, visibility: 'visible', y: 0 });
        if (letter) gsap.set(letter, { opacity: 1, visibility: 'visible', scale: 1 });
        
        // 检查卡片是否已经在视口中
        const cardRect = card.getBoundingClientRect();
        const isCardVisible = cardRect.top < window.innerHeight && cardRect.bottom > 0;
        
        if (title) {
            gsap.from(title, {
                opacity: 0,
                x: -30,
                duration: 0.6,
                delay: index * 0.2 + 0.3,
                ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(title, { opacity: 1, visibility: 'visible', x: 0 });
                    }
                }
            });
            if (isCardVisible) {
                gsap.set(title, { opacity: 1, visibility: 'visible', x: 0 });
            }
        }
        
        if (icon) {
            gsap.from(icon, {
                opacity: 0,
                scale: 0,
                rotation: 180,
                duration: 0.8,
                delay: index * 0.2 + 0.4,
                ease: 'back.out(1.7)',
                immediateRender: false,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(icon, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
                    }
                }
            });
            if (isCardVisible) {
                gsap.set(icon, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
            }
        }
        
        if (text) {
            gsap.from(text, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: index * 0.2 + 0.5,
                ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(text, { opacity: 1, visibility: 'visible', y: 0 });
                    }
                }
            });
            if (isCardVisible) {
                gsap.set(text, { opacity: 1, visibility: 'visible', y: 0 });
            }
        }
        
        if (letter) {
            gsap.from(letter, {
                opacity: 0,
                scale: 0.5,
                duration: 1.2,
                delay: index * 0.2 + 0.2,
                ease: 'power2.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(letter, { opacity: 1, visibility: 'visible', scale: 1 });
                    }
                }
            });
            if (isCardVisible) {
                gsap.set(letter, { opacity: 1, visibility: 'visible', scale: 1 });
            }
        }
        
        // 悬停动画
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                rotation: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(icon, {
                rotation: 360,
                scale: 1.1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(icon, {
                rotation: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        // 如果元素已经在视口中，立即显示
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            gsap.set(card, { opacity: 1, visibility: 'visible', y: 0, scale: 1, rotation: 0 });
        }
    });

    // 所有标题动画（排除第二页，因为第二页有特殊处理）
    gsap.utils.toArray('.section-title, .thank-title').forEach(title => {
        if (!title.closest('.slide-2')) {
            gsap.from(title, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });

    // 第二页标题动画 - 更丰富的效果
    const slide2Title = document.querySelector('.slide-2 .section-title');
    if (slide2Title) {
        // 确保标题始终可见
        gsap.set(slide2Title, { opacity: 1, visibility: 'visible', y: 0, scale: 1 });
        
        // 标题动画 - 从上方飞入
        gsap.from(slide2Title, {
            opacity: 0,
            y: -50,
            scale: 0.9,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: '.slide-2',
                start: 'top 80%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(slide2Title, { opacity: 1, visibility: 'visible' });
                }
            }
        });
        
        // 如果标题已经在视口中，立即显示
        const rect = slide2Title.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            gsap.set(slide2Title, { opacity: 1, visibility: 'visible', y: 0, scale: 1 });
        }
    }


    // 第三页右上角文字动画
    const cornerText = document.querySelector('.slide-3-corner-text');
    if (cornerText) {
        // 确保文字容器始终可见
        cornerText.style.opacity = '1';
        cornerText.style.visibility = 'visible';
        gsap.set(cornerText, { opacity: 1, visibility: 'visible', x: 0, y: 0 });
        
        // 保存原始文本
        const text = cornerText.textContent.trim();
        cornerText.textContent = '';
        
        // 创建字符span并设置初始状态
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(30px)';
            cornerText.appendChild(span);
        });
        
        // 整体从右侧滑入
        gsap.from(cornerText, {
            x: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: '.slide-3',
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(cornerText, { opacity: 1, visibility: 'visible', x: 0 });
                }
            }
        });
        
        // 字符逐个出现动画
        const spans = cornerText.querySelectorAll('span');
        spans.forEach((span, i) => {
            gsap.to(span, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.5 + i * 0.1,
                ease: 'back.out(1.7)',
                immediateRender: false,
                scrollTrigger: {
                    trigger: '.slide-3',
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(span, { opacity: 1, y: 0 });
                    }
                }
            });
        });
        
        // 持续浮动动画（延迟启动）
        gsap.to(cornerText, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: 3
        });
        
        // 检查是否已经在视口中
        setTimeout(() => {
            const rect = cornerText.getBoundingClientRect();
            const slide3Rect = document.querySelector('.slide-3')?.getBoundingClientRect();
            if (slide3Rect && slide3Rect.top < window.innerHeight && slide3Rect.bottom > 0) {
                gsap.set(cornerText, { opacity: 1, visibility: 'visible', x: 0, y: 0 });
                spans.forEach((span, i) => {
                    setTimeout(() => {
                        gsap.set(span, { opacity: 1, y: 0 });
                    }, 500 + i * 100);
                });
            }
        }, 100);
    }

    // 关键指标页动画
    gsap.utils.toArray('.slide-3 .metric-card').forEach((card, index) => {
        // 确保卡片初始可见
        gsap.set(card, { opacity: 1, visibility: 'visible', y: 0, scale: 1, rotation: 0 });
        
        // 检查卡片是否已经在视口中
        const cardRect = card.getBoundingClientRect();
        const isCardVisible = cardRect.top < window.innerHeight && cardRect.bottom > 0;
        
        // 如果已经在视口中，立即显示
        if (isCardVisible) {
            gsap.set(card, { opacity: 1, visibility: 'visible', y: 0, scale: 1, rotation: 0 });
        }
        
        // 卡片进入动画
        gsap.from(card, {
            opacity: 0,
            y: 80,
            scale: 0.8,
            rotation: -5,
            duration: 1,
            delay: index * 0.2,
            ease: 'back.out(1.7)',
            immediateRender: false,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(card, { opacity: 1, visibility: 'visible', y: 0, scale: 1, rotation: 0 });
                }
            }
        });

        // SVG图标动画
        const icon = card.querySelector('.metric-icon');
        if (icon) {
            // 确保图标初始可见
            gsap.set(icon, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
            
            const svg = icon.querySelector('svg');
            if (svg) {
                const paths = svg.querySelectorAll('path');
                paths.forEach((path, pathIndex) => {
                    const pathLength = path.getTotalLength();
                    if (pathLength > 0) {
                        path.style.strokeDasharray = pathLength;
                        path.style.strokeDashoffset = pathLength;
                        
                        gsap.to(path, {
                            strokeDashoffset: 0,
                            duration: 1.5,
                            delay: index * 0.2 + 0.3 + pathIndex * 0.1,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                                toggleActions: 'play none none none'
                            }
                        });
                    }
                });
                
                // 图标整体动画
                gsap.from(icon, {
                    opacity: 0,
                    scale: 0,
                    rotation: 180,
                    duration: 1,
                    delay: index * 0.2 + 0.2,
                    ease: 'back.out(1.7)',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        onEnter: () => {
                            gsap.set(icon, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
                        }
                    }
                });
                
                if (isCardVisible) {
                    gsap.set(icon, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
                }
            }
        }

        // 数字/标题动画
        const numberEl = card.querySelector('.metric-number');
        if (numberEl) {
            gsap.set(numberEl, { opacity: 1, visibility: 'visible', y: 0, scale: 1 });
            
            gsap.from(numberEl, {
                opacity: 0,
                y: 30,
                scale: 0.8,
                duration: 0.8,
                delay: index * 0.2 + 0.4,
                ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(numberEl, { opacity: 1, visibility: 'visible', y: 0, scale: 1 });
                    }
                }
            });
            
            if (isCardVisible) {
                gsap.set(numberEl, { opacity: 1, visibility: 'visible', y: 0, scale: 1 });
            }
        }

        // 标签动画
        const labelEl = card.querySelector('.metric-label');
        if (labelEl) {
            gsap.set(labelEl, { opacity: 1, visibility: 'visible', y: 0 });
            
            gsap.from(labelEl, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                delay: index * 0.2 + 0.5,
                ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(labelEl, { opacity: 1, visibility: 'visible', y: 0 });
                    }
                }
            });
            
            if (isCardVisible) {
                gsap.set(labelEl, { opacity: 1, visibility: 'visible', y: 0 });
            }
        }

        // 进度条动画
        const progressFill = card.querySelector('.progress-fill');
        if (progressFill) {
            const width = progressFill.style.width;
            gsap.from(progressFill, {
                width: '0%',
                duration: 1.5,
                delay: index * 0.2 + 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        }

        // 悬停动画
        card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                rotation: 360,
                scale: 1.1,
                duration: 0.6,
                ease: 'back.out(1.7)'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                rotation: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        // 如果元素已经在视口中，立即显示
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            gsap.set(card, { opacity: 1, visibility: 'visible', y: 0, scale: 1, rotation: 0 });
        }
    });

    // 数字计数动画
    function animateNumber(element, targetValue, suffix = '') {
        const obj = { value: 0 };
        const originalText = element.textContent;
        const isDecimal = originalText.includes('.');
        
        gsap.to(obj, {
            value: targetValue,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                if (suffix === '%') {
                    if (isDecimal) {
                        element.textContent = obj.value.toFixed(1) + suffix;
                    } else {
                        element.textContent = Math.round(obj.value) + suffix;
                    }
                } else {
                    if (isDecimal) {
                        element.textContent = obj.value.toFixed(1) + suffix;
                    } else {
                        element.textContent = Math.round(obj.value) + suffix;
                    }
                }
            },
            scrollTrigger: {
                trigger: element.closest('.slide'),
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    // 第四页协作动画
    const slide4Card = document.querySelector('.slide-4 .collaboration-card');
    if (slide4Card) {
        gsap.set(slide4Card, { opacity: 1, visibility: 'visible', y: 0 });
        
        // 卡片整体动画
        gsap.from(slide4Card, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 1,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: '.slide-4',
                start: 'top 80%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(slide4Card, { opacity: 1, visibility: 'visible', y: 0, scale: 1 });
                }
            }
        });
        
        // 内容区域动画
        const content = slide4Card.querySelector('.collaboration-content');
        if (content) {
            gsap.from(content, {
                opacity: 0,
                x: -30,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: '.slide-4',
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(content, { opacity: 1, visibility: 'visible', x: 0 });
                    }
                }
            });
        }
        
        // 协作要点动画
        const collaborationPoints = slide4Card.querySelectorAll('.collaboration-point');
        collaborationPoints.forEach((item, index) => {
            gsap.from(item, {
                opacity: 0,
                x: -30,
                duration: 0.7,
                delay: 0.4 + index * 0.15,
                ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: '.slide-4',
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
                    }
                }
            });
            
            // 图标旋转动画
            const icon = item.querySelector('.point-icon');
            if (icon) {
                gsap.from(icon, {
                    rotation: -180,
                    scale: 0,
                    duration: 0.6,
                    delay: 0.5 + index * 0.15,
                    ease: 'back.out(1.7)',
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: '.slide-4',
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                        onEnter: () => {
                            gsap.set(icon, { rotation: 0, scale: 1 });
                        }
                    }
                });
            }
        });
        
        // 图片示例动画
        const imageExample = slide4Card.querySelector('.collaboration-image-example');
        if (imageExample) {
            gsap.from(imageExample, {
                opacity: 0,
                x: 30,
                scale: 0.9,
                duration: 0.8,
                delay: 0.3,
                ease: 'power3.out',
                immediateRender: false,
                scrollTrigger: {
                    trigger: '.slide-4',
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(imageExample, { opacity: 1, visibility: 'visible', x: 0, scale: 1 });
                    }
                }
            });
        }
    }

    const slide4Subtitle = document.querySelector('.slide-4 .section-subtitle');
    if (slide4Subtitle) {
        gsap.set(slide4Subtitle, { opacity: 1, visibility: 'visible', y: 0 });
        
        gsap.from(slide4Subtitle, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: '.slide-4',
                start: 'top 80%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(slide4Subtitle, { opacity: 1, visibility: 'visible', y: 0 });
                }
            }
        });
    }

    // 第五页产品体验问题动画
    gsap.utils.toArray('.slide-5 .feature-item').forEach((item, index) => {
        // 确保元素初始可见
        gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
        
        const icon = item.querySelector('.feature-icon');
        if (icon) {
            gsap.set(icon, { opacity: 1, visibility: 'visible', rotation: 0, scale: 1 });
        }
        
        // 检查是否已经在视口中
        const itemRect = item.getBoundingClientRect();
        const isItemVisible = itemRect.top < window.innerHeight && itemRect.bottom > 0;
        
        if (isItemVisible) {
            gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
            if (icon) {
                gsap.set(icon, { opacity: 1, visibility: 'visible', rotation: 0, scale: 1 });
            }
        }
        
        // 卡片进入动画
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
                }
            }
        });

        // 图标旋转动画
        if (icon) {
            gsap.from(icon, {
                rotation: -180,
                scale: 0,
                duration: 0.8,
                delay: index * 0.15,
                ease: 'back.out(1.7)',
                immediateRender: false,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(icon, { opacity: 1, visibility: 'visible', rotation: 0, scale: 1 });
                    }
                }
            });
        }
    });

    // 第六页交互体验方法动画
    const slide6Subtitle = document.querySelector('.slide-6 .section-subtitle');
    if (slide6Subtitle) {
        gsap.set(slide6Subtitle, { opacity: 1, visibility: 'visible', y: 0 });
        
        gsap.from(slide6Subtitle, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: '.slide-6',
                start: 'top 80%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(slide6Subtitle, { opacity: 1, visibility: 'visible', y: 0 });
                }
            }
        });
    }

    gsap.utils.toArray('.slide-6 .method-item').forEach((item, index) => {
        // 确保元素初始可见
        gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
        
        const number = item.querySelector('.method-number');
        if (number) {
            gsap.set(number, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
        }
        
        // 检查是否已经在视口中
        const itemRect = item.getBoundingClientRect();
        const isItemVisible = itemRect.top < window.innerHeight && itemRect.bottom > 0;
        
        if (isItemVisible) {
            gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
            if (number) {
                gsap.set(number, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
            }
        }
        
        // 卡片进入动画
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
                }
            }
        });

        // 数字旋转动画
        if (number) {
            gsap.from(number, {
                rotation: -180,
                scale: 0,
                duration: 0.8,
                delay: index * 0.2,
                ease: 'back.out(1.7)',
                immediateRender: false,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(number, { opacity: 1, visibility: 'visible', rotation: 0, scale: 1 });
                    }
                }
            });
        }
    });

    // 结论文字动画
    const methodConclusion = document.querySelector('.slide-6 .method-conclusion');
    if (methodConclusion) {
        gsap.set(methodConclusion, { opacity: 1, visibility: 'visible', y: 0 });
        
        gsap.from(methodConclusion, {
            opacity: 0,
            y: 30,
            scale: 0.9,
            duration: 1,
            ease: 'back.out(1.7)',
            immediateRender: false,
            scrollTrigger: {
                trigger: '.slide-6',
                start: 'top 70%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(methodConclusion, { opacity: 1, visibility: 'visible', y: 0, scale: 1 });
                }
            }
        });
    }

    // 进度数字动画
    const progressText = document.querySelector('.slide-5 .progress-text');
    if (progressText) {
        animateNumber(progressText, 88, '%');
    }

    gsap.utils.toArray('.slide-5 .task-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            scale: 0.8,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });

    // 数据统计页动画
    // 第七页已经在做或计划在做的事情动画
    gsap.utils.toArray('.slide-7 .feature-item').forEach((item, index) => {
        // 确保元素初始可见
        gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
        
        const icon = item.querySelector('.feature-icon');
        if (icon) {
            gsap.set(icon, { opacity: 1, visibility: 'visible', rotation: 0, scale: 1 });
        }
        
        // 检查是否已经在视口中
        const itemRect = item.getBoundingClientRect();
        const isItemVisible = itemRect.top < window.innerHeight && itemRect.bottom > 0;
        
        if (isItemVisible) {
            gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
            if (icon) {
                gsap.set(icon, { opacity: 1, visibility: 'visible', rotation: 0, scale: 1 });
            }
        }
        
        // 卡片进入动画
        gsap.from(item, {
            opacity: 0,
            x: -50,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none',
                onEnter: () => {
                    gsap.set(item, { opacity: 1, visibility: 'visible', x: 0 });
                }
            }
        });

        // 图标旋转动画
        if (icon) {
            gsap.from(icon, {
                rotation: -180,
                scale: 0,
                duration: 0.8,
                delay: index * 0.15,
                ease: 'back.out(1.7)',
                immediateRender: false,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        gsap.set(icon, { opacity: 1, visibility: 'visible', rotation: 0, scale: 1 });
                    }
                }
            });
        }
    });

    // 旧的统计卡片动画（已废弃）
    gsap.utils.toArray('.slide-6 .stat-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            scale: 0.8,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // 数字动画
        const numberEl = card.querySelector('.stat-number');
        if (numberEl) {
            const targetValue = parseFloat(numberEl.textContent);
            animateNumber(numberEl, targetValue);
        }
    });

    // 结束页动画
    gsap.from('.slide-8 .thank-title', {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.slide-8',
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });

    // 滚动提示动画
    gsap.to('.scroll-arrow', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initNavDots();
    
    // 确保第二页内容初始可见
    const slide2Cards = document.querySelectorAll('.slide-2 .quarter-card');
    const slide2Title = document.querySelector('.slide-2 .section-title');
    const slide2Content = document.querySelector('.slide-2 .content-section');
    
    if (slide2Cards.length > 0) {
        slide2Cards.forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
        });
    }
    
    if (slide2Title) {
        slide2Title.style.opacity = '1';
        slide2Title.style.visibility = 'visible';
    }
    
    if (slide2Content) {
        slide2Content.style.opacity = '1';
        slide2Content.style.visibility = 'visible';
    }
    
    initGSAPAnimations();
    
    // 事件监听
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    document.addEventListener('keydown', handleKeyPress);
    
    // 触摸事件（移动端）
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // 初始隐藏滚动提示（如果不在第一页）
    if (window.scrollY > 100) {
        document.querySelector('.scroll-hint').style.opacity = '0';
    }
});

// 平滑滚动到顶部（刷新时）
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

