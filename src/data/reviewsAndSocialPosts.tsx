// src/data/reviewsAndSocialPosts.js

export const localReviews = [
  {
    _id: '1',
    author_name: 'vishvesh',
    author_email: 'priya@example.com',
    rating: 5,
    review_text: 'very beautiful pearls at very affordable prices, very satisfied.',
    verified_purchase: true,
    is_approved: true,
    created_at: '2025-10-28T10:30:00Z',
    image_url: '/review/InShot_20251029_020837576.jpg', // Girl in white dress with pearl necklace
  },
  {
    _id: '2',
    author_name: 'PRANITHAK',
    author_email: 'priya@example.com',
    rating: 5,
    review_text: 'its looking super cute, very premium and adorable pearl and silver jewellery you guys sell, I m really happy with all the products ❤️',
    verified_purchase: true,
    is_approved: true,
    created_at: '2025-10-28T10:30:00Z',
    image_url: '/review/InShot_20251029_020927676.jpg', // Girl in white dress with pearl necklace
  },
  {
    _id: '3',
    author_name: 'kaveri',
    author_email: 'priya@example.com',
    rating: 5,
    review_text: 'ifallen in love with this bracelet...😍❤️',
    verified_purchase: true,
    is_approved: true,
    created_at: '2025-10-28T10:30:00Z',
    image_url: '/review/InShot_20251029_020908790.jpg', // Girl in white dress with pearl necklace
  },
  {
    _id: '4',
    author_name: 'Rithu',
    author_email: 'priya@example.com',
    rating: 5,
    review_text: 'More beautiful than what my mother expected and also really nice packaging Thank you.',
    verified_purchase: true,
    is_approved: true,
    created_at: '2025-10-28T10:30:00Z',
    image_url: '/review/InShot_20251029_020849476.jpg', // Girl in white dress with pearl necklace
  },
  {
    _id: '5',
    author_name: 'AAYUSHI',
    author_email: 'priya@example.com',
    rating: 5,
    review_text: 'The best pearl collection directly from hyderabad with pearl certification..',
    verified_purchase: true,
    is_approved: true,
    created_at: '2025-10-28T10:30:00Z',
    image_url: '/review/InShot_20251029_020939758.jpg', // Girl in white dress with pearl necklace
  },
  
];


export const localSocialPosts = [
  {
    _id: '1',
    platform: 'Instagram',
    post_type: 'video',
    embed_url: "https://player.cloudinary.com/embed/?cloud_name=daj7ygikf&public_id=v1_wzis1u&profile=cld-default",
    embed_code: '',
    caption: 'Shining bright with Sai Naman Pearls 💫',
    media_url: "   https://res.cloudinary.com/daj7ygikf/video/upload/v1763223921/v1_wzis1u.mp4",
    likes: 1243,
    comments: 54,
    is_active: true,
    display_order: 1,
  },                           
  {
    _id: '2',
    platform: 'Instagram',
    post_type: 'video',
    embed_url: '/review/v2.mp4',
    embed_code: '',
    caption: 'Unboxing Sai Naman Pearls | Honest Review 💎',
    media_url: 'https://res.cloudinary.com/daj7ygikf/video/upload/v1763227302/v2_rljzv2.mp4',
    likes: 876,
    comments: 92,
    is_active: true,
    display_order: 2,
  },
  {
    _id: '3',
    platform: 'Instagram',
    post_type: 'reel',
    embed_url: '/review/v3.mp4',
    embed_code: '',
    caption: 'Elegance redefined ✨ #SaiNamanPearls',
    media_url: 'https://res.cloudinary.com/daj7ygikf/video/upload/v1767705514/v3_aidmg9.mp4',
    likes: 2021,
    comments: 110,
    is_active: true,
    display_order: 3,
  },
  {
    _id: '4',
    platform: 'Instagram',
    post_type: 'video',
    embed_url: '/review/v4.mp4',
    embed_code: '',
    caption: 'Pearl perfection with Sai Naman 💖',
    media_url: 'https://res.cloudinary.com/daj7ygikf/video/upload/v1767706224/v4_pqw66o.mp4',
    likes: 1345,
    comments: 76,
    is_active: true,
    display_order: 4,
  }
];