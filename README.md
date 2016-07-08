# G2M2 - GitHub & MarkDown as a CMS platform

## What G2M2 does?

G2M2 takes the URL, map the corresponding MarkDown file on GitHub and present it
on a pretty way. Allowing the management of a CMS to be done entirely through
command line. The changes comes live with a `git push`.

There is no need to install anything new, or setup anything. G2M2 works on any
GitHub repository that have MarkDown files.

It works by default and allow customization through `.g2m2.config` file that
may specify:

- style theme;
- CSS files to load;
- JS files to load.

Customization may also come from MarkDown comments inserted in the body of the
files.

## For who is this project?

There is a set of developers, that like me, have the following characteristics:

- very well versed on a text editor (usually Vim or Emacs);
- use Git and GitHub very heavely;
- want to maintain a CMS with very little effort.

## How it works?

## Goals

- write clean readable, well documented code;
- the only requirement is to have the project hosted on GitHub (with MarkDown
        files);
- no setup required;


## Roadmap

- allow plugins;
- keep a dictionary mapping from URLs to GitHub username and repository so that
it is possible to map a domain to specific projects;

## License

This software is developed by [Diogo Oliveira de Melo](http://diogomelo.net) and
licensed under LGPL version 3. You can find a copy of the license on the file
`LICENSE`. You can access it online on the link
[LGPL v3](https://www.gnu.org/licenses/lgpl-3.0.txt).
