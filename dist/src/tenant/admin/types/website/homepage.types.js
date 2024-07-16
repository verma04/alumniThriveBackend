"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeTypes = void 0;
const apollo_server_core_1 = require("apollo-server-core");
// const { Parking } = require('../models/Parking');
const homeTypes = (0, apollo_server_core_1.gql) `
    type Carousel {
        id: String
        url: String
        image: String
    }
    type HeaderLinks {
        id: String
        name: String
        link: String
        subMenu: [HeaderLinks]
    }
    type customPage {
        id: ID
        title: String
        slug: String
        organization: String
        metaDescription: String
        metaTitle: String
    }
    type socialMedia {
        title: String
        slug: String
        organization: String
        metaDescription: String
        metaTitle: String
    }

    input UploadImageGallery {
        link: String
        url: Upload
    }
    input inputSocialMedia {
        instagram: String
        linkedin: String
        twitter: String
        youtube: String
    }

    input inputSubHeaderLinks {
        id: String
        name: String
        link: String
    }
    input inputHeaderLinks {
        id: String
        name: String
        link: String
        subMenu: [inputSubHeaderLinks]
    }
    input inputCustomPages {
        title: String
        slug: String
        organization: String
        metaDescription: String
        metaTitle: String
    }

    type Query {
        getHomePageCarousel: [Carousel]
        getSocialMedia: socialMedia
        getHeaderLinks: [HeaderLinks]
        getCustomPages: [customPage]
    }

    type Mutation {
        updateHomePageCarousel(input: [UploadImageGallery]): [Carousel]
        updateHeaderLinks(input: [inputHeaderLinks]): [HeaderLinks]
        updateSocialMedia(input: inputSocialMedia): socialMedia
        addCustomPages(input: inputCustomPages): [customPage]
    }
`;
exports.homeTypes = homeTypes;
