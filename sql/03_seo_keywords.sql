-- ============================================================
-- 03_seo_keywords: 关键词库 INSERT
-- 目标站点: toy, ~200个关键词, 26个话题集群
-- ============================================================

INSERT INTO `seo_keyword_library` (`site_id`, `keyword`, `volume`, `kd`, `intent`, `category`, `topic`, `status`) VALUES

-- ==================== WAND 按摩棒 ====================
('toy', 'wand vibrator', 6600, 49, 'C', 'core', 'WAND', 0),
('toy', 'wand massager', 4400, 42, 'C', 'core', 'WAND', 0),
('toy', 'best wand vibrator', 2400, 38, 'C', 'core', 'WAND', 0),
('toy', 'magic wand massager', 1800, 45, 'C', 'long_tail', 'WAND', 0),
('toy', 'cordless wand vibrator', 880, 28, 'C', 'long_tail', 'WAND', 0),
('toy', 'mini wand massager', 590, 25, 'C', 'long_tail', 'WAND', 0),
('toy', 'how to use a wand massager', 1200, 22, 'I', 'long_tail', 'WAND', 0),
('toy', 'wand vibrator vs bullet vibrator', 320, 18, 'I', 'long_tail', 'WAND', 0),
('toy', 'best cordless wand massager', 480, 24, 'C', 'long_tail', 'WAND', 0),
('toy', 'most quiet wand vibrator', 260, 20, 'C', 'long_tail', 'WAND', 0),
('toy', 'best mini wand massager for travel', 210, 15, 'C', 'long_tail', 'WAND', 0),
('toy', 'best waterproof wand vibrator', 320, 22, 'C', 'long_tail', 'WAND', 0),
('toy', 'best rechargeable wand massager', 390, 24, 'C', 'long_tail', 'WAND', 0),
('toy', 'how to clean a wand massager', 480, 18, 'I', 'long_tail', 'WAND', 0),
('toy', 'wand massager for women', 720, 32, 'C', 'long_tail', 'WAND', 0),
('toy', 'wand massager for couples', 260, 22, 'C', 'long_tail', 'WAND', 0),
('toy', 'best wand massager for clitoral stimulation', 390, 28, 'C', 'long_tail', 'WAND', 0),
('toy', 'silicone head wand vibrator', 210, 18, 'C', 'long_tail', 'WAND', 0),
('toy', 'plug in vs rechargeable wand vibrator', 140, 12, 'I', 'long_tail', 'WAND', 0),
('toy', 'wand massager with variable speed', 170, 15, 'C', 'long_tail', 'WAND', 0),

-- ==================== BULLET 跳蛋/迷你震动器 ====================
('toy', 'bullet vibrator', 14800, 32, 'C', 'core', 'BULLET', 0),
('toy', 'best bullet vibrator', 1600, 27, 'C', 'core', 'BULLET', 0),
('toy', 'mini bullet vibrator', 590, 30, 'C', 'long_tail', 'BULLET', 0),
('toy', 'egg vibrator', 3600, 30, 'C', 'long_tail', 'BULLET', 0),
('toy', 'remote bullet vibrator', 390, 17, 'C', 'long_tail', 'BULLET', 0),
('toy', 'discreet bullet vibrator', 480, 22, 'C', 'long_tail', 'BULLET', 0),
('toy', 'how to use a bullet vibrator', 1000, 22, 'I', 'long_tail', 'BULLET', 0),
('toy', 'bullet vibrator vs egg vibrator', 210, 14, 'I', 'long_tail', 'BULLET', 0),
('toy', 'best discreet bullet vibrator for travel', 170, 12, 'C', 'long_tail', 'BULLET', 0),
('toy', 'strongest mini bullet vibrator', 260, 18, 'C', 'long_tail', 'BULLET', 0),
('toy', 'best remote control bullet vibrator', 210, 15, 'C', 'long_tail', 'BULLET', 0),
('toy', 'best rechargeable bullet vibrator', 320, 20, 'C', 'long_tail', 'BULLET', 0),
('toy', 'best bullet vibrator for beginners', 390, 22, 'C', 'long_tail', 'BULLET', 0),
('toy', 'bullet vibrator for clitoral stimulation', 260, 20, 'C', 'long_tail', 'BULLET', 0),
('toy', 'how to clean a bullet vibrator', 390, 15, 'I', 'long_tail', 'BULLET', 0),
('toy', 'bullet vibrator for women', 480, 29, 'C', 'long_tail', 'BULLET', 0),

