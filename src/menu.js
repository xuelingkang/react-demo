// 导航菜单
export default [
    {
        name: '仪表盘',
        icon: 'dashboard',
        path: '/dashboard',
    },
    {
        name: '系统管理',
        icon: 'desktop',
        path: '/system',
        oneof: ['http./dept/*/*.GET'],
        children: [
            {
                name: '部门管理',
                path: '/dept/list',
                oneof: ['http./dept/*/*.GET']
            },
        ],
    },
    {
        name: '组件',
        icon: 'desktop',
        path: '/component',
        children: [
            {
                name: '工具条',
                path: '/toolbar',
            },
            {
                name: 'BaseComponent',
                path: '/baseComponent',
            },
            {
                name: 'Columns',
                path: '/column',
            },
            {
                name: '搜索条',
                path: '/searchBar',
            },
            {
                name: '数据表格',
                path: '/datatable',
            },
            {
                name: '表单',
                path: '/form',
            },
            {
                name: '穿梭树',
                path: '/transferTree',
            },
            {
                name: '图表',
                path: '/charts',
                children: [
                    {
                        name: 'ECharts',
                        path: '/charts/ec',
                    },
                    {
                        name: 'G2',
                        path: '/charts/g2',
                    },
                ]
            },
            {
                name: '打印',
                path: '/print',
            },
            {
                name: 'Banner 管理',
                path: '/banner',
            },
        ],
    },
    {
        name: 'UI元素',
        icon: 'share-alt',
        path: '/ui',
        children: [
            {
                name: '按钮',
                path: '/button',
            },
            {
                name: '消息',
                path: '/alerts',
            },
            {
                name: '动画',
                path: '/animations',
            },
            {
                name: '图标',
                path: '/icons',
            },
            {
                name: '富文本',
                path: '/editor',
            },
            {
                name: '模态窗',
                path: '/modal',
            },
            {
                name: '遮罩',
                path: '/mask',
            },
        ],
    },
    {
        name: '页面',
        icon: 'book',
        path: '/page',
        children: [
            {
                name: '登录页',
                path: '/sign/login',
            },
            {
                name: '注册页',
                path: '/sign/register',
            },
            {
                name: '锁屏',
                path: '/lock',
            },
            {
                name: '画廊',
                path: '/gallery',
            },
            {
                name: '空白页',
                path: '/blank',
            },
            {
                name: '结果页',
                path: '/result',
            },
            {
                name: 'Coming Soon',
                path: '/coming',
            },
            {
                name: '403',
                path: '/403',
            },
            {
                name: '404',
                path: '/404',
            },
            {
                name: '500',
                path: '/500',
            },
            {
                name: '多级路由',
                path: '/level-route/:sub?',
            },
        ],
    }
];
