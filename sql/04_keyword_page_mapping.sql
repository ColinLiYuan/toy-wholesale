-- ============================================================
-- 04_keyword_page_mapping: 关键词-页面映射 INSERT
-- 使用子查询避免硬编码keyword_id
-- page_type: 2 = blog
-- ============================================================

-- ==================== WAND ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-wand-vibrators-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('wand vibrator', 'best wand vibrator', 'wand massager', 'cordless wand vibrator', 'magic wand massager');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-wand-massager-beginners-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to use a wand massager', 'wand massager for women', 'wand massager for couples');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/cordless-vs-plug-in-wand-vibrator', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('cordless wand vibrator', 'plug in vs rechargeable wand vibrator', 'best cordless wand massager');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-mini-wand-vibrator-travel', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('mini wand massager', 'best mini wand massager for travel');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-wand-massager-for-clitoral-stimulation', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('best wand massager for clitoral stimulation', 'wand massager for women');

-- ==================== BULLET ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-bullet-vibrators-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('bullet vibrator', 'best bullet vibrator', 'mini bullet vibrator', 'best rechargeable bullet vibrator');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-remote-control-bullet-vibrator', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('remote bullet vibrator', 'best remote control bullet vibrator');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/bullet-vs-egg-vibrator-comparison', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('bullet vibrator vs egg vibrator', 'egg vibrator');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/most-discreet-bullet-vibrator-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('discreet bullet vibrator', 'best discreet bullet vibrator for travel', 'quietest bullet vibrator');

-- ==================== RABBIT ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-rabbit-vibrators-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('rabbit vibrator', 'best rabbit vibrator', 'dual stimulator vibrator');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/rabbit-vibrator-for-beginners-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('rabbit vibrator for beginners', 'what is a rabbit vibrator');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/thrusting-vs-rotating-rabbit-vibrator', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('thrusting rabbit vibrator', 'rotating rabbit vibrator', 'thrusting vs rotating rabbit vibrator');

-- ==================== G-SPOT ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-g-spot-vibrator-beginners-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('g-spot vibrator', 'how to use a g-spot vibrator', 'best g-spot vibrator', 'g-spot vibrator for beginners');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-find-g-spot', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to find g-spot', 'g-spot orgasm techniques');

-- ==================== SONIC ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/sonic-waves-vs-vibration', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('sonic vibrator', 'sonic waves vs vibration', 'clitoral suction vibrator', 'air pulse vibrator');

-- ==================== DILDO ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-realistic-dildos-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('realistic dildo', 'best realistic dildos', 'silicone dildo');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-choose-your-first-dildo', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to choose your first dildo');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/silicone-vs-glass-vs-metal-dildo', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('silicone vs glass vs metal dildo', 'glass dildo', 'metal dildo', 'silicone dildo');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-suction-cup-dildo-hands-free-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('suction cup dildo', 'best suction cup dildo hands free');

-- ==================== MALE ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-male-masturbators-2026', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('male masturbator', 'best male masturbator', 'pocket pussy');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/death-grip-syndrome-desensitization-fix', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('death grip syndrome', 'how to fix death grip');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/automatic-vs-manual-male-masturbator', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('automatic male masturbator', 'automatic vs manual male masturbator', 'electric masturbator cup');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-clean-male-masturbator', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to clean a male masturbator');

-- ==================== COCKRING ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-cock-rings-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('cock ring', 'best cock ring', 'vibrating cock ring', 'silicone cock ring');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-use-a-cock-ring-beginners-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to use a cock ring', 'cock ring safety tips');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/vibrating-cock-ring-for-couples-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('vibrating cock ring for couples');

-- ==================== PROSTATE ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/prostate-health-massage-benefits', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('prostate massager', 'prostate massage benefits', 'prostate health massage');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/beginners-guide-exploring-male-p-spot', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('p-spot guide for beginners', 'how to use prostate massager', 'best prostate vibrator');

-- ==================== ANAL ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/beginners-guide-to-butt-plugs', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('butt plug', 'best butt plug for beginners', 'how to use a butt plug', 'anal training kit', 'butt plug safety guide');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/tail-butt-plugs-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('tail butt plug', 'fox tail plug');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/inflatable-butt-plugs-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('inflatable butt plug');