-- ==================== RABBIT 兔形震动器 ====================
('toy', 'rabbit vibrator', 1900, 46, 'C', 'core', 'RABBIT', 0),
('toy', 'best rabbit vibrator', 1300, 40, 'C', 'core', 'RABBIT', 0),
('toy', 'dual stimulator vibrator', 480, 32, 'C', 'long_tail', 'RABBIT', 0),
('toy', 'what is a rabbit vibrator', 260, 36, 'I', 'long_tail', 'RABBIT', 0),
('toy', 'rabbit vibrator for beginners', 320, 28, 'C', 'long_tail', 'RABBIT', 0),
('toy', 'thrusting rabbit vibrator', 390, 30, 'C', 'long_tail', 'RABBIT', 0),
('toy', 'rotating rabbit vibrator', 320, 26, 'C', 'long_tail', 'RABBIT', 0),
('toy', 'thrusting vs rotating rabbit vibrator', 90, 12, 'I', 'long_tail', 'RABBIT', 0),
('toy', 'rabbit vs g-spot vibrator', 110, 14, 'I', 'long_tail', 'RABBIT', 0),
('toy', 'best rabbit vibrator for g-spot stimulation', 170, 18, 'C', 'long_tail', 'RABBIT', 0),

-- ==================== G-SPOT G点震动器 ====================
('toy', 'g-spot vibrator', 3200, 38, 'C', 'core', 'GSPOT', 0),
('toy', 'best g-spot vibrator', 1200, 34, 'C', 'core', 'GSPOT', 0),
('toy', 'how to use a g-spot vibrator', 880, 24, 'I', 'long_tail', 'GSPOT', 0),
('toy', 'how to find g-spot', 4400, 32, 'I', 'long_tail', 'GSPOT', 0),
('toy', 'g-spot orgasm techniques', 720, 26, 'I', 'long_tail', 'GSPOT', 0),
('toy', 'g-spot vibrator for beginners', 480, 22, 'C', 'long_tail', 'GSPOT', 0),
('toy', 'g-spot vibrator vs rabbit vibrator', 140, 14, 'I', 'long_tail', 'GSPOT', 0),

-- ==================== SONIC 声波/脉冲 ====================
('toy', 'sonic vibrator', 720, 28, 'C', 'core', 'SONIC', 0),
('toy', 'clitoral suction vibrator', 1600, 32, 'C', 'core', 'SONIC', 0),
('toy', 'sonic waves vs vibration', 260, 18, 'I', 'long_tail', 'SONIC', 0),
('toy', 'air pulse vibrator', 880, 26, 'C', 'long_tail', 'SONIC', 0),
('toy', 'best suction vibrator', 480, 22, 'C', 'long_tail', 'SONIC', 0),
('toy', 'sonic clitoral stimulator', 320, 20, 'C', 'long_tail', 'SONIC', 0),
('toy', 'does sonic vibrator feel different', 170, 12, 'I', 'long_tail', 'SONIC', 0),

-- ==================== DILDO 假阳具 ====================
('toy', 'realistic dildo', 5400, 41, 'C', 'core', 'DILDO', 0),
('toy', 'best realistic dildos', 1200, 35, 'C', 'core', 'DILDO', 0),
('toy', 'dildo wholesale', 1200, 35, 'C', 'core', 'DILDO', 0),
('toy', 'how to choose your first dildo', 880, 24, 'I', 'long_tail', 'DILDO', 0),
('toy', 'silicone dildo', 3200, 38, 'C', 'long_tail', 'DILDO', 0),
('toy', 'glass dildo', 2400, 32, 'C', 'long_tail', 'DILDO', 0),
('toy', 'metal dildo', 720, 24, 'C', 'long_tail', 'DILDO', 0),
('toy', 'silicone vs glass vs metal dildo', 320, 18, 'I', 'long_tail', 'DILDO', 0),
('toy', 'suction cup dildo', 4800, 35, 'C', 'long_tail', 'DILDO', 0),
('toy', 'best suction cup dildo hands free', 880, 28, 'C', 'long_tail', 'DILDO', 0),
('toy', 'how to use a suction cup dildo', 480, 18, 'I', 'long_tail', 'DILDO', 0),

