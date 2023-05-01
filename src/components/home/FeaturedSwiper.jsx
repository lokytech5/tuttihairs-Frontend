import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import { Box, Typography } from '@mui/material';

SwiperCore.use([Pagination]);
export default function FeaturedSwiper() {
    const featuredItems = [
        {
            title: 'Featured Item 1',
            description: 'This is a description for featured item 1.',
            image: require('../../assets/hair6.jpg'), // Replace with actual image URL
        },
        {
            title: 'Featured Item 2',
            description: 'This is a description for featured item 2.',
            image: require('../../assets/hair5.jpg'), // Replace with actual image URL
        },
        {
            title: 'Featured Item 3',
            description: 'This is a description for featured item 3.',
            image: require('../../assets/hair12.jpg'), // Replace with actual image URL
        },
    ];

    const customPagination = {
        clickable: true,
        renderBullet: (index, className) => {
            return `<span class="${className} custom-pagination-bullet"></span>`;
        },
    };

    return (
        <Box>
            <Swiper
                pagination={customPagination}
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000 }}
            >
                {featuredItems.map((item, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: '400px',
                                backgroundImage: `url(${item.image})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: '20%',
                                    left: '5%',
                                    color: 'white',
                                    maxWidth: '50%',
                                }}
                            >
                                <Typography variant="h4">{item.title}</Typography>
                                <Typography variant="subtitle1">{item.description}</Typography>
                            </Box>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
            <style jsx>
                {`
          .custom-pagination-bullet {
            background-color: white;
            opacity: 0.5;
            width: 8px;
            height: 8px;
            margin: 0 4px;
            border-radius: 100%;
          }

          .custom-pagination-bullet.swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}
            </style>
        </Box>
    );
};
