import type { AstroComponent } from "@tabler/icons-astro";

import {
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-astro";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: AstroComponent;
}

export const CONFIG = {
  website: "https://tjquillan.dev",
  author: "Thomas Quillan",
  description: "A personal website for Thomas Quillan",
  title: "<tjquillan/>",
  postPerPage: 10,
};

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/tjquillan",
    linkTitle: `${CONFIG.author} on GitHub`,
    icon: IconBrandGithub,
  },
  {
    name: "GitLab",
    href: "https://gitlab.com/tjquillan",
    linkTitle: `${CONFIG.author} on GitLab`,
    icon: IconBrandGitlab,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/thomas-quillan/",
    linkTitle: `${CONFIG.author} on LinkedIn`,
    icon: IconBrandLinkedin,
  },
  {
    name: "Mail",
    href: "mailto:tjquillan@gmail.com",
    linkTitle: `Send an email to ${CONFIG.author}`,
    icon: IconMail,
  },
];
