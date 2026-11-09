// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file page.tsx
 * @input None
 * @output One page that shows every behavior of the BaseTypeahead menu group
 *   (BaseTypeahead and Typeahead menus, Tokenizer menus, the open handle),
 *   each with its callsite, a "try this" line and where its fix lives
 * @position Scratch preview page for the menu group's exact heads; never
 *   merged. Document scroll, so it works as a phone page.
 */

import {useRef, useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {CodeBlock} from '@astryxdesign/core/CodeBlock';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Tokenizer, type TokenizerHandle} from '@astryxdesign/core/Tokenizer';
import {
  BaseTypeahead,
  Typeahead,
  createStaticSource,
  type BaseTypeaheadHandle,
  type BaseTypeaheadMenu,
  type SearchableItem,
} from '@astryxdesign/core/Typeahead';
import BaseTypeaheadMenuBlock from './BaseTypeaheadMenuBlock';

type Person = SearchableItem & {team: string};

const people: Person[] = [
  {id: 'ada', label: 'Ada Lovelace', team: 'Design'},
  {id: 'grace', label: 'Grace Hopper', team: 'Platform'},
  {id: 'alan', label: 'Alan Turing', team: 'Research'},
  {id: 'katherine', label: 'Katherine Johnson', team: 'Platform'},
  {id: 'linus', label: 'Linus Pauling', team: 'Research'},
  {id: 'margaret', label: 'Margaret Hamilton', team: 'Design'},
];
const peopleSource = createStaticSource<Person>(people);
const ROLES = ['Viewer', 'Editor', 'Owner'];

const BEHAVIORS: Array<{
  n: number;
  what: string;
  tryThis: string;
  fix: string;
  demo: string;
}> = [
  {
    n: 1,
    what: "A Tokenizer opens a dialog menu (role 'dialog', label, render) from a token",
    tryThis:
      'In demo A, add a person, then press their token: a "Role for …" dialog opens on the same layer.',
    fix: 'Component: #10624 (Tokenizer menu, open handle), on #10544 (BaseTypeahead menu)',
    demo: 'A',
  },
  {
    n: 2,
    what: "A listbox menu (role 'listbox') with information around the results",
    tryThis:
      'In demo B, focus the field: "Filter by" above the list and a key hint below it; arrow keys move, Enter picks.',
    fix: 'Component: #10544 (BaseTypeahead menu). The field ring in this example: #10625 (example only)',
    demo: 'B',
  },
  {
    n: 3,
    what: 'Escape returns focus to the token that opened the dialog (Safari too)',
    tryThis:
      "In demo A, open a token's dialog, press Escape: focus is back on that token. In Safari, a click on a button does not focus it; the token is still the return target.",
    fix: 'Component: #10544 (BaseTypeahead restore point) with #10624 (Tokenizer records the pressed token as the opener, for Safari)',
    demo: 'A',
  },
  {
    n: 4,
    what: "After a pick in a Typeahead with a value, Done (and a Done that saves first) returns focus to the Token's button",
    tryThis:
      'In demo C (already has a value), pick another person: a dialog opens. Press Done, or "Save, then Done" (waits 0.8 s): focus lands on the Token\'s button, not on a hidden input.',
    fix: "Component: #10544 (BaseTypeahead restore point; Typeahead sends the return to its Token's button)",
    demo: 'C',
  },
  {
    n: 5,
    what: "A click on a custom token's own button keeps focus there",
    tryThis:
      'In demo A, press a token\'s "Pin" button: it toggles and keeps focus; focus does not jump to the text input.',
    fix: "Component: #10624 (Tokenizer keeps a token control's focus)",
    demo: 'A',
  },
  {
    n: 6,
    what: 'A press that ends without a click does not misdirect a later dialog',
    tryThis:
      'In demo A, press a token, drag off it and release (no click). Then press "Open menu": closing it returns focus to the field, not to that token.',
    fix: 'Component: #10624 (Tokenizer forgets a press that never became a click)',
    demo: 'A',
  },
  {
    n: 7,
    what: 'handleRef open() and close(), and a notify-only onOpenChange',
    tryThis:
      'In demo A, press "Open menu" and "Close menu"; the log below the field lists each change onOpenChange reports.',
    fix: 'Component: #10544 (BaseTypeahead handle, onOpenChange) and #10624 (Tokenizer forwards them)',
    demo: 'A',
  },
  {
    n: 9,
    what: "Proposed, not yet in the PRs: Backspace or Delete on a Typeahead's selected Token",
    tryThis:
      'In demo D, Tab to the Token and press Backspace (or Delete): with the clear button, the value clears, a screen reader hears "Cleared …", and focus moves to the empty input. Without it (second field), Backspace starts editing, as a click does.',
    fix: 'Proposed: a separate small PR stacked on #10544 (Typeahead); this preview runs it',
    demo: 'D',
  },
  {
    n: 8,
    what: 'Phone layout (390 px)',
    tryThis:
      'Open this page on a phone: every demo fits and works by touch. Demo A uses presentation="popover", so the phone keeps the inline field (the bottom sheet ignores menu).',
    fix: 'Component layer and layout: #10544; this page: preview only',
    demo: 'all',
  },
];

