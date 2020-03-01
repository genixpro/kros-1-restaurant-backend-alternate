'use strict';

angular.module('newsApp').constant('API', {
  url: '',
  endpoint: {
    articles: '/api/articles/',
    products: '/api/products/',
    categories: '/api/categories/',
    catalogueCategories: '/api/catalogue-categories/',
    downloads: '/api/downloads/',
    items: '/api/items/',
    offers: '/api/offers/',
    pages: '/api/pages/',
    restaurantOrders: '/api/restaurant-orders/',
    media: '/api/media/',
    accounts: '/api/accounts/',
    reviews: '/api/reviews/',
    lectures: '/api/lectures/',
    grades: '/api/grades/',
    courses: '/api/courses/',
    topics: '/api/topics/',
    clients: '/api/clients/',
    quizzes: '/api/quizzes/',
    rooms: '/api/rooms/',
    posters : '/api/posters/',
    export : '/api/posters-export/',
    platformOrders: '/api/platform-orders/',
    businesses: '/api/businesses/',
    simpleLists: '/api/simple-lists/',
    s3downloads: '/api/s3downloads/',
    posters_lint:'/api/posters-lint/',
    reports:'/api/reports/',
    submission_codes:'/api/submissioncode/',
    submissioncodesOrders:'/api/submissioncodes-order/',
    db : '/api/db/'
  }
});