-- ==================== MALE 男性自慰器 ====================
('toy', 'male masturbator', 8600, 39, 'C', 'core', 'MALE', 0),
('toy', 'best male masturbator', 2400, 35, 'C', 'core', 'MALE', 0),
('toy', 'pocket pussy', 7200, 38, 'C', 'core', 'MALE', 0),
('toy', 'automatic male masturbator', 1600, 32, 'C', 'long_tail', 'MALE', 0),
('toy', 'best male masturbator for beginners', 480, 20, 'C', 'long_tail', 'MALE', 0),
('toy', 'how to clean a male masturbator', 1600, 22, 'I', 'long_tail', 'MALE', 0),
('toy', 'death grip syndrome', 2600, 24, 'I', 'long_tail', 'MALE', 0),
('toy', 'how to fix death grip', 1300, 22, 'I', 'long_tail', 'MALE', 0),
('toy', 'automatic vs manual male masturbator', 260, 15, 'I', 'long_tail', 'MALE', 0),
('toy', 'electric masturbator cup', 720, 26, 'C', 'long_tail', 'MALE', 0),
('toy', 'blowjob masturbator', 3200, 34, 'C', 'long_tail', 'MALE', 0),

-- ==================== COCKRING 阴茎环 ====================
('toy', 'cock ring', 12000, 44, 'C', 'core', 'COCKRING', 0),
('toy', 'best cock ring', 2400, 36, 'C', 'core', 'COCKRING', 0),
('toy', 'vibrating cock ring', 3200, 34, 'C', 'long_tail', 'COCKRING', 0),
('toy', 'how to use a cock ring', 2600, 24, 'I', 'long_tail', 'COCKRING', 0),
('toy', 'cock ring for stamina', 720, 22, 'C', 'long_tail', 'COCKRING', 0),
('toy', 'silicone cock ring', 1600, 30, 'C', 'long_tail', 'COCKRING', 0),
('toy', 'adjustable cock ring', 880, 24, 'C', 'long_tail', 'COCKRING', 0),
('toy', 'vibrating cock ring for couples', 480, 20, 'C', 'long_tail', 'COCKRING', 0),
('toy', 'cock ring for edging', 320, 16, 'C', 'long_tail', 'COCKRING', 0),
('toy', 'cock ring safety tips', 260, 14, 'I', 'long_tail', 'COCKRING', 0),

-- ==================== PROSTATE 前列腺 ====================
('toy', 'prostate massager', 7200, 38, 'C', 'core', 'PROSTATE', 0),
('toy', 'best prostate massager', 2400, 34, 'C', 'core', 'PROSTATE', 0),
('toy', 'prostate massage benefits', 880, 24, 'I', 'long_tail', 'PROSTATE', 0),
('toy', 'p-spot guide for beginners', 480, 18, 'I', 'long_tail', 'PROSTATE', 0),
('toy', 'how to use prostate massager', 1600, 24, 'I', 'long_tail', 'PROSTATE', 0),
('toy', 'prostate health massage', 590, 22, 'I', 'long_tail', 'PROSTATE', 0),
('toy', 'best prostate vibrator', 880, 28, 'C', 'long_tail', 'PROSTATE', 0),
('toy', 'remote control prostate massager', 320, 18, 'C', 'long_tail', 'PROSTATE', 0),

-- ==================== ANAL 肛塞/后庭 ====================
('toy', 'butt plug', 18000, 51, 'C', 'core', 'ANAL', 0),
('toy', 'best butt plug for beginners', 2400, 34, 'C', 'core', 'ANAL', 0),
('toy', 'silicone butt plug', 3200, 36, 'C', 'long_tail', 'ANAL', 0),
('toy', 'how to use a butt plug', 3600, 28, 'I', 'long_tail', 'ANAL', 0),
('toy', 'anal training kit', 1600, 28, 'C', 'long_tail', 'ANAL', 0),
('toy', 'tail butt plug', 2400, 30, 'C', 'long_tail', 'ANAL', 0),
('toy', 'fox tail plug', 880, 22, 'C', 'long_tail', 'ANAL', 0),
('toy', 'inflatable butt plug', 720, 24, 'C', 'long_tail', 'ANAL', 0),
('toy', 'vibrating butt plug', 3200, 34, 'C', 'long_tail', 'ANAL', 0),
('toy', 'jeweled butt plug', 1600, 28, 'C', 'long_tail', 'ANAL', 0),
('toy', 'butt plug safety guide', 480, 16, 'I', 'long_tail', 'ANAL', 0),

