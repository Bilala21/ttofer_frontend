export const sideBarItems = [
  {
    title: 'Transactions',
    items: [
      {
        id: 'purchasesSales',
        label: 'Purchases & Sales',
        icon: 'fas fa-shopping-cart',
        routerLink: '/profile/sale-purchase',
      },
      {
        id: 'paymentDeposit',
        label: 'Payment & Deposit Method',
        icon: 'fas fa-credit-card',
        routerLink: '/profile//payment',
      },
      {
        id: 'wallet',
        label: 'Wallet',
        icon: 'fas fa-wallet',
        routerLink: '/profile//wallet',
      },
    ],
  },
  {
    title: 'Save',
    items: [
      {
        id: 'savedItems',
        label: 'Saved Items',
        icon: 'fas fa-heart',
        routerLink: '/profile//saved-items',
      },
      {
        id: 'notification',
        label: 'Notifications',
        icon: 'fas fa-bell',
        routerLink: '/profile//notifications',
      },
    ],
  },
  {
    title: 'My Posts',
    items: [
      // { id: 'editPost', label: 'Edit Post', icon: 'fas fa-edit',routerLink:'/edit-post' },
      {
        id: 'addPost',
        label: 'Add Post',
        icon: 'fas fa-plus-circle',
        routerLink: '/profile//add-post',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        id: 'accountSetting',
        label: 'Account Setting',
        icon: 'fas fa-cog',
        routerLink: '/profile//account-setting',
      },
      {
        id: 'boostPlus',
        label: 'Boost Plus',
        icon: 'fas fa-rocket',
        routerLink: '/profile//post-boosting',
      },
      {
        id: 'customLinks',
        label: 'Custom Profile Link',
        icon: 'fas fa-link',
        routerLink: '/profile//custom-link',
      },
    ],
  },
  {
    title: 'Help',
    items: [
      {
        id: 'helpCenter',
        label: 'Help Center',
        icon: 'fas fa-question',
        routerLink: '/profile//help-center',
      },
    ],
  },
];
