// import
import { HomeIcon } from "@components/shared/Icons";
import React, { Component } from "react";

// import {
//   HomeIcon,
//   StatsIcon,
//   CreditIcon,
//   PersonIcon,
//   DocumentIcon,
//   RocketIcon,
//   SupportIcon,
// } from "components/Icons/Icons";

const routes = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <HomeIcon />,

  },
  {
    name: "Reward",
    category: "Reward",
    children: [
      {
        name: "User Reward",
        path: "/admin/reward",
      },
    ],
  },
  {
    name: "Quest",
    category: "Quest",
    children: [
      {
        name: "User Quest",
        path: "/admin/quest",
      },
    ],
  },
  {
    name: "Search",
    category: "Search",
    children: [
      {
        name: "Rewards",
        path: "/admin/search",
      },
      {
        name: "User Quest",
        path: "/admin/search/user-quests",
      },
      {
        name: "User Stats",
        path: "/admin/search/user-stats",
      },
    ],
  },
  {
    name: "User",
    category: "User",
    children: [
      {
        name: "Add User",
        path: "/admin/user",
      },
      {
        name: "Bulk Users",
        path: "/admin/user/bulk",
      },
    ],
  },

  // {
  //   label: 'Setting',
  //   children: [
  //     {
  //       label: 'Config',
  //       subLabel: 'Multiple server configs',
  //       href: '/admin/setting/config',
  //     },
  //     {
  //       label: 'Discord',
  //       subLabel: 'Channels configuration',
  //       href: '/admin/setting/discord',
  //     },
  //     {
  //       label: 'Reward Types',
  //       subLabel: 'Types of reward configuration',
  //       href: '/admin/setting/reward-types',
  //     },
  //   ],
  // },
];

export default routes;