-- ==================== KEGEL 凯格尔/盆底肌 ====================
('toy', 'kegel exercises', 12000, 38, 'I', 'core', 'KEGEL', 0),
('toy', 'kegel exercises for women', 3200, 32, 'I', 'core', 'KEGEL', 0),
('toy', 'pelvic floor trainer', 2400, 30, 'C', 'core', 'KEGEL', 0),
('toy', 'best pelvic floor trainer', 720, 24, 'C', 'long_tail', 'KEGEL', 0),
('toy', 'kegel weights', 3200, 30, 'C', 'long_tail', 'KEGEL', 0),
('toy', 'benefits of kegel exercises', 880, 22, 'I', 'long_tail', 'KEGEL', 0),
('toy', 'how to do kegel exercises correctly', 1600, 24, 'I', 'long_tail', 'KEGEL', 0),
('toy', 'kegel trainer app', 480, 18, 'C', 'long_tail', 'KEGEL', 0),
('toy', 'pelvic floor exercises for men', 590, 22, 'I', 'long_tail', 'KEGEL', 0),

-- ==================== ORGASM 高潮/性健康 ====================
('toy', 'how to achieve female orgasm', 4800, 32, 'I', 'core', 'ORGASM', 0),
('toy', 'female orgasm guide', 2400, 30, 'I', 'core', 'ORGASM', 0),
('toy', 'best toys to help women orgasm', 880, 24, 'C', 'long_tail', 'ORGASM', 0),
('toy', 'g-spot stimulation techniques', 720, 26, 'I', 'long_tail', 'ORGASM', 0),
('toy', 'clitoral orgasm guide', 1600, 28, 'I', 'long_tail', 'ORGASM', 0),
('toy', 'why can''t i orgasm', 3200, 28, 'I', 'long_tail', 'ORGASM', 0),
('toy', 'health benefits of orgasm', 1300, 22, 'I', 'long_tail', 'ORGASM', 0),
('toy', 'health benefits of masturbation', 2400, 24, 'I', 'long_tail', 'ORGASM', 0),

-- ==================== STAMINA 持久力/延时 ====================
('toy', 'how to last longer in bed', 8800, 42, 'I', 'core', 'STAMINA', 0),
('toy', 'stamina training for men', 2400, 34, 'I', 'core', 'STAMINA', 0),
('toy', 'premature ejaculation causes', 1600, 32, 'I', 'core', 'STAMINA', 0),
('toy', 'how to control ejaculation', 2400, 36, 'I', 'long_tail', 'STAMINA', 0),
('toy', 'natural remedies for premature ejaculation', 320, 39, 'I', 'long_tail', 'STAMINA', 0),
('toy', 'edging technique for stamina', 720, 22, 'I', 'long_tail', 'STAMINA', 0),
('toy', 'kegel exercises for premature ejaculation', 480, 18, 'I', 'long_tail', 'STAMINA', 0),
('toy', 'stop start technique', 880, 20, 'I', 'long_tail', 'STAMINA', 0),
('toy', 'squeeze technique premature ejaculation', 590, 18, 'I', 'long_tail', 'STAMINA', 0),
('toy', 'how to improve stamina in bed for men', 480, 22, 'I', 'long_tail', 'STAMINA', 0),

-- ==================== COUPLES 情侣玩具 ====================
('toy', 'couples sex toys', 4400, 36, 'C', 'core', 'COUPLES', 0),
('toy', 'best sex toys for couples', 2400, 34, 'C', 'core', 'COUPLES', 0),
('toy', 'app controlled vibrator', 2400, 28, 'C', 'long_tail', 'COUPLES', 0),
('toy', 'long distance sex toys', 3200, 30, 'C', 'long_tail', 'COUPLES', 0),
('toy', 'remote control vibrator for couples', 880, 24, 'C', 'long_tail', 'COUPLES', 0),
('toy', 'how to introduce sex toys to partner', 1600, 22, 'I', 'long_tail', 'COUPLES', 0),
('toy', 'wearable vibrator for couples', 480, 22, 'C', 'long_tail', 'COUPLES', 0),
('toy', 'couples vibrator during intercourse', 720, 26, 'C', 'long_tail', 'COUPLES', 0),

