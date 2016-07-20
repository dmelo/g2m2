# G2M2 - GitHub & MarkDown as a CMS platform

G2M2 is a different kind of droid. Instead of helping jedi knights saving the
galaxy, it helps developers maintaining their markdown CMSs.

It reads the URL, to recognize the GitHub user, repo and file it is referencing,
access the content on GitHub, parse the markdown and present the content.

Plugins, adicional js scripts and css styles can be loaded if the repository
have a `.g2m2.json` file describing those items.


## Get started

It is impossible to be simpler. If you want to visualize your repo, just access:

```
http://$USER$.g2m2.net/$REPO$
```

Where `$USER$` is your GitHub username and `$REPO$` is the name of the repository
you want to access.

Here is an example:

[http://dmelo.g2m2.net/g2m2-pages](http://dmelo.g2m2.net/g2m2-pages)

The link above access my blog, which is on the
[dmelo/g2m2-pages](https://github.com/dmelo/g2m2-pages) GitHub repo.

## What G2M2 does?

G2M2 takes the URL, map the corresponding MarkDown file on GitHub and present it
on a pretty way. Allowing the management of a CMS to be done entirely through
command line. The changes comes live with a `git push`.

There is no need to install anything new, or setup anything. G2M2 works on any
GitHub repository that have MarkDown files.

It works by default and allow customization through `.g2m2.json` file that
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

## Goals

- write clean readable, well documented code;
- no setup required;
- the only requirement is to have the project hosted on GitHub (with MarkDown
        files);


## License

This software is developed by [Diogo Oliveira de Melo](http://diogomelo.net) and
licensed under LGPL version 3. You can find a copy of the license on the file
`LICENSE`. You can access it online on the link
[LGPL v3](https://www.gnu.org/licenses/lgpl-3.0.txt).