const CODE_A = `const handle = useRef<TokenizerHandle>(null);
const [editing, setEditing] = useState<Person | null>(null);

<Tokenizer
  label="Share with"
  presentation="popover"
  searchSource={peopleSource}
  value={selected}
  onChange={setSelected}
  handleRef={handle}                        // open() / close()
  onOpenChange={isOpen => log(isOpen)}      // notify only
  menu={
    editing == null
      ? {role: 'listbox'}
      : {
          role: 'dialog',
          label: \`Role for \${editing.label}\`,
          render: ({close}) => <RolePicker onDone={close} />,
        }
  }
  renderToken={(person, onRemove) => (
    <>
      <Button label={person.label} onClick={() => { setEditing(person); handle.current?.open(); }} />
      <Button label="Pin" onClick={togglePin} />   // keeps focus
      <Button label="Remove" onClick={onRemove} />
    </>
  )}
/>`;

const CODE_C = `const handle = useRef<BaseTypeaheadHandle>(null);
const [picked, setPicked] = useState<Person | null>(null);

<Typeahead
  label="Owner"
  searchSource={peopleSource}
  value={owner}
  onChange={person => {
    if (person == null) return;
    setPicked(person);
    handle.current?.open();          // the same menu switches to the dialog
  }}
  handleRef={handle}
  menu={
    picked == null
      ? {role: 'listbox'}
      : {
          role: 'dialog',
          label: \`Make \${picked.label} the owner?\`,
          render: ({close}) => (
            <>
              <Button label="Done" onClick={() => { setOwner(picked); close(); }} />
              <Button label="Save, then Done" onClick={async () => { await save(picked); setOwner(picked); close(); }} />
            </>
          ),
        }
  }
/>`;

const CODE_B = `<BaseTypeahead
  aria-label="Add a filter"
  searchSource={fieldSource}
  value={null}
  onChange={field => { if (field) edit(field); }}   // edit() calls handle.open()
  handleRef={typeahead}
  menu={
    editing == null
      ? {role: 'listbox', render: ({listbox, query}) => (<>
          <Text>{query === '' ? 'Filter by' : \`Fields matching "\${query}"\`}</Text>
          {listbox}
          <Text>Arrow keys move, Enter picks</Text>
        </>)}
      : {role: 'dialog', label: \`\${editing.field.label} filter\`, render: ({close}) => <FilterEditor onApply={close} />}
  }
  anchorRef={fieldRef}
  hasEntriesOnFocus
/>`;

function DemoA() {
  const handle = useRef<TokenizerHandle>(null);
  const [selected, setSelected] = useState<Person[]>([
    people[0] as Person,
    people[1] as Person,
  ]);
  const [editing, setEditing] = useState<Person | null>(null);
  const [roles, setRoles] = useState<Record<string, string>>({
    ada: 'Editor',
    grace: 'Viewer',
  });
  const [pinned, setPinned] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState('Viewer');
  const [log, setLog] = useState<string[]>([]);

  const menu: BaseTypeaheadMenu =
    editing == null
      ? {role: 'listbox'}
      : {
          role: 'dialog',
          label: `Role for ${editing.label}`,
          render: ({close}) => (
            <VStack gap={3} padding={3}>
              <RadioList
                label={`Role for ${editing.label}`}
                value={draft}
                onChange={setDraft}>
                {ROLES.map(role => (
                  <RadioListItem key={role} label={role} value={role} />
                ))}
              </RadioList>
              <HStack gap={2} hAlign="end">
                <Button label="Cancel" variant="secondary" onClick={close} />
                <Button
                  label="Done"
                  variant="primary"
                  onClick={() => {
                    setRoles(current => ({...current, [editing.id]: draft}));
                    close();
                  }}
                />
              </HStack>
            </VStack>
          ),
        };

  return (
    <VStack gap={2}>
      <Tokenizer<Person>
        label="Share with"
        presentation="popover"
        searchSource={peopleSource}
        value={selected}
        onChange={items => setSelected(items)}
        handleRef={handle}
        onOpenChange={isOpen => {
          setLog(current =>
            [
              `${new Date().toLocaleTimeString()} onOpenChange(${isOpen})`,
              ...current,
            ].slice(0, 6),
          );
          if (!isOpen) {
            setEditing(null);
          }
        }}
        menu={menu}
        hasEntriesOnFocus
        renderToken={(person, onRemove) => (
          <HStack gap={1}>
            <Button
              label={`${person.label} · ${roles[person.id] ?? 'Viewer'}`}
              size="sm"
              variant="secondary"
              onClick={() => {
                setEditing(person);
                setDraft(roles[person.id] ?? 'Viewer');
                handle.current?.open();
              }}
            />
            <Button
              label={pinned[person.id] ? 'Pinned' : 'Pin'}
              size="sm"
              variant="secondary"
              onClick={() =>
                setPinned(current => ({
                  ...current,
                  [person.id]: !current[person.id],
                }))
              }
            />
            <Button
              label="Remove"
              size="sm"
              variant="secondary"
              onClick={onRemove}
            />
          </HStack>
        )}
      />
      <HStack gap={2} wrap="wrap">
        <Button
          label="Open menu"
          size="sm"
          onClick={() => handle.current?.open()}
        />
        <Button
          label="Close menu"
          size="sm"
          variant="secondary"
          onClick={() => handle.current?.close()}
        />
      </HStack>
      <Text type="supporting" color="secondary">
        onOpenChange log: {log.length === 0 ? '(nothing yet)' : ''}
      </Text>
      {log.map(line => (
        <Text key={line} type="supporting">
          {line}
        </Text>
      ))}
    </VStack>
  );
}