-- ==================== BEGINNER 新手入门 ====================
('toy', 'best beginner vibrator', 2400, 32, 'C', 'core', 'BEGINNER', 0),
('toy', 'first sex toy guide', 1600, 28, 'I', 'core', 'BEGINNER', 0),
('toy', 'how to buy your first sex toy', 880, 24, 'I', 'long_tail', 'BEGINNER', 0),
('toy', 'sex toy buying guide for beginners', 480, 20, 'I', 'long_tail', 'BEGINNER', 0),
('toy', 'what to look for when buying a vibrator', 320, 18, 'I', 'long_tail', 'BEGINNER', 0),
('toy', 'are sex toys safe', 1300, 24, 'I', 'long_tail', 'BEGINNER', 0),
('toy', 'how to talk about sex toys with partner', 720, 18, 'I', 'long_tail', 'BEGINNER', 0),

-- ==================== CLEANING 清洁保养 ====================
('toy', 'how to clean sex toys', 5400, 26, 'I', 'core', 'CLEANING', 0),
('toy', 'best sex toy cleaner', 1300, 22, 'C', 'core', 'CLEANING', 0),
('toy', 'how to sanitize silicone toys', 720, 18, 'I', 'long_tail', 'CLEANING', 0),
('toy', 'how to clean a vibrator', 2400, 24, 'I', 'long_tail', 'CLEANING', 0),
('toy', 'can you boil silicone toys', 880, 16, 'I', 'long_tail', 'CLEANING', 0),
('toy', 'sex toy storage ideas', 720, 18, 'I', 'long_tail', 'CLEANING', 0),
('toy', 'how often should you clean sex toys', 480, 14, 'I', 'long_tail', 'CLEANING', 0),

-- ==================== MATERIAL 材质安全 ====================
('toy', 'body safe sex toys', 2400, 30, 'I', 'core', 'MATERIAL', 0),
('toy', 'silicone vs tpe sex toys', 880, 24, 'I', 'core', 'MATERIAL', 0),
('toy', 'phthalate free sex toys', 720, 22, 'C', 'long_tail', 'MATERIAL', 0),
('toy', 'non toxic sex toys', 1600, 26, 'C', 'long_tail', 'MATERIAL', 0),
('toy', 'medical grade silicone toys', 880, 24, 'C', 'long_tail', 'MATERIAL', 0),
('toy', 'porous vs non porous sex toys', 320, 16, 'I', 'long_tail', 'MATERIAL', 0),
('toy', 'glass sex toys safety', 480, 18, 'I', 'long_tail', 'MATERIAL', 0),

-- ==================== DISCREET 隐私/静音 ====================
('toy', 'quietest vibrator', 2400, 28, 'C', 'core', 'DISCREET', 0),
('toy', 'discreet sex toys', 3200, 30, 'C', 'core', 'DISCREET', 0),
('toy', 'discreet shipping adult toys', 720, 20, 'I', 'long_tail', 'DISCREET', 0),
('toy', 'travel sex toys', 2400, 28, 'C', 'long_tail', 'DISCREET', 0),
('toy', 'discreet vibrator for travel', 480, 20, 'C', 'long_tail', 'DISCREET', 0),
('toy', 'discreet storage for sex toys', 590, 18, 'C', 'long_tail', 'DISCREET', 0),
('toy', 'quietest bullet vibrator', 320, 16, 'C', 'long_tail', 'DISCREET', 0),

-- ==================== LUBE 润滑剂 ====================
('toy', 'best lube for sex toys', 2400, 28, 'C', 'core', 'LUBE', 0),
('toy', 'water based lubricant', 5400, 34, 'C', 'core', 'LUBE', 0),
('toy', 'silicone lubricant', 3200, 32, 'C', 'long_tail', 'LUBE', 0),
('toy', 'lube for sensitive skin', 880, 22, 'C', 'long_tail', 'LUBE', 0),
('toy', 'can you use coconut oil as lube', 2600, 24, 'I', 'long_tail', 'LUBE', 0),
('toy', 'water based vs silicone lube', 1300, 24, 'I', 'long_tail', 'LUBE', 0),
('toy', 'how to choose lubricant', 480, 18, 'I', 'long_tail', 'LUBE', 0),
('toy', 'organic lubricant', 720, 22, 'C', 'long_tail', 'LUBE', 0),

