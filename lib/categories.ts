 // 产品分类配置 - 成人用品批发分类
export const categories = [
  {
    name: 'Best Sellers',
    slug: 'best-sellers',
    priority: 1.0,
    children: []
  },
  {
    name: 'Vibrators',
    slug: 'vibrators',
    priority: 0.9,
    children: [
      { name: 'Bullet Vibrators', slug: 'bullet-vibrators' },
      { name: 'Wand Vibrators', slug: 'wand-vibrators' },
      { name: 'Rabbit Vibrators', slug: 'rabbit-vibrators' },
      { name: 'G-Spot Vibrators', slug: 'g-spot-vibrators' },
      { name: 'Clitoral Vibrators', slug: 'clitoral-vibrators' }
    ]
  },
  {
    name: 'Male Masturbators',
    slug: 'male-masturbators',
    priority: 0.9,
    children: [
      { name: 'Fleshlight', slug: 'fleshlight' },
      { name: 'Prostate Massagers', slug: 'prostate-massagers' },
      { name: 'Cock Rings', slug: 'cock-rings' },
      { name: 'Pump & Enlargers', slug: 'pump-enlargers' }
    ]
  },
  {
    name: 'BDSM & Bondage',
    slug: 'bdsm-bondage',
    priority: 0.85,
    children: [
      { name: 'Restraints & Cuffs', slug: 'restraints-cuffs' },
      { name: 'Whips & Paddles', slug: 'whips-paddles' },
      { name: 'Masks & Hoods', slug: 'masks-hoods' },
      { name: 'Collars & Leashes', slug: 'collars-leashes' }
    ]
  },
  {
    name: 'Couples Play',
    slug: 'couples-play',
    priority: 0.8,
    children: [
      { name: 'Couple Vibrators', slug: 'couple-vibrators' },
      { name: 'Remote Control Toys', slug: 'remote-control-toys' },
      { name: 'App Control Toys', slug: 'app-control-toys' },
      { name: 'Massage Oils & Lubricants', slug: 'massage-oils-lubricants' }
    ]
  },
  {
    name: 'Lingerie',
    slug: 'lingerie',
    priority: 0.75,
    children: [
      { name: 'Babydolls', slug: 'babydolls' },
      { name: 'Bodystockings', slug: 'bodystockings' },
      { name: 'Corsets', slug: 'corsets' },
      { name: 'Role Play Costumes', slug: 'role-play-costumes' }
    ]
  }
];