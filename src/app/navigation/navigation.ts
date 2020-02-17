import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Menu',
        permissions: 'ADMIN DEVELOPER',
        access: false,
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                permissions: 'ADMIN',
                access: false,
                type: 'item',
                icon: 'dashboard',
                url: '/dashboard'
            },
            {
                id: 'gyms',
                title: 'Gyms',
                type: 'item',
                icon: 'fitness_center',
                url: '/gyms'
            },
            {
                id: 'customers',
                title: 'App Users',
                type: 'item',
                icon: 'supervisor_account',
                url: '/customers'
            },
            {
                id: 'finance',
                title: 'Finance',
                type: 'item',
                icon: 'account_balance_wallet',
                url: '/finances'
            },
            {
                id: 'support',
                title: 'Support',
                type: 'collapsable',
                access: false,
                icon: 'question_answer',
                children: [
                    {
                        id: 'faqs',
                        title: 'FAQs',
                        type: 'item',
                        icon: 'contact_support',
                        url: '/faqs'
                    },
                    {
                        id: 'messages',
                        title: 'Messages',
                        type: 'item',
                        icon: 'message',
                        url: '/supports'
                    },
                ]
            },
            {
                id: 'setting',
                title: 'Settings',
                type: 'collapsable',
                access: false,
                icon: 'settings',
                children: [
                    {
                        id: 'pages',
                        title: 'Pages',
                        type: 'collapsable',
                        children: [
                            {
                                id: 'page-about',
                                title: 'About',
                                type: 'item',
                                url: '/settings/page/about'
                            },
                            {
                                id: 'page-privacy-policy',
                                title: 'Privacy Policy',
                                type: 'item',
                                url: '/settings/page/privacy-policy'
                            },
                            {
                                id: 'term-and-condition',
                                title: 'Term & Condition',
                                type: 'item',
                                url: '/settings/page/term-and-condition'
                            }
                        ]
                    },
                    {
                        id: 'gym-settings',
                        title: 'Gyms',
                        type: 'collapsable',
                        children: [
                            // {
                            //     id   : 'settings-offers',
                            //     title: 'Offers',
                            //     type : 'item',
                            //     url  : '/subscriptions'
                            // },
                            {
                                id: 'amenities',
                                title: 'Amenities',
                                type: 'item',
                                url: '/aminities'
                            }
                        ]
                    },
                    {
                        id: 'teams',
                        title: 'Teams',
                        type: 'item',
                        url: '/teams'
                    },
                    {
                        id: 'general-settings',
                        title: 'General',
                        type: 'item',
                        url: '/settings/default/default'
                    },
                    {
                        id: 'settings-accounts',
                        title: 'Account',
                        type: 'item',
                        url: '/settings/accounts/38723'
                    }
                ]
            }
        ]
    }
];