-- ==================== COUPLES ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/couples-sex-toys-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('couples sex toys', 'best sex toys for couples', 'how to introduce sex toys to partner');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/digital-intimacy-app-controlled-play', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('app controlled vibrator', 'long distance sex toys', 'remote control vibrator for couples');

-- ==================== KEGEL ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/kegel-exercises-for-women-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('kegel exercises', 'kegel exercises for women', 'how to do kegel exercises correctly', 'benefits of kegel exercises');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-pelvic-floor-trainer-devices', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('pelvic floor trainer', 'best pelvic floor trainer', 'kegel weights', 'kegel trainer app');

-- ==================== ORGASM ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/how-to-achieve-female-orgasm-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to achieve female orgasm', 'female orgasm guide', 'clitoral orgasm guide');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-toys-to-help-women-orgasm', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('best toys to help women orgasm');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/g-spot-orgasm-techniques-and-toys', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('g-spot orgasm techniques');

-- ==================== BEGINNER ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-beginner-vibrators-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('best beginner vibrator', 'first sex toy guide', 'are sex toys safe');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/sex-toy-buying-guide-first-timer', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to buy your first sex toy', 'sex toy buying guide for beginners', 'what to look for when buying a vibrator');

-- ==================== CLEANING ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/ultimate-sex-toy-care-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to clean sex toys', 'best sex toy cleaner', 'how to clean a vibrator', 'how to sanitize silicone toys', 'can you boil silicone toys', 'sex toy storage ideas');

-- ==================== MATERIAL ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/body-safe-materials-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('body safe sex toys', 'phthalate free sex toys', 'non toxic sex toys', 'medical grade silicone toys', 'porous vs non porous sex toys');

-- ==================== DISCREET ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/quietest-vibrators-sound-engineering', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('quietest vibrator', 'discreet sex toys', 'quietest bullet vibrator');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/art-of-discreet-pleasure', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('discreet storage for sex toys', 'discreet sex toys', 'travel sex toys', 'discreet shipping adult toys');

-- ==================== LUBE ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/guide-to-luxury-lubrication', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('best lube for sex toys', 'water based lubricant', 'silicone lubricant', 'water based vs silicone lube', 'how to choose lubricant', 'can you use coconut oil as lube');

-- ==================== SENSORY ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/beginners-guide-to-sensory-play', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('sensory play ideas');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/temperature-play-glass-metal-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('temperature play guide', 'glass dildo temperature play');

-- ==================== NIPPLE ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/best-nipple-toys-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('nipple toys', 'best nipple clamps', 'nipple suckers');

-- ==================== WEARABLE ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/vibrating-panties-wearable-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('vibrating panties', 'wearable vibrator', 'remote control panty vibrator');

-- ==================== FINGER ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/finger-vibrators-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('finger vibrator', 'best finger vibrator');

-- ==================== STRESS ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/stress-and-libido-connection', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('stress and libido', 'how stress affects sex drive', 'how to increase libido naturally', 'low libido in women', 'low libido in men');

-- ==================== STAMINA ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/stamina-training-complete-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('how to last longer in bed', 'stamina training for men', 'how to control ejaculation', 'edging technique for stamina', 'stop start technique');

INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/premature-ejaculation-causes-solutions', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('premature ejaculation causes', 'natural remedies for premature ejaculation', 'squeeze technique premature ejaculation');

-- ==================== HEALTH ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/health-benefits-of-solo-play', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('health benefits of masturbation', 'health benefits of orgasm');

-- ==================== BDSM ====================
INSERT INTO keyword_page_mapping (site_id, keyword_id, page_url, page_type)
SELECT 'toy', k.id, '/blog/bondage-for-beginners-guide', 2
FROM seo_keyword_library k WHERE k.site_id = 'toy' AND k.keyword IN ('bondage for beginners', 'beginner bdsm kit', 'handcuffs for beginners', 'blindfold sensory play', 'light bdsm for couples');
