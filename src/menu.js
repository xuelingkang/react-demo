// 导航菜单
export default [
    {
        name: '统计图表',
        icon: 'dashboard',
        path: '/dashboard',
        oneof: [
            'http./summary/broadcast/month.GET',
            'http./summary/mail/month.GET',
            'http./summary/broadcast/senduser.GET',
            'http./summary/mail/senduser.GET',
            'http./summary/user/sex.GET'
        ]
    },
    {
        name: '任务管理',
        icon: 'book',
        path: '/job',
        oneof: ['http./jobTemplate/*/*.GET', 'http./job/*/*.GET'],
        children: [
            {
                name: '任务模板',
                path: '/jobTemplate',
                resource: 'http./jobTemplate/*/*.GET'
            },
            {
                name: '定时任务',
                path: '/job',
                resource: 'http./job/*/*.GET'
            },
        ]
    },
    {
        name: '广播管理',
        icon: 'wifi',
        path: '/broadcast',
        oneof: ['http./broadcast/*/*.GET', 'http./broadcast/self/*/*.GET'],
        children: [
            {
                name: '所有消息',
                path: '/broadcast',
                resource: 'http./broadcast/*/*.GET'
            },
            {
                name: '我的消息',
                path: '/broadcastSelf',
                resource: 'http./broadcast/self/*/*.GET'
            },
        ]
    },
    {
        name: '邮件管理',
        icon: 'mail',
        path: '/mail',
        resource: 'http./mail/*/*.GET'
    },
    {
        name: '系统管理',
        icon: 'desktop',
        path: '/system',
        oneof: [
            'http./dept/*/*.GET',
            'http./user/*/*.GET',
            'http./role/*/*.GET',
            'http./resource/*/*.GET',
            'http./attachment/*/*.GET'
        ],
        children: [
            {
                name: '部门管理',
                path: '/dept',
                resource: 'http./dept/*/*.GET'
            },
            {
                name: '用户管理',
                path: '/user',
                resource: 'http./user/*/*.GET'
            },
            {
                name: '角色管理',
                path: '/role',
                resource: 'http./role/*/*.GET'
            },
            {
                name: '权限管理',
                path: '/resource',
                resource: 'http./resource/*/*.GET'
            },
            {
                name: '附件管理',
                path: '/attachment',
                resource: 'http./attachment/*/*.GET'
            },
        ],
    },
];