function DemoC() {
  const handle = useRef<BaseTypeaheadHandle>(null);
  const [owner, setOwner] = useState<Person | null>(people[2] as Person);
  const [picked, setPicked] = useState<Person | null>(null);
  const [saving, setSaving] = useState(false);
  const menu: BaseTypeaheadMenu =
    picked == null
      ? {role: 'listbox'}
      : {
          role: 'dialog',
          label: `Make ${picked.label} the owner?`,
          render: ({close}) => (
            <VStack gap={3} padding={3}>
              <Text>
                Make {picked.label} ({picked.team}) the owner?
              </Text>
              <HStack gap={2} wrap="wrap" hAlign="end">
                <Button
                  label="Done"
                  variant="primary"
                  onClick={() => {
                    setOwner(picked);
                    close();
                  }}
                />
                <Button
                  label={saving ? 'Saving…' : 'Save, then Done'}
                  variant="secondary"
                  onClick={async () => {
                    setSaving(true);
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setSaving(false);
                    setOwner(picked);
                    close();
                  }}
                />
              </HStack>
            </VStack>
          ),
        };
  return (
    <Typeahead<Person>
      label="Owner"
      searchSource={peopleSource}
      value={owner}
      onChange={person => {
        if (person == null) {
          setOwner(null);
          return;
        }
        setPicked(person);
        handle.current?.open();
      }}
      onOpenChange={isOpen => {
        if (!isOpen) {
          setPicked(null);
        }
      }}
      handleRef={handle}
      menu={menu}
      hasEntriesOnFocus
    />
  );
}

const CODE_D = `<Typeahead label="Owner" searchSource={peopleSource} value={owner} onChange={setOwner} />
// hasClear is on by default: Backspace or Delete on the focused Token clears,
// announces "Cleared Ada Lovelace" and focuses the empty input.

<Typeahead label="Reviewer" searchSource={peopleSource} value={reviewer} onChange={setReviewer} hasClear={false} />
// Without the clear button: Backspace on the Token starts editing.`;

function DemoD() {
  const [owner, setOwner] = useState<Person | null>(people[0] as Person);
  const [reviewer, setReviewer] = useState<Person | null>(people[3] as Person);
  return (
    <VStack gap={3}>
      <Typeahead<Person>
        label="Owner"
        searchSource={peopleSource}
        value={owner}
        onChange={setOwner}
        hasEntriesOnFocus
      />
      <Typeahead<Person>
        label="Reviewer (no clear button)"
        searchSource={peopleSource}
        value={reviewer}
        onChange={setReviewer}
        hasClear={false}
        hasEntriesOnFocus
      />
    </VStack>
  );
}

function Behaviors({demo}: {demo: string}) {
  return (
    <VStack gap={2}>
      {BEHAVIORS.filter(
        b => b.demo === demo || (demo === 'A' && b.demo === 'all'),
      ).map(b => (
        <VStack key={b.n} gap={0.5}>
          <Text weight="bold">
            {b.n}. {b.what}
          </Text>
          <Text>Try this: {b.tryThis}</Text>
          <Text type="supporting" color="secondary">
            Where the fix lives: {b.fix}
          </Text>
        </VStack>
      ))}
    </VStack>
  );
}

export default function TypeaheadMenuDemoPage() {
  return (
    <VStack gap={6} padding={4} xstyle={undefined}>
      <VStack gap={1}>
        <Heading level={1}>BaseTypeahead menu group: every behavior</Heading>
        <Text color="secondary">
          Built on the group&apos;s exact heads (#10544 → #10624 → #10625). Each
          behavior names where its fix lives: a component PR, or the docsite
          example only.
        </Text>
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>
          A · Tokenizer with a dialog menu from a token
        </Heading>
        <Behaviors demo="A" />
        <DemoA />
        <CodeBlock code={CODE_A} language="tsx" />
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>
          B · BaseTypeahead listbox menu (the docsite example)
        </Heading>
        <Behaviors demo="B" />
        <BaseTypeaheadMenuBlock />
        <CodeBlock code={CODE_B} language="tsx" />
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>
          C · Typeahead with a value: pick, then Done or Save-then-Done
        </Heading>
        <Behaviors demo="C" />
        <DemoC />
        <CodeBlock code={CODE_C} language="tsx" />
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>
          D · Proposed: Backspace on a Typeahead Token (not yet in the PRs)
        </Heading>
        <Behaviors demo="D" />
        <DemoD />
        <CodeBlock code={CODE_D} language="tsx" />
      </VStack>
    </VStack>
  );
}
