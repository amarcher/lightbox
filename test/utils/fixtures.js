'use strict';

var albumImage = {
  account_id: 11533024,
  account_url: 'RationalLunatic',
  comment_count: 343,
  cover: 'tr3GoLC',
  cover_height: 623,
  cover_width: 859,
  datetime: 1423198078,
  description: null,
  downs: 208,
  favorite: false,
  id: 'i9qfe',
  images_count: 3,
  in_gallery: true,
  is_ad: false,
  is_album: true,
  layout: 'blog',
  link: 'http://imgur.com/a/i9qfe',
  nsfw: false,
  points: 20030,
  privacy: 'public',
  score: 20047,
  section: '',
  title: 'Games that test you',
  topic: 'The More You Know',
  topic_id: 11,
  ups: 20238,
  views: 591755,
  vote: null
};

var image = {
  account_id: 12563425,
  account_url: 'ruediga',
  animated: true,
  bandwidth: 69327351205180,
  comment_count: 244,
  datetime: 1460034808,
  description: null,
  downs: 87,
  favorite: false,
  gifv: 'http://i.imgur.com/MfH8sAF.gifv',
  height: 404,
  id: 'MfH8sAF',
  in_gallery: true,
  is_ad: false,
  is_album: false,
  link: 'http://i.imgur.com/MfH8sAFh.gif',
  looping: true,
  mp4: 'http://i.imgur.com/MfH8sAF.mp4',
  mp4_size: 1113993,
  nsfw: false,
  points: 12329,
  score: 12883,
  section: 'Wellthatsucks',
  size: 62482967,
  title: 'MRW',
  topic: 'Reaction',
  topic_id: 23,
  type: 'image/gif',
  ups: 12416,
  views: 1109540,
  vote: null,
  width: 718
};

var fixtures = {
  albumImage: albumImage,

  image: image,

  imageData: {
    data: [
      image,
      albumImage
    ]
  },

  thumbnailImage: {
    id: image.id,
    link: image.link,
    height: image.height,
    width: image.width
  },

  lightboxImageData: {
    id: image.id,
    link: image.link,
    height: image.height,
    width: image.width,
    nextImageId: 'nextId',
    prevImageId: 'prevId'
  }
};

module.exports = fixtures;