-- ==================== SENSORY 感官/情趣 ====================
('toy', 'sensory play ideas', 720, 18, 'I', 'core', 'SENSORY', 0),
('toy', 'temperature play guide', 480, 16, 'I', 'core', 'SENSORY', 0),
('toy', 'glass dildo temperature play', 260, 12, 'I', 'long_tail', 'SENSORY', 0),
('toy', 'nipple toys', 2400, 28, 'C', 'long_tail', 'SENSORY', 0),
('toy', 'best nipple clamps', 880, 24, 'C', 'long_tail', 'SENSORY', 0),
('toy', 'nipple suckers', 1300, 22, 'C', 'long_tail', 'SENSORY', 0),
('toy', 'feather tickler', 720, 18, 'C', 'long_tail', 'SENSORY', 0),

-- ==================== WEARABLE 穿戴式 ====================
('toy', 'wearable vibrator', 1600, 28, 'C', 'core', 'WEARABLE', 0),
('toy', 'vibrating panties', 3200, 30, 'C', 'core', 'WEARABLE', 0),
('toy', 'remote control panty vibrator', 720, 22, 'C', 'long_tail', 'WEARABLE', 0),
('toy', 'wearable remote vibrator', 390, 20, 'C', 'long_tail', 'WEARABLE', 0),
('toy', 'wearable vibrator discreet', 320, 18, 'C', 'long_tail', 'WEARABLE', 0),

-- ==================== FINGER 指套 ====================
('toy', 'finger vibrator', 1600, 26, 'C', 'core', 'FINGER', 0),
('toy', 'best finger vibrator', 480, 22, 'C', 'long_tail', 'FINGER', 0),
('toy', 'finger vibrator for beginners', 260, 16, 'C', 'long_tail', 'FINGER', 0),
('toy', 'wearable finger vibrator', 210, 14, 'C', 'long_tail', 'FINGER', 0),

-- ==================== STRESS 压力与性欲 ====================
('toy', 'stress and libido', 720, 20, 'I', 'core', 'STRESS', 0),
('toy', 'how stress affects sex drive', 480, 18, 'I', 'long_tail', 'STRESS', 0),
('toy', 'how to increase libido naturally', 2400, 28, 'I', 'long_tail', 'STRESS', 0),
('toy', 'low libido in women', 3200, 30, 'I', 'long_tail', 'STRESS', 0),
('toy', 'low libido in men', 2400, 28, 'I', 'long_tail', 'STRESS', 0),

-- ==================== BDSM 轻BDSM ====================
('toy', 'bondage for beginners', 2400, 32, 'I', 'core', 'BDSM', 0),
('toy', 'beginner bdsm kit', 1300, 28, 'C', 'long_tail', 'BDSM', 0),
('toy', 'handcuffs for beginners', 1600, 26, 'C', 'long_tail', 'BDSM', 0),
('toy', 'blindfold sensory play', 880, 20, 'C', 'long_tail', 'BDSM', 0),
('toy', 'light bdsm for couples', 480, 22, 'I', 'long_tail', 'BDSM', 0),

-- ==================== WHOLESALE B2B补充 ====================
('toy', 'adult toys wholesale', 2400, 45, 'T', 'core', 'WHOLESALE', 0),
('toy', 'sex toys wholesale', 5400, 52, 'T', 'core', 'WHOLESALE', 0),
('toy', 'wholesale vibrators', 1200, 38, 'T', 'long_tail', 'WHOLESALE', 0),
('toy', 'wholesale dildos', 880, 35, 'T', 'long_tail', 'WHOLESALE', 0),
('toy', 'adult toy manufacturer', 1600, 48, 'T', 'long_tail', 'WHOLESALE', 0),
('toy', 'sex toy supplier china', 720, 42, 'T', 'long_tail', 'WHOLESALE', 0),
('toy', 'bulk adult toys', 590, 33, 'T', 'long_tail', 'WHOLESALE', 0),
('toy', 'private label sex toys', 320, 25, 'T', 'long_tail', 'WHOLESALE', 0),
('toy', 'custom adult toys', 390, 28, 'T', 'long_tail', 'WHOLESALE', 0);
