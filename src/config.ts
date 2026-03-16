import type { Props } from "astro";
import IconMail from "@tabler/icons/outline/mail.svg";
import IconGitHub from "@tabler/icons/outline/brand-github.svg";
import IconGitLab from "@tabler/icons/outline/brand-gitlab.svg";
import IconLinkedin from "@tabler/icons/outline/brand-linkedin.svg";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const CONFIG = {
  website: "https://tjquillan.dev",
  author: "Thomas Quillan",
  description: "A personal website for Thomas Quillan",
  title: "Thomas Quillan",
  postPerPage: 10,
};

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/tjquillan",
    linkTitle: `${CONFIG.author} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "GitLab",
    href: "https://gitlab.com/tjquillan",
    linkTitle: `${CONFIG.author} on GitLab`,
    icon: IconGitLab,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/thomas-quillan/",
    linkTitle: `${CONFIG.author} on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Mail",
    href: "mailto:tjquillan@gmail.com",
    linkTitle: `Send an email to ${CONFIG.author}`,
    icon: IconMail,
  },
];
