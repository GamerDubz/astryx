---
'@astryxdesign/cli': patch
---

[experimental] Icon sets: a project picks one main icon set and backup sets in order, and an icon no set has becomes Core's placeholder. Only the experimental icon commands, projects that set `experimental.iconSet`, templates that declare `icons`, and the icon-set guide change.

- **Main set and backups.** `astryx experimental icon use <main> --backup <set>` (repeatable, order kept) writes `experimental.iconSet` as a list, the main set first; with no `--backup` it writes the plain string as before. The receipt adds `backups`, the installed sets the list leaves out (`unlisted`), and the command that adds them (`next`). `experimental icon --list` shows the `order` and each set's `role` and `rank`, and, when two or more sets are installed and none is the main set, the command to run. A CLI before 0.7.12 refuses the list form, and `use` warns when the project's CLI range admits one.
- **Copied templates follow the list.** `astryx template` takes each icon from the first set in the list that has its meaning, never mixing sets within one icon, and reports the set used, a missing look (`variant: {asked, used}`), and each set used with its license (`icons.sets`).
- **No stray library imports.** An icon no set in the list has now imports Core's `MissingIcon_experimental` under the template's own name, with a comment naming the meaning, instead of keeping the template's original import. The output prints a note naming the meaning and both fixes (map it in the main set, or add a backup set), and the JSON lists it in `icons.placeholder`.
- **Doctor.** With the opt-in, the `icon-sets` check fails when the list names a set that is not installed, withdrawn, or shipped by two packages, and when more than one set is installed and the list leaves one out. A new `icon-placeholders` check warns while copied code still uses the placeholder, naming each file and meaning. Projects that have not opted in see no change.
- **Labeled template icons.** Every icon a bundled template uses now declares its meaning, with 30 new icon definitions. `integration check` warns about an icon a template imports but does not declare (`template_icon_undeclared`, fails `--strict`), in a package whose templates declare `icons`.
- **Search.** An experimental Core component is not a search result; `astryx component <Name>` still reads it.

@josephfarina